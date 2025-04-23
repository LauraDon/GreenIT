const lieux = [
  {
    nom: "La Maison du Mochi",
    type: "Pâtisserie japonaise",
    adresse: "39 Rue du Cherche-Midi, 75006 Paris",
    commentaire:
      "Mochis artisanaux, à l’ube (selon saison). Cadre raffiné et minimaliste.",
  },
  {
    nom: "Glace Bachir",
    type: "Glacier libanais",
    adresse: "58 Rue Rambuteau, 75003 Paris",
    commentaire:
      "Propose des glaces artisanales à l’ube (à vérifier selon les périodes). Texture super fondante.",
  },
  {
    nom: "Boba Café Paris",
    type: "Bubble tea",
    adresse: "47 Rue du Faubourg-Saint-Denis, 75010 Paris",
    commentaire:
      "Bubble tea à l’ube, avec toppings personnalisables. Ambiance jeune et chill.",
  },
  {
    nom: "Hanoï Corner",
    type: "Restaurant vietnamien fusion",
    adresse: "17 Rue Dussoubs, 75002 Paris",
    commentaire:
      "Desserts à l’ube (chè violet, gâteaux vapeur), cuisine généreuse et originale.",
  },
  {
    nom: "Hanoï Corner",
    type: "Restaurant vietnamien fusion",
    adresse: "17 Rue Dussoubs, 75002 Paris",
    commentaire:
      "Desserts à l’ube (chè violet, gâteaux vapeur), cuisine généreuse et originale.",
  },
  {
    nom: "Hanoï Corner",
    type: "Restaurant vietnamien fusion",
    adresse: "17 Rue Dussoubs, 75002 Paris",
    commentaire:
      "Desserts à l’ube (chè violet, gâteaux vapeur), cuisine généreuse et originale.",
  },
  {
    nom: "Hanoï Corner",
    type: "Restaurant vietnamien fusion",
    adresse: "17 Rue Dussoubs, 75002 Paris",
    commentaire:
      "Desserts à l’ube (chè violet, gâteaux vapeur), cuisine généreuse et originale.",
  },
  {
    nom: "Hanoï Corner",
    type: "Restaurant vietnamien fusion",
    adresse: "17 Rue Dussoubs, 75002 Paris",
    commentaire:
      "Desserts à l’ube (chè violet, gâteaux vapeur), cuisine généreuse et originale. Bla bla bla bla bla bla bla bla bla bla bla bla bla",
  },
];

const container = document.getElementById("lieux-container");

lieux.forEach((lieu) => {
  const card = document.createElement("div");
  card.className = "lieu-card";
  card.innerHTML = `
      <h3>${lieu.nom}</h3>
      <p><strong>${lieu.type}</strong></p>
      <p>${lieu.adresse}</p>
      <p>${lieu.commentaire}</p>
    `;
  container.appendChild(card);
});
