document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.querySelector(".btn-connect");

  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!nom || !prenom || !email || !password || !confirmPassword) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Compte créé avec succès !");
        window.location.href = "/html/connexion.html";
      } else {
        alert(result.message || "Erreur lors de la création du compte.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  });
});
