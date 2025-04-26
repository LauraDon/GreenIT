// Gérer le lien "Compte"
const linkCompte = document.getElementById("link-compte");

if (linkCompte) {
    linkCompte.addEventListener("click", (e) => {
        e.preventDefault();

        const utilisateur = JSON.parse(localStorage.getItem("user"));

        if (utilisateur && utilisateur.id_utilisateur) {
            window.location.href = "/html/mes_recommandations.html";
        } else {
            window.location.href = "/html/connexion.html";
        }
    });
}

const logoutButton = document.getElementById('logout-btn');

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.setItem('connected', 'false');
        window.location.href = '/html/connexion.html';
    });
}

// Bouton "Déconnexion" uniquement si connecté
const utilisateurConnecte = JSON.parse(localStorage.getItem('user'));

if (logoutButton) {
    if (utilisateurConnecte && utilisateurConnecte.id_utilisateur) {
        logoutButton.style.display = "inline-block"; // Afficher si connecté
    } else {
        logoutButton.style.display = "none"; // Cacher sinon
    }

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.setItem('connected', 'false');
        window.location.href = '/html/connexion.html';
    });
}