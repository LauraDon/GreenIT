document.addEventListener("DOMContentLoaded", () => {
  // Utilisateur
  const userLoginBtn = document.querySelector(".login-box:nth-of-type(1) .btn");
  const userEmailInput = document.querySelector(
    ".login-box:nth-of-type(1) input[type='email']"
  );
  const userPasswordInput = document.querySelector(
    ".login-box:nth-of-type(1) input[type='password']"
  );

  userLoginBtn.addEventListener("click", async () => {
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();

    if (!email || !password) {
      alert("Merci de remplir tous les champs utilisateur.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Connexion utilisateur réussie !");
        window.location.href = "/html/index.html"; // redirection après login
      } else {
        alert(result.message || "Erreur lors de la connexion utilisateur.");
      }
    } catch (error) {
      alert("Erreur serveur. Veuillez réessayer.");
      console.error(error);
    }
  });

  // Admin
  const adminLoginBtn = document.querySelector(
    ".login-box:nth-of-type(2) .btn"
  );
  const adminEmailInput = document.querySelector(
    ".login-box:nth-of-type(2) input[type='email']"
  );
  const adminPasswordInput = document.querySelector(
    ".login-box:nth-of-type(2) input[type='password']"
  );
  const adminIdInput = document.querySelector(
    ".login-box:nth-of-type(2) input[type='text']"
  );

  adminLoginBtn.addEventListener("click", async () => {
    const email = adminEmailInput.value.trim();
    const password = adminPasswordInput.value.trim();
    const immatriculation = adminIdInput.value.trim();

    if (!email || !password || !immatriculation) {
      alert("Merci de remplir tous les champs administrateur.");
      return;
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, immatriculation }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Connexion administrateur réussie !");
        window.location.href = "/html/admin-recette.html"; // redirection après login admin
      } else {
        alert(result.message || "Erreur lors de la connexion admin.");
      }
    } catch (error) {
      alert("Erreur serveur. Veuillez réessayer.");
      console.error(error);
    }
  });
});
