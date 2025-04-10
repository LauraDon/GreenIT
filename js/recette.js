fetch('/api/recettes')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('recettes-container');

        data.forEach(recette => {
            const card = document.createElement('div');
            card.className = 'recette-card';

            card.innerHTML = `
        <img src="${recette.urlImage}" alt="${recette.titre}">
        <h2>${recette.titre}</h2>
        <p>${recette.description}</p>
        <p><strong>Auteur :</strong> ${recette.auteur}</p>
      `;

            container.appendChild(card);
        });
    })
    .catch(err => {
        console.error('Erreur lors du chargement des recettes :', err);
    });