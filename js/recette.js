document.addEventListener("DOMContentLoaded", async() => {
    const carousel = document.getElementById("carousel");
    const fiche = document.getElementById("fiche-recette");
    const titre = document.getElementById("titre-recette");
    const ingredientsList = document.getElementById("liste-ingredients");
    const miniatures = document.getElementById("miniatures");

    let recettes = [];
    let currentIndex = 0;

    try {
        const response = await fetch("/api/recettes");
        recettes = await response.json();

        if (recettes.length === 0) {
            document.querySelector(".carrousel-container").style.display = "none";
            fiche.style.display = "none";
            miniatures.style.display = "none";

            const empty = document.createElement("div");
            empty.classList.add("empty-message");
            empty.innerHTML = `
          <p class="no-recette">
            Aucune recette disponible pour le moment.
          </p>
        `;
            document.querySelector("main.hero").appendChild(empty);
            return;
        }

        recettes.forEach((recette, index) => {
            const item = document.createElement("img");
            item.src = recette.urlImage;
            item.alt = recette.titre;
            item.classList.add("carousel-item");
            if (index === 0) item.classList.add("active");
            carousel.appendChild(item);
        });

        recettes.forEach((recette, index) => {
            const thumb = document.createElement("img");
            thumb.src = recette.urlImage;
            thumb.alt = recette.titre;
            thumb.classList.add("miniature");
            thumb.addEventListener("click", () => showRecette(index));
            miniatures.appendChild(thumb);
        });

        showRecette(0);

        document.querySelector(".carousel-btn.left").onclick = () => {
            currentIndex = (currentIndex - 1 + recettes.length) % recettes.length;
            showRecette(currentIndex);
        };

        document.querySelector(".carousel-btn.right").onclick = () => {
            currentIndex = (currentIndex + 1) % recettes.length;
            showRecette(currentIndex);
        };

    } catch (error) {
        console.error("Erreur lors de la récupération des recettes :", error);
        carousel.innerHTML = "<p>Erreur de chargement.</p>";
    }

    function showRecette(index) {
        currentIndex = index;
        const recette = recettes[index];

        // Mise à jour image active
        document.querySelectorAll(".carousel-item").forEach((img, i) => {
            img.classList.toggle("active", i === index);
        });

        // Mise à jour fiche recette
        titre.innerHTML = recette.titre;

        ingredientsList.innerHTML = "";

        const bloc = document.createElement("div");
        bloc.classList.add("fiche-details");

        bloc.innerHTML = `
        <p><strong>Description :</strong> ${recette.description}</p>
        <p><strong>Préparation :</strong> ${recette.tempsPreparation || "?"}</p>
        <p><strong>Cuisson :</strong> ${recette.tempsCuisson || "?"}</p>
        <p><strong>Difficulté :</strong> ${recette.niveau_difficulte || "?"}</p>
        <p><strong>Ingrédients :</strong></p>
      `;

        fiche.innerHTML = "";
        fiche.appendChild(titre);
        fiche.appendChild(bloc);
        fiche.appendChild(ingredientsList);

        // Bonne découpe des ingrédients
        recette.ingredients.split(/\r?\n/).forEach(ingredient => {
            if (ingredient.trim() !== "") {
                const li = document.createElement("li");
                li.textContent = ingredient.trim();
                ingredientsList.appendChild(li);
            }
        });
    }
});