document.addEventListener("DOMContentLoaded", async() => {
    const form = document.getElementById("form-modifier-recette");
    const params = new URLSearchParams(window.location.search);
    const recetteId = params.get("id");

    if (!recetteId) {
        alert("Aucune recette sélectionnée !");
        return;
    }
    try {
        const response = await fetch(`/api/recettes/${recetteId}`);
        const recette = await response.json();

        document.getElementById("titre").value = recette.titre;
        document.getElementById("urlImage").value = recette.urlImage || "";
        document.getElementById("description").value = recette.description;
        document.getElementById("ingredients").value = recette.ingredients;
        document.getElementById("tempsPreparation").value = recette.tempsPreparation || "";
        document.getElementById("tempsCuisson").value = recette.tempsCuisson || "";
        document.getElementById("niveau_difficulte").value = recette.niveau_difficulte || "";
        document.getElementById("etapes").value = recette.etapes;
    } catch (error) {
        console.error("Erreur lors du chargement de la recette :", error);
        alert("Erreur lors du chargement de la recette");
    }

    form.addEventListener("submit", async(e) => {
        e.preventDefault();

        const recetteModifiee = {
            titre: document.getElementById("titre").value,
            urlImage: document.getElementById("urlImage").value,
            description: document.getElementById("description").value,
            ingredients: document.getElementById("ingredients").value,
            tempsPreparation: document.getElementById("tempsPreparation").value,
            tempsCuisson: document.getElementById("tempsCuisson").value,
            niveau_difficulte: document.getElementById("niveau_difficulte").value,
            etapes: document.getElementById("etapes").value,
        };

        try {
            const response = await fetch(`/api/recettes/${recetteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(recetteModifiee)
            });

            if (response.ok) {
                alert("Recette modifiée avec succès !");
                window.location.href = "/html/index.html"; // Revenir à l'accueil après modification
            } else {
                alert("Erreur lors de la modification de la recette");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            alert("Erreur réseau");
        }
    });
});