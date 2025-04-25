document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-recommandation");
    const message = document.getElementById("message");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        message.innerText = "Tu dois être connecté pour publier une recommandation.";
        form.style.display = "none";
        return;
    }

    form.addEventListener("submit", async(e) => {
        e.preventDefault();

        const titre = form.elements["titre"].value.trim();
        const lieu = form.elements["description"].value.trim();
        const contenu = form.elements["commendataire"].value.trim();

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
                    id_utilisateur: user.id_utilisateur
                })
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