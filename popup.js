const select = document.getElementById('injectMode');
const toggleBtn = document.getElementById('toggleWidget');
const statusDot = document.getElementById('status-dot');

// 1. Initialisation : Charger les paramètres sauvegardés
chrome.storage.local.get(['injectMode', 'widgetEnabled'], (res) => {
    // Mode d'injection (Par défaut : Discord Only)
    if (res.injectMode) {
        select.value = res.injectMode;
    } else {
        chrome.storage.local.set({ injectMode: 'discord' });
    }

    // État du widget (Par défaut : Activé)
    let isEnabled = res.widgetEnabled !== false;
    updateUI(isEnabled);
});

// 2. Changer le mode d'injection
select.onchange = () => {
    chrome.storage.local.set({ injectMode: select.value });
};

// 3. Activer / Désactiver le Widget (Sans Refresh)
toggleBtn.onclick = () => {
    chrome.storage.local.get(['widgetEnabled'], (res) => {
        let newState = res.widgetEnabled === false; // Toggle l'état
        chrome.storage.local.set({ widgetEnabled: newState }, () => {
            updateUI(newState);
            
            // Envoyer le signal à tous les onglets ouverts
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { 
                        type: "UPDATE_WIDGET_VISIBILITY", 
                        state: newState 
                    }).catch(() => {}); // Ignorer les erreurs sur les pages système (ex: chrome://)
                });
            });
        });
    });
};

// Met à jour l'apparence du bouton
function updateUI(enabled) {
    toggleBtn.innerText = enabled ? "HIDE WIDGET" : "SHOW WIDGET";
    toggleBtn.className = enabled ? "btn-toggle" : "btn-toggle off";
}

// 4. Boucle de mise à jour des statistiques (Pop-up ouverte)
setInterval(() => {
    chrome.runtime.sendMessage({type: "GET_STATUS"}, (res) => {
        if (!res) return;

        // Mise à jour Level & XP
        document.getElementById('pop-lvl').innerText = res.level || "0";
        document.getElementById('pop-xp').innerText = res.xp ? res.xp.toLocaleString() : "0";
        
        // Couleur du point (Actif / Inactif)
        statusDot.style.color = res.hasToken ? "#3ba55e" : "#f04747";

        // Mise à jour du Loot
        const lootContainer = document.getElementById('pop-loot');
        let lootHtml = "";
        const resources = Object.entries(res.resources);

        if (resources.length > 0) {
            resources.forEach(([name, qty]) => {
                lootHtml += `
                    <div class="loot-item">
                        <span style="text-transform:capitalize;">${name}</span>
                        <span style="color:#3ba55e; font-weight:bold;">+${qty}</span>
                    </div>`;
            });
            lootContainer.innerHTML = lootHtml;
        } else {
            lootContainer.innerHTML = '<div style="text-align:center; color:#72767d; font-style:italic;">No loot recorded.</div>';
        }
    });
}, 1000);