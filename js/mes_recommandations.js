document.addEventListener("DOMContentLoaded", async() => {
    const container = document.getElementById("reco-container");
    const utilisateur = JSON.parse(localStorage.getItem("user"));

    if (!utilisateur) {
        container.innerHTML = "<p>Vous devez être connecté pour voir vos recommandations.</p>";
        return;
    }

    try {
        const res = await fetch(`/api/recommandations/utilisateur/${utilisateur.id_utilisateur}`);
        const recommandations = await res.json();

        if (!recommandations.length) {
            container.innerHTML = "<p>Vous n'avez publié aucune recommandation pour le moment.</p>";
            return;
        }

        container.innerHTML = "";
        recommandations.forEach((reco) => {
            const card = document.createElement("div");
            card.classList.add("recommandation-card");

            card.innerHTML = `
                <h3>${reco.titre}</h3>
                <p><strong>Auteur :</strong> ${reco.auteur}</p>
                <p><strong>Contenu :</strong> ${reco.contenu}</p>
                <p><strong>Date :</strong> ${new Date(reco.dateCreation).toLocaleDateString()}</p>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = "<p>Erreur lors du chargement des recommandations.</p>";
        console.error(error);
    }
});