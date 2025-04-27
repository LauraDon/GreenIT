/*
  Projet: Green IT - Ubelicious
  Créé par: Maël Castellan, Laura Donato, Rémi Desjardins, Anne-Laure Parguet et Loriana Ratovo
*/

// Exécute le code lorsque le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  // Partie Utilisateur

  // Sélectionne le bouton de connexion utilisateur
  const userLoginBtn = document.querySelector(".login-box:nth-of-type(1) .btn");
  // Sélectionne les champs email et mot de passe utilisateur
  const userEmailInput = document.querySelector(
    ".login-box:nth-of-type(1) input[type='email']"
  );
  const userPasswordInput = document.querySelector(
    ".login-box:nth-of-type(1) input[type='password']"
  );

  // Permet d'appuyer sur Entrée pour valider la connexion utilisateur
  [userEmailInput, userPasswordInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        userLoginBtn.click();
      }
    });
  });

  // Clic sur le bouton de connexion utilisateur
  userLoginBtn.addEventListener("click", async () => {
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();

    // Vérifie que tous les champs sont remplis
    if (!email || !password) {
      alert("Merci de remplir tous les champs utilisateur.");
      return;
    }

    // Envoie la requête de connexion utilisateur
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        const utilisateur = result.utilisateur;
        // Stocke les infos de connexion dans localStorage
        localStorage.setItem("connected", "true");
        localStorage.setItem("user", JSON.stringify(utilisateur));
        /*alert("Connexion utilisateur réussie !");*/
        window.location.href = "/html/index.html"; // Redirection après login
      } else {
        alert(result.message || "Erreur lors de la connexion utilisateur.");
      }
    } catch (error) {
      alert("Erreur serveur. Veuillez réessayer.");
      console.error(error);
    }
  });

  // Partie Admin

  // Sélectionne le bouton de connexion admin
  const adminLoginBtn = document.querySelector(
    ".login-box:nth-of-type(2) .btn"
  );
  // Sélectionne les champs email, mot de passe et immatriculation admin
  const adminEmailInput = document.querySelector(
    ".login-box:nth-of-type(2) input[type='email']"
  );
  const adminPasswordInput = document.querySelector(
    ".login-box:nth-of-type(2) input[type='password']"
  );
  const adminIdInput = document.querySelector(
    ".login-box:nth-of-type(2) input[type='text']"
  );

  // Permet d'appuyer sur Entrée pour valider la connexion admin
  [adminEmailInput, adminPasswordInput, adminIdInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        adminLoginBtn.click();
      }
    });
  });

  // Clic sur le bouton de connexion admin
  adminLoginBtn.addEventListener("click", async () => {
    const email = adminEmailInput.value.trim();
    const password = adminPasswordInput.value.trim();
    const immatriculation = adminIdInput.value.trim();

    // Vérifie que tous les champs sont remplis
    if (!email || !password || !immatriculation) {
      alert("Merci de remplir tous les champs administrateur.");
      return;
    }

    // Envoie la requête de connexion admin
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, immatriculation }),
      });

      const result = await response.json();
      if (response.ok) {
        const utilisateur = result.utilisateur;
        // Stocke les infos de connexion admin dans localStorage
        localStorage.setItem("connected", "true");
        localStorage.setItem("user", JSON.stringify(utilisateur));
        /*alert("Connexion administrateur réussie !");*/
        window.location.href = "/html/index.html"; // Redirection après login
      } else {
        alert(result.message || "Erreur lors de la connexion admin.");
      }
    } catch (error) {
      alert("Erreur serveur. Veuillez réessayer.");
      console.error(error);
    }
  });

  // Gestion de l'affichage/masquage des mots de passe (œil ouvert/fermé)
  const togglePasswordIcons = document.querySelectorAll(".toggle-password");

  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text"; // Affiche le mot de passe
        icon.src = "/img/oeil_ferme.png"; // Change l'icône
      } else {
        input.type = "password"; // Cache le mot de passe
        icon.src = "/img/oeil_ouvert.png"; // Change l'icône
      }
    });
  });
});

// Gestion du menu hamburger pour mobile
const hamburger = document.querySelector(".hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("active"); // Ouvre ou ferme le menu
});
