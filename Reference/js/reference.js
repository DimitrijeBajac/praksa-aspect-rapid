window.onload = function() {
    dohvatiPodatkeObjekata();
};

  function dohvatiPodatkeObjekata() {
    axios.get('http://localhost:8080/dashboard/getObjekti')
        .then(response => {
            const data = response.data;
            console.log(data);
            prikaziObjekte(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o objektima:', error);
        });
}

function prikaziObjekte(podaci) {
    const cardsContainer = document.querySelector('.cards');

    podaci.forEach(objekat => {
        const originalPath = objekat.putanjaCoverSlika;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos"));
        const encodedPath = encodeURIComponent(trimmedPath);

        console.log(trimmedPath);
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('grid_container');

         // Postavljanje pozadine na div element
        cardDiv.style.background = `linear-gradient(30.94deg, #000000 20.46%, rgba(0, 0, 0, 0) 67.87%), url('../${encodedPath}') center/cover no-repeat`;


        cardDiv.innerHTML = `
            <div class="card_content">
                <h1>${objekat.naziv}</h1>
                <p>${objekat.adresa}</p>
                <div class="aktuelni_projekti_card_button">
                    <a href="../Harmony/harmony.html?id=${objekat.id}">Vidite više</a>
                </div>
            </div>
        `;

        cardsContainer.appendChild(cardDiv);
    });
}









