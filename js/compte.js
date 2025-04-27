/*
  Projet: Green IT - Ubelicious
  Créé par: Maël Castellan, Laura Donato, Rémi Desjardins, Anne-Laure Parguet et Loriana Ratovo
*/

// Code exécuté une fois que tout le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne le bouton d'inscription
  const registerBtn = document.querySelector(".btn-connect");

  // Récupère tous les champs du formulaire
  const inputs = [
    document.getElementById("nom"),
    document.getElementById("prenom"),
    document.getElementById("email"),
    document.getElementById("password"),
    document.getElementById("confirm-password"),
  ];

  // Sélectionne les éléments nécessaires pour la gestion du mot de passe
  const passwordInput = document.getElementById("password");
  /*const submitButton = document.querySelector(".btn-connect");*/ // Ligne inutilisée
  const strengthBar = document.getElementById("password-strength-bar");
  const togglePasswordIcons = document.querySelectorAll(".toggle-password");

  // Sélectionne les éléments pour la barre de navigation
  const hamburger = document.querySelector(".hamburger");
  const navbar = document.getElementById("navbar");

  // Permet d'appuyer sur "Entrée" pour déclencher l'inscription
  inputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Empêche l'envoi du formulaire par défaut
        registerBtn.click(); // Simule un clic sur le bouton
      }
    });
  });

  // Gestion du clic sur "S'inscrire"
  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut

    // Récupération des valeurs saisies
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Vérification que tous les champs sont remplis
    if (!nom || !prenom || !email || !password || !confirmPassword) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérification de la robustesse du mot de passe
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(password)) {
      alert(
        "Le mot de passe doit contenir au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    // Envoi de la requête pour l'inscription
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        /*alert("Compte créé avec succès !");*/ // Ligne commentée
        window.location.href = "/html/index.html"; // Redirige vers la page d'accueil
      } else {
        alert(result.message || "Erreur lors de la création du compte.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  });

  // Met à jour la barre de force du mot de passe à chaque saisie
  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    updateStrengthBar(password);
  });

  // Fonction qui met à jour visuellement la force du mot de passe
  function updateStrengthBar(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;

    let width = (strength / 5) * 100;
    strengthBar.style.width = width + "%";

    if (strength <= 2) {
      strengthBar.style.backgroundColor = "red"; // Faible
    } else if (strength === 3 || strength === 4) {
      strengthBar.style.backgroundColor = "orange"; // Moyen
    } else {
      strengthBar.style.backgroundColor = "green"; // Fort
    }
  }

  // Affiche/masque le mot de passe en cliquant sur l'icône œil
  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text";
        icon.src = "/img/oeil_ferme.png"; // Change l'icône
      } else {
        input.type = "password";
        icon.src = "/img/oeil_ouvert.png"; // Remet l'icône initiale
      }
    });
  });

  // Menu hamburger : ouvre/ferme le menu de navigation
  hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
});
