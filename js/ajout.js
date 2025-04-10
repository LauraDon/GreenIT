document.getElementById('form-recette').addEventListener('submit', async(e) => {
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
        etapes: form.etapes.value
    };

    try {
        const res = await fetch('/api/recettes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recette: data, userId: 1 }) // userId 1 = admin par défaut
        });

        const result = await res.json();

        if (res.ok) {
            form.reset();
            document.getElementById('message').textContent = 'Recette ajoutée avec succès ! 🎉';
        } else {
            document.getElementById('message').textContent = 'Erreur : ' + result.error;
        }
    } catch (err) {
        console.error(err);
        document.getElementById('message').textContent = 'Erreur serveur.';
    }
});