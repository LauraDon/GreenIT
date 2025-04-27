/*
  Projet: Green IT - Ubelicious
  Créé par: Maël Castellan, Laura Donato, Rémi Desjardins, Anne-Laure Parguet et Loriana Ratovo
*/

// Sélectionne le bouton hamburger dans le menu (pour les petits écrans)
const hamburger = document.querySelector(".hamburger");

// Sélectionne la barre de navigation
const navbar = document.getElementById("navbar");

// Ajoute un événement : au clic sur le hamburger, basculer l'affichage du menu
hamburger.addEventListener("click", () => {
  navbar.classList.toggle("active"); // Ajoute ou enlève la classe 'active' pour montrer/cacher le menu
});
