let nxtDiv = null;
let updateInterval = null;

function removeWidget() {
    if (nxtDiv) {
        nxtDiv.remove();
        nxtDiv = null;
    }
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function createWidget() {
    if (document.getElementById('nxt-root')) return;

    nxtDiv = document.createElement('div');
    nxtDiv.id = 'nxt-root';
    nxtDiv.style.cssText = "position:fixed;top:20px;right:20px;z-index:999999;background:#232428;color:white;padding:0;border-radius:8px;border:3px solid #f04747;font-family:sans-serif;box-shadow:0 10px 25px rgba(0,0,0,0.6);width:200px;user-select:none;overflow:hidden;";
    
    nxtDiv.innerHTML = `
        <div id="nxt-header" style="background:#f04747;padding:8px 12px;cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:bold;font-size:12px;">
            <span>NEXTERA BOT</span>
            <div id="nxt-toggle" style="cursor:pointer;background:#232428;width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:0;">-</div>
        </div>
        <div id="nxt-body" style="padding:10px;background:#232428;">
            <div id="nxt-msg" style="color:#f04747;font-weight:bold;font-size:11px;text-align:center;margin-bottom:10px;">ACTION REQUIRED ON DISCORD</div>
            <div id="nxt-stats" style="display:none;">
                <div style="font-size:12px;margin-bottom:8px;border-bottom:1px solid #4f545c;padding-bottom:5px;">Lvl: <span id="nxt-lvl">-</span> | XP: <span id="nxt-xp">-</span></div>
                <div id="nxt-loot" style="font-size:11px;max-height:200px;overflow-y:auto;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(nxtDiv);

    // Toggle (Réduire/Agrandir)
    const body = document.getElementById('nxt-body');
    const toggleBtn = document.getElementById('nxt-toggle');
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        toggleBtn.innerText = isHidden ? '-' : '+';
        nxtDiv.style.width = isHidden ? '200px' : '130px';
    };

    // Drag & Drop
    let isDragging = false, offset = [0,0];
    document.getElementById('nxt-header').onmousedown = (e) => {
        if(e.target === toggleBtn) return;
        isDragging = true;
        offset = [nxtDiv.offsetLeft - e.clientX, nxtDiv.offsetTop - e.clientY];
    };
    document.addEventListener('mousemove', (e) => {
        if (isDragging && nxtDiv) {
            nxtDiv.style.left = (e.clientX + offset[0]) + 'px';
            nxtDiv.style.top = (e.clientY + offset[1]) + 'px';
            nxtDiv.style.right = 'auto';
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // Lancement de la boucle de stats interne
    startUpdateLoop();
}

function startUpdateLoop() {
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(() => {
        if (!nxtDiv) return;
        chrome.runtime.sendMessage({type: "GET_STATUS"}, (res) => {
            if (!res) return;
            const header = document.getElementById('nxt-header');
            const msg = document.getElementById('nxt-msg');
            const statsArea = document.getElementById('nxt-stats');

            if (res.hasToken) {
                nxtDiv.style.borderColor = "#3ba55e";
                header.style.background = "#3ba55e";
                msg.style.display = "none";
                statsArea.style.display = "block";
                document.getElementById('nxt-lvl').innerText = res.level;
                document.getElementById('nxt-xp').innerText = res.xp.toLocaleString();
                
                let lootHtml = "";
                for (const [name, qty] of Object.entries(res.resources)) {
                    lootHtml += `<div style="display:flex;justify-content:space-between;margin-bottom:2px;border-bottom:1px solid #2f3136;"><span>${name}</span><span style="color:#3ba55e">+${qty}</span></div>`;
                }
                document.getElementById('nxt-loot').innerHTML = lootHtml || "No loot yet";
            } else if (res.lastCode.includes("Retry")) {
                nxtDiv.style.borderColor = "#faa61a";
                header.style.background = "#faa61a";
                msg.innerText = "RATE LIMIT... WAITING";
                msg.style.color = "#faa61a";
            } else {
                nxtDiv.style.borderColor = "#f04747";
                header.style.background = "#f04747";
                msg.innerText = "ACTION REQUIRED ON DISCORD";
                msg.style.color = "#f04747";
                statsArea.style.display = "none";
            }
        });
    }, 1000);
}

// --- GESTION DES MESSAGES ET INITIALISATION ---
chrome.storage.local.get(['injectMode', 'widgetEnabled'], (res) => {
    const isDiscord = window.location.hostname.includes('discord.com');
    const mode = res.injectMode || 'discord';
    if (mode === 'discord' && !isDiscord) return;

    if (res.widgetEnabled !== false) createWidget();
});

chrome.runtime.onMessage.addListener((m) => {
    if (m.type === "UPDATE_WIDGET_VISIBILITY") {
        if (m.state === true) {
            // On vérifie le mode avant de recréer
            chrome.storage.local.get(['injectMode'], (res) => {
                const isDiscord = window.location.hostname.includes('discord.com');
                if ((res.injectMode || 'discord') === 'discord' && !isDiscord) return;
                createWidget();
            });
        } else {
            removeWidget();
        }
    }
});