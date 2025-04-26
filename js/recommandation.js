document.addEventListener("DOMContentLoaded", async () => {
  const listeLieux = document.getElementById("liste-lieux");
  const overlayAjout = document.getElementById("overlay-ajout");

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

  document.querySelector(".add-button").addEventListener("click", () => {
    const isConnected = localStorage.getItem("connected") === "true";

    if (!isConnected) {
      alert("Tu dois être connecté pour ajouter une recommandation !");
      window.location.href = "/html/connexion.html";
    } else {
      overlayAjout.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  });

  document.getElementById("close-overlay").addEventListener("click", () => {
    overlayAjout.classList.add("hidden");
    document.body.style.overflow = "";
  });

  const form = document.getElementById("form-recommandation");
  const message = document.getElementById("message");

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    message.innerText =
      "Tu dois être connecté pour publier une recommandation.";
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titre = form.elements["titre"].value.trim();
    const lieu = form.elements["description"].value.trim();
    const contenu = form.elements["commentaire"].value.trim();

    if (!titre || !lieu || !contenu) {
      message.innerText = "Tous les champs sont obligatoires.";
      return;
    }

    try {
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
        window.location.href = "/html/recommandation.html";
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

const hamburger = document.querySelector(".hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("active");
});
