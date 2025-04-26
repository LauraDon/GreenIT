const utilisateur = JSON.parse(localStorage.getItem("user")) || {};

document.addEventListener("DOMContentLoaded", async () => {
  const carousel = document.getElementById("carousel");
  const fiche = document.getElementById("fiche-recette");
  const titre = document.getElementById("titre-recette");
  const ingredientsList = document.getElementById("liste-ingredients");
  const miniatures = document.getElementById("miniatures");
  const boutonSupprimer = document.getElementById("btn-supprimer-recette");
  const boutonModifier = document.getElementById("btn-modifier-recette");
  const overlayAjout = document.getElementById("overlay-ajout");

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
            thumb.dataset.index = index;
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

        // Gérer le carrousel principal
        document.querySelectorAll(".carousel-item").forEach((div, i) => {
            if (i === index) {
                div.classList.add("active");
            } else {
                div.classList.remove("active");
            }
        });


        // Gérer les miniatures
        document.querySelectorAll(".miniature").forEach((thumb) => {
            thumb.classList.remove("active");
        });
        const selectedMiniature = document.querySelector(
            `.miniature[data-index="${index}"]`
        );
        if (selectedMiniature) selectedMiniature.classList.add("active");

        // Mettre à jour le contenu de la fiche
        titre.innerHTML = recette.titre;
        ingredientsList.innerHTML = "";

        const bloc = document.createElement("div");
        bloc.classList.add("fiche-details");

        bloc.innerHTML = `
          <p><strong>Description :</strong> ${recette.description}</p>
          <p><strong>Préparation :</strong> ${
            recette.tempsPreparation || "?"
          }</p>
          <p><strong>Cuisson :</strong> ${recette.tempsCuisson || "?"}</p>
          <p><strong>Difficulté :</strong> ${
            recette.niveau_difficulte || "?"
          }</p>
          <p><strong>Ingrédients :</strong></p>
      `;

        fiche.innerHTML = "";
        fiche.appendChild(titre);
        fiche.appendChild(bloc);
        fiche.appendChild(ingredientsList);

        recette.ingredients.split(/\r?\n/).forEach((ingredient) => {
            if (ingredient.trim() !== "") {
                const li = document.createElement("li");
                li.textContent = ingredient.trim();
                ingredientsList.appendChild(li);
            }
        });

        // Étapes à la ligne
        const pEtapes = document.createElement("p");
        pEtapes.innerHTML = `<strong>Étapes de préparation</strong><br>${recette.etapes.replace(
      /\n/g,
      "<br>"
    )}`;
        fiche.appendChild(pEtapes);

        // Bouton supprimer pour admin
        if (utilisateur && utilisateur.estAdmin === 1) {
            boutonSupprimer.style.display = "inline-block";
            boutonSupprimer.dataset.id = recette.id_recette;

            boutonModifier.style.display = "inline-block";
            boutonModifier.dataset.id = recette.id_recette;

            fiche.appendChild(boutonSupprimer);
            fiche.appendChild(boutonModifier);
        } else {
            boutonSupprimer.style.display = "none";
            boutonModifier.style.display = "none";
        }
    }
  }

  // Bouton "Ajouter une recette" visible seulement pour l'admin
  const boutonAjout = document.querySelector("#btn-ajout-recette");
  if (utilisateur && utilisateur.estAdmin === 1) {
    boutonAjout.addEventListener("click", (e) => {
      e.preventDefault(); // Empêche la redirection
      overlayAjout.classList.remove("hidden"); // Affiche l'overlay
      document.body.style.overflow = "hidden";
    });
  } else {
    boutonAjout.style.display = "none"; // Cache le bouton pour les non-admins
  }

  const closeOverlayBtn = document.getElementById("close-overlay");
  closeOverlayBtn.addEventListener("click", () => {
    overlayAjout.classList.add("hidden");
    document.body.style.overflow = "";
  });

  const formRecette = document.getElementById("form-recette");
  if (formRecette) {
    formRecette.addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;
      const data = {
        titre: form.titre.value,
        description: form.description.value,
        urlImage: form.urlImage.value,
        tempsPreparation: form.tempsPreparation.value,
        tempsCuisson: form.tempsCuisson.value,
        niveau_difficulte: form.niveau_difficulte.value,
        ingredients: form.ingredients.value,
        etapes: form.etapes.value,
      };

      try {
        const res = await fetch("/api/recettes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recette: data, userId: 1 }), // userId 1 = admin par défaut
        });

        const result = await res.json();

        if (res.ok) {
          form.reset();
          document.getElementById("message").textContent =
            "Recette ajoutée avec succès ! 🎉";
        } else {
          document.getElementById("message").textContent =
            "Erreur : " + result.error;
        }
      } catch (err) {
        console.error(err);
        document.getElementById("message").textContent = "Erreur serveur.";
      }
    });
  }
});

const bouton = document.getElementById("btn-supprimer-recette");
if (bouton) {
    bouton.addEventListener("click", async() => {
        const id = bouton.dataset.id;
        const confirmation = confirm("Supprimer cette recette ?");
        if (confirmation) {
            const response = await fetch(`/api/recettes/${id}`, { method: "DELETE" });
            if (response.ok) {
                alert("Recette supprimée !");
                location.reload();
            } else {
                alert("Erreur lors de la suppression");
            }
        }
    });
}

const boutonModifier = document.getElementById("btn-modifier-recette");
if (boutonModifier) {
    boutonModifier.addEventListener("click", () => {
        const id = boutonModifier.dataset.id;
        window.location.href = `/html/modifier_recette.html?id=${id}`;
    });
}


const hamburger = document.querySelector(".hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
});