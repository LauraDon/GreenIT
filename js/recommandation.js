document.addEventListener("DOMContentLoaded", async () => {
  const listeLieux = document.getElementById("liste-lieux");

  try {
    const response = await fetch("/api/recommandations");
    const lieux = await response.json();

    if (lieux.length === 0) {
      listeLieux.innerHTML = "<p>Aucun lieu recommandé pour le moment.</p>";
      return;
    }

    lieux.forEach((lieu) => {
      const card = document.createElement("div");
      card.classList.add("lieu-card");

      card.innerHTML = `
              <h3>${lieu.titre}</h3>
              <p><strong>Adresse :</strong> ${lieu.lieu}</p>
              <p><strong>Commentaire :</strong> ${lieu.contenu}</p>
          `;

      listeLieux.appendChild(card);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des lieux :", error);
    listeLieux.innerHTML = "<p>Erreur de chargement des lieux.</p>";
  }
});

document.querySelector(".add-button").addEventListener("click", () => {
  const isConnected = localStorage.getItem("connected") === "true";

  if (!isConnected) {
    document.getElementById("login-overlay").classList.remove("hidden");
  } else {
    // Ici tu peux ouvrir le vrai formulaire pour ajouter un lieu
    console.log("Ajout d’un lieu autorisé");
  }
});
