/*
  Projet: Green IT - Ubelicious
  Créé par: Maël Castellan, Laura Donato, Rémi Desjardins, Anne-Laure Parguet et Loriana Ratovo
*/

// Récupère l'utilisateur connecté depuis le localStorage (ou objet vide par défaut)
const utilisateur = JSON.parse(localStorage.getItem("user")) || {};

// Dès que le DOM est chargé
document.addEventListener("DOMContentLoaded", async () => {
  // Sélection des éléments HTML
  const carousel = document.getElementById("carousel");
  const fiche = document.getElementById("fiche-recette");
  const titre = document.getElementById("titre-recette");
  const ingredientsList = document.getElementById("liste-ingredients");
  const miniatures = document.getElementById("miniatures");
  const boutonSupprimer = document.getElementById("btn-supprimer-recette");
  const boutonModifier = document.getElementById("btn-modifier-recette");

  let recettes = []; // Stocke les recettes
  let currentIndex = 0; // Index de la recette affichée

  try {
    // Récupération des recettes via l'API
    const response = await fetch("/api/recettes");
    recettes = await response.json();

    // Si aucune recette, afficher un message
    if (recettes.length === 0) {
      document.querySelector(".carrousel-container").style.display = "none";
      fiche.style.display = "none";
      miniatures.style.display = "none";

      const empty = document.createElement("div");
      empty.classList.add("empty-message");
      empty.innerHTML = `<p class="no-recette">Aucune recette disponible pour le moment.</p>`;
      document.querySelector("main.hero").appendChild(empty);
      return;
    }

    // Génération des images principales du carrousel
    recettes.forEach((recette, index) => {
      const item = document.createElement("img");
      item.src = recette.urlImage;
      item.alt = recette.titre;
      item.classList.add("carousel-item");
      if (index === 0) item.classList.add("active");
      carousel.appendChild(item);
    });

    // Génération des miniatures cliquables
    recettes.forEach((recette, index) => {
      const thumb = document.createElement("img");
      thumb.src = recette.urlImage;
      thumb.alt = recette.titre;
      thumb.classList.add("miniature");
      thumb.dataset.index = index;
      thumb.addEventListener("click", () => showRecette(index));
      miniatures.appendChild(thumb);
    });

    // Affiche la première recette
    showRecette(0);

    // Navigation carrousel gauche
    document.querySelector(".carousel-btn.left").onclick = () => {
      currentIndex = (currentIndex - 1 + recettes.length) % recettes.length;
      showRecette(currentIndex);
    };

    // Navigation carrousel droite
    document.querySelector(".carousel-btn.right").onclick = () => {
      currentIndex = (currentIndex + 1) % recettes.length;
      showRecette(currentIndex);
    };
  } catch (error) {
    // Gestion d'erreur en cas d'échec de récupération
    console.error("Erreur lors de la récupération des recettes :", error);
    carousel.innerHTML = "<p>Erreur de chargement.</p>";
  }

  // Fonction pour afficher une recette à l'index donné
  function showRecette(index) {
    currentIndex = index;
    const recette = recettes[index];

    // Gère le carrousel principal
    document.querySelectorAll(".carousel-item").forEach((div, i) => {
      div.classList.toggle("active", i === index);
    });

    // Gère les miniatures
    document.querySelectorAll(".miniature").forEach((thumb) => {
      thumb.classList.remove("active");
    });
    const selectedMiniature = document.querySelector(
      `.miniature[data-index="${index}"]`
    );
    if (selectedMiniature) selectedMiniature.classList.add("active");

    // Met à jour le contenu de la fiche recette
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

    // Liste les ingrédients
    recette.ingredients.split(/\r?\n/).forEach((ingredient) => {
      if (ingredient.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = ingredient.trim();
        ingredientsList.appendChild(li);
      }
    });

    // Ajoute les étapes de préparation
    const pEtapes = document.createElement("p");
    pEtapes.innerHTML = `<strong>Étapes de préparation</strong><br>${recette.etapes.replace(
      /\n/g,
      "<br>"
    )}`;
    fiche.appendChild(pEtapes);

    // Affiche boutons supprimer/modifier si admin
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

  // Création d'un conteneur pour les boutons admin
  const btnContainer = document.createElement("div");
  btnContainer.id = "btn-modif-supp";
  btnContainer.style.display = "flex";
  btnContainer.style.justifyContent = "center";
  btnContainer.style.alignItems = "center";
  btnContainer.style.marginTop = "20px";
  btnContainer.style.gap = "50px";
  btnContainer.appendChild(boutonSupprimer);
  btnContainer.appendChild(boutonModifier);
  fiche.appendChild(btnContainer);
});

// Gestion du bouton "Ajouter une recette" pour admin uniquement
const overlayAjout = document.getElementById("overlay-ajout");
const boutonAjout = document.querySelector("#btn-ajout-recette");
if (utilisateur && utilisateur.estAdmin === 1) {
  boutonAjout.addEventListener("click", (e) => {
    e.preventDefault();
    overlayAjout.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
} else {
  boutonAjout.style.display = "none";
}

// Gestion de la fermeture de l'overlay ajout recette
const closeOverlayBtn = document.getElementById("close-overlay");
closeOverlayBtn.addEventListener("click", () => {
  overlayAjout.classList.add("hidden");
  document.body.style.overflow = "";
});

// Envoi du formulaire d'ajout de recette
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
        body: JSON.stringify({ recette: data, userId: 1 }),
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

// Suppression d'une recette via bouton
const bouton = document.getElementById("btn-supprimer-recette");
if (bouton) {
  bouton.addEventListener("click", async () => {
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

// Modification d'une recette
const boutonModifier = document.getElementById("btn-modifier-recette");
if (boutonModifier) {
  boutonModifier.addEventListener("click", async () => {
    const id = boutonModifier.dataset.id;
    const overlayModif = document.getElementById("overlay-modif");
    overlayModif.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    try {
      const response = await fetch(`/api/recettes/${id}`);
      const recette = await response.json();

      document.getElementById("modif-titre").value = recette.titre;
      document.getElementById("modif-description").value = recette.description;
      document.getElementById("modif-urlImage").value = recette.urlImage || "";
      document.getElementById("modif-tempsPreparation").value =
        recette.tempsPreparation || "";
      document.getElementById("modif-tempsCuisson").value =
        recette.tempsCuisson || "";
      document.getElementById("modif-niveau_difficulte").value =
        recette.niveau_difficulte || "";
      document.getElementById("modif-ingredients").value = recette.ingredients;
      document.getElementById("modif-etapes").value = recette.etapes;
    } catch (error) {
      console.error("Erreur lors du chargement de la recette :", error);
      alert("Erreur lors du chargement de la recette");
    }
  });
}

// Fermeture de l'overlay modification
const closeOverlayModifBtn = document.getElementById("close-overlay-modif");
closeOverlayModifBtn.addEventListener("click", () => {
  const overlayModif = document.getElementById("overlay-modif");
  overlayModif.classList.add("hidden");
  document.body.style.overflow = "";
});

// Envoi du formulaire de modification
const formModifRecette = document.getElementById("form-modifier-recette");
if (formModifRecette) {
  formModifRecette.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = boutonModifier.dataset.id;

    const recetteModifiee = {
      titre: document.getElementById("modif-titre").value,
      description: document.getElementById("modif-description").value,
      urlImage: document.getElementById("modif-urlImage").value,
      tempsPreparation: document.getElementById("modif-tempsPreparation").value,
      tempsCuisson: document.getElementById("modif-tempsCuisson").value,
      niveau_difficulte: document.getElementById("modif-niveau_difficulte")
        .value,
      ingredients: document.getElementById("modif-ingredients").value,
      etapes: document.getElementById("modif-etapes").value,
    };

    try {
      const response = await fetch(`/api/recettes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recetteModifiee),
      });

      if (response.ok) {
        document.getElementById("message-modif").textContent =
          "Recette modifiée avec succès ! 🎉";
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        document.getElementById("message-modif").textContent =
          "Erreur lors de la modification.";
      }
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      document.getElementById("message-modif").textContent = "Erreur réseau.";
    }
  });
}

// Gestion de l'affichage du menu hamburger mobile
const hamburger = document.querySelector(".hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("active");
});
