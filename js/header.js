/*
  Projet: Green IT - Ubelicious
  Créé par: Maël Castellan, Laura Donato, Rémi Desjardins, Anne-Laure Parguet et Loriana Ratovo
*/

// Gérer le lien "Compte"
const linkCompte = document.getElementById("link-compte");

if (linkCompte) {
  linkCompte.addEventListener("click", (e) => {
    e.preventDefault(); // Empêche la redirection automatique

    const utilisateur = JSON.parse(localStorage.getItem("user")); // Récupère l'utilisateur depuis localStorage

    if (utilisateur && utilisateur.id_utilisateur) {
      // Si l'utilisateur est connecté, redirige vers ses recommandations
      window.location.href = "/html/mes_recommandations.html";
    } else {
      // Sinon, redirige vers la page de connexion
      window.location.href = "/html/connexion.html";
    }
  });
}

// Gérer le bouton de déconnexion
const logoutButton = document.getElementById("logout-btn");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    // Supprime l'utilisateur du localStorage lors de la déconnexion
    localStorage.removeItem("user");
    localStorage.setItem("connected", "false");
    window.location.href = "/html/connexion.html"; // Redirige vers la page de connexion
  });
}

// Affiche ou cache le bouton "Déconnexion" en fonction de l'état de connexion
const utilisateurConnecte = JSON.parse(localStorage.getItem("user"));

if (logoutButton) {
  if (utilisateurConnecte && utilisateurConnecte.id_utilisateur) {
    logoutButton.style.display = "inline-block"; // Affiche le bouton si connecté
  } else {
    logoutButton.style.display = "none"; // Cache le bouton si non connecté
  }

  logoutButton.addEventListener("click", () => {
    // Gestion de la déconnexion lors du clic
    localStorage.removeItem("user");
    localStorage.setItem("connected", "false");
    window.location.href = "/html/connexion.html";
  });
}
