/*
  Projet: Green IT - Ubelicious
  Créé par: Maël Castellan, Laura Donato, Rémi Desjardins, Anne-Laure Parguet et Loriana Ratovo
*/

// Attend que le DOM soit totalement chargé
document.addEventListener("DOMContentLoaded", async () => {
  // Sélectionne le conteneur principal des recommandations
  const container = document.getElementById("reco-container");
  // Récupère l'utilisateur connecté depuis le localStorage
  const utilisateur = JSON.parse(localStorage.getItem("user"));

  // Si l'utilisateur n'est pas connecté, afficher un message et arrêter
  if (!utilisateur) {
    container.innerHTML =
      "<p>Vous devez être connecté pour voir vos recommandations.</p>";
    return;
  }

  try {
    // Appelle l'API pour récupérer les recommandations de l'utilisateur
    const res = await fetch(
      `/api/recommandations/utilisateur/${utilisateur.id_utilisateur}`
    );
    const recommandations = await res.json();

    // Si aucune recommandation, afficher un message
    if (!recommandations.length) {
      container.innerHTML =
        "<p>Vous n'avez publié aucune recommandation pour le moment.</p>";
      return;
    }

    // Réinitialise le conteneur
    container.innerHTML = "";

    // Pour chaque recommandation reçue
    recommandations.forEach((reco) => {
      const card = document.createElement("div");
      card.classList.add("recommandation-card");

      // Remplit la carte avec les informations de la recommandation
      card.innerHTML = `
                <h3>${reco.titre}</h3>
                <p><strong>Auteur :</strong> ${reco.auteur}</p>
                <p><strong>Contenu :</strong> ${reco.contenu}</p>
                <p><strong>Date :</strong> ${new Date(
                  reco.dateCreation
                ).toLocaleDateString()}</p>
            `;

      // Si l'utilisateur connecté est l'auteur, ajouter un bouton de suppression
      if (utilisateur && utilisateur.id_utilisateur === reco.id_utilisateur) {
        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.innerHTML =
          '<img src="/img/supprimer_icone.png" alt="Supprimer" />';
        boutonSupprimer.style.backgroundColor = "transparent";
        boutonSupprimer.style.border = "none";
        boutonSupprimer.style.marginTop = "40px";
        boutonSupprimer.style.cursor = "pointer";
        boutonSupprimer.classList.add("delete-button");

        const imageBouton = boutonSupprimer.querySelector("img");
        imageBouton.style.width = "30px";
        imageBouton.style.height = "30px";
        imageBouton.style.position = "absolute";
        imageBouton.style.bottom = "2.1rem";

        // Action lorsqu'on clique sur supprimer
        boutonSupprimer.addEventListener("click", async () => {
          const confirmation = confirm("Supprimer cette recommandation ?");
          if (confirmation) {
            try {
              const res = await fetch(
                `/api/recommandations/${reco.id_recommandation}`,
                { method: "DELETE" }
              );
              if (res.ok) {
                alert("Recommandation supprimée !");
                location.reload();
              } else {
                alert("Erreur lors de la suppression.");
              }
            } catch (err) {
              console.error("Erreur lors de la suppression :", err);
              alert("Erreur réseau.");
            }
          }
        });

        // Ajoute le bouton à la carte
        card.appendChild(boutonSupprimer);
      }

      // Ajoute la carte au conteneur
      container.appendChild(card);
    });
  } catch (error) {
    // Si erreur lors de la récupération des recommandations
    container.innerHTML =
      "<p>Erreur lors du chargement des recommandations.</p>";
    console.error(error);
  }
});

// Gestion du menu hamburger pour afficher/masquer la navbar
const hamburger = document.querySelector(".hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("active");
});
