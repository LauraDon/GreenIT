document.addEventListener("DOMContentLoaded", async() => {
    const listeLieux = document.getElementById("liste-lieux");
    const utilisateur = JSON.parse(localStorage.getItem("user")) || {};

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

            // Vérifier si l'utilisateur connecté est l'auteur
            if (utilisateur && utilisateur.id_utilisateur === lieu.id_utilisateur) {
                const boutonSupprimer = document.createElement("button");
                boutonSupprimer.textContent = "Supprimer";
                boutonSupprimer.classList.add("delete-button");
                boutonSupprimer.addEventListener("click", async() => {
                    const confirmation = confirm("Supprimer cette recommandation ?");
                    if (confirmation) {
                        try {
                            const res = await fetch(`/api/recommandations/${lieu.id_recommandation}`, { method: "DELETE" });
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
                card.appendChild(boutonSupprimer);
            }

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
        alert("Tu dois être connecté pour ajouter une recommandation !");
        window.location.href = "/html/connexion.html";
    } else {
        window.location.href = "/html/reco_ajout.html";
    }
});