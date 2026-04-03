let lastStartReq = null;
let lastCompReq = null;
let stats = { 
    cycles: 0, 
    lastCode: "Awaiting Action", 
    hasToken: false,
    xp: 0,
    level: 0,
    resources: {} 
};

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const isStart = details.url.includes("/start");
        const isComp = details.url.includes("/complete");
        if (isStart || isComp) {
            const headers = {};
            details.requestHeaders.forEach(h => { headers[h.name] = h.value; });
            if (isStart) lastStartReq = { url: details.url, headers: headers };
            else lastCompReq = { url: details.url, headers: headers };

            if (lastStartReq && lastCompReq && !stats.hasToken) {
                stats.hasToken = true;
                stats.lastCode = "Active";
                runReplayLoop();
            }
        }
    },
    { urls: ["https://discord.com/api/v9/*"] },
    ["requestHeaders"]
);

async function runReplayLoop() {
    if (!lastStartReq || !lastCompReq || !stats.hasToken) return;
    try {
        const resS = await fetch(lastStartReq.url, { method: "POST", headers: lastStartReq.headers });
        if (resS.status === 200 || resS.status === 204) {
            await new Promise(r => setTimeout(r, 850));
            const resC = await fetch(lastCompReq.url, { method: "POST", headers: lastCompReq.headers });
            stats.lastCode = "OK";
            if (resC.status === 200 || resC.status === 204) {
                const data = await resC.json();
                if (data.user_data) { stats.xp = data.user_data.xp; stats.level = data.user_data.level; }
                if (data.changes) {
                    for (const [item, amount] of Object.entries(data.changes)) {
                        stats.resources[item] = (stats.resources[item] || 0) + amount;
                    }
                }
                stats.cycles++;
            } else if (resC.status === 404) { 
                stats.hasToken = false; stats.lastCode = "Session Expired"; 
            }
        } else if (resS.status === 429) {
            stats.lastCode = "Retry (Limit)";
            await new Promise(r => setTimeout(r, 5000));
        } else {
            stats.lastCode = "Error " + resS.status;
        }
    } catch (e) { stats.lastCode = "Net Error"; }
    
    if (stats.hasToken) setTimeout(runReplayLoop, 1100);
}

chrome.runtime.onMessage.addListener((m, s, res) => {
    if (m.type === "GET_STATUS") res(stats);
    return true;
});