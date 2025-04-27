/*
  Projet: Green IT - Ubelicious
  Créé par: Maël Castellan, Laura Donato, Rémi Desjardins, Anne-Laure Parguet et Loriana Ratovo
*/

// --- Correction: attacher l'event listener sans attendre DOMContentLoaded ---
function attachOverlayButtonListener() {
  const addButton = document.getElementById("btn-overlay-add");
  const overlayAjout = document.getElementById("overlay-ajout");

  if (addButton && overlayAjout) {
    addButton.addEventListener("click", () => {
      const isConnected = localStorage.getItem("connected") === "true";

      if (!isConnected) {
        alert("Tu dois être connecté pour ajouter une recommandation !");
        window.location.href = "/html/connexion.html";
      } else {
        overlayAjout.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    });
  } else {
    setTimeout(attachOverlayButtonListener, 100); // réessaie dans 100ms si pas prêt
  }
}

attachOverlayButtonListener();

// Attend que le DOM soit chargé
document.addEventListener("DOMContentLoaded", async () => {
  const listeLieux = document.getElementById("liste-lieux"); // Conteneur des lieux
  const utilisateur = JSON.parse(localStorage.getItem("user")) || {}; // Récupère l'utilisateur connecté
  const overlayAjout = document.getElementById("overlay-ajout"); // Overlay pour ajouter une recommandation

  try {
    // Récupère toutes les recommandations via l'API
    const response = await fetch("/api/recommandations");
    const lieux = await response.json();

    // Si aucune recommandation disponible
    if (lieux.length === 0) {
      listeLieux.innerHTML = "<p>Aucun lieu recommandé pour le moment.</p>";
      return;
    }

    // Affiche chaque lieu sous forme de carte
    lieux.forEach((lieu) => {
      const card = document.createElement("div");
      card.classList.add("lieu-card");

      // Remplit la carte avec les informations du lieu
      card.innerHTML = `
              <h3>${lieu.titre}</h3>
              <p><strong>Adresse :</strong> ${lieu.lieu}</p>
              <p><strong>Commentaire :</strong> ${lieu.contenu}</p>
            `;

      // Si l'utilisateur connecté est un administrateur
      if (utilisateur && utilisateur.estAdmin === 1) {
        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.innerHTML =
          '<img src="/img/supprimer_icone.webp" alt="Supprimer" />';
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

        // Ajoute un événement pour supprimer la recommandation
        boutonSupprimer.addEventListener("click", async () => {
          const confirmation = confirm("Supprimer cette recommandation ?");
          if (confirmation) {
            try {
              const res = await fetch(
                `/api/recommandations/${lieu.id_recommandation}`,
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

      // Ajoute la carte dans la liste
      listeLieux.appendChild(card);
    });
  } catch (error) {
    // En cas d'erreur lors du chargement
    console.error("Erreur lors du chargement des lieux :", error);
    listeLieux.innerHTML = "<p>Erreur de chargement des lieux.</p>";
  }

  // Gère la fermeture de l'overlay d'ajout
  document.getElementById("close-overlay").addEventListener("click", () => {
    overlayAjout.classList.add("hidden");
    document.body.style.overflow = "";
  });

  // Gestion du formulaire d'ajout d'une nouvelle recommandation
  const form = document.getElementById("form-recommandation");
  const message = document.getElementById("message");

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    message.innerText =
      "Tu dois être connecté pour publier une recommandation.";
    form.style.display = "none";
    return;
  }

  // Lors de la soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titre = form.elements["titre"].value.trim();
    const lieu = form.elements["description"].value.trim();
    const contenu = form.elements["commentaire"].value.trim();

    // Vérifie que tous les champs sont remplis
    if (!titre || !lieu || !contenu) {
      message.innerText = "Tous les champs sont obligatoires.";
      return;
    }

    try {
      // Envoie la nouvelle recommandation au serveur
      const res = await fetch("/api/recommandations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre,
          lieu,
          contenu,
          id_utilisateur: user.id_utilisateur,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        window.location.href = "/html/recommandation.html"; // Redirige après ajout
        form.reset();
      } else {
        message.innerText = result.error || "Erreur lors de l’ajout.";
      }
    } catch (err) {
      console.error(err);
      message.innerText = "Erreur serveur.";
    }
  });
});

// Gestion du menu hamburger pour afficher/masquer la navbar
const hamburger = document.querySelector(".hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("active");
});
