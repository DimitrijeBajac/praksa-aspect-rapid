 // Inicijalizacija prvog Quill editora
 var editor1 = new Quill('#editor1', {
    theme: 'snow'
});

// Inicijalizacija drugog Quill editora
var editor2 = new Quill('#editor2', {
    theme: 'snow'
});




// Funkcija za proveru autentifikacije korisnika
function isAuthenticated() {
    // Provera da li postoji token ili drugi podatak koji ukazuje na autentifikaciju
    return localStorage.getItem('accessToken') !== null;
}

// Funkcija za preusmeravanje na stranicu za prijavu ako korisnik nije autentifikovan
function redirectToLogin() {
    window.location.href = '../Login/login.html'; // Promeniti putanju ako je drugačija
}

// Funkcija koja se izvršava kada se stranica učita
document.addEventListener("DOMContentLoaded", function() {
    // Provera autentifikacije korisnika
    if (!isAuthenticated()) {
        // Korisnik nije autentifikovan, preusmeravanje na stranicu za prijavu
        redirectToLogin();
    } else {
        // Korisnik je autentifikovan, omogućavanje pristupa dashboard-u

        // Ovde možete dodati kod koji se izvršava kada je korisnik autentifikovan
        // Na primer, prikazivanje sadržaja dashboard-a ili izvršavanje drugih akcija na ovoj stranici
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Dohvatanje ID-a stana iz URL-a
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Dohvatanje podataka o objektu sa servera koristeći Axios
    axios.get(`http://localhost:8080/dashboard/objekatInfo/${id}`)
        .then(response => {
            const objekat = response.data;
            // Popunjavanje polja forme sa podacima o stanu
            document.getElementById('naziv').value = objekat.naziv;
            document.getElementById('mesto').value = objekat.mesto;
            document.getElementById('adresa').value = objekat.adresa;
            editor1.root.innerHTML = objekat.tekst1;
            editor2.root.innerHTML = objekat.tekst2;
            document.getElementById('aktuelan').value = objekat.aktuelan ? 'true' : 'false';

            const databaseContainer1 = document.getElementById('databaseContainer1');

            function dodajSlikuSaIksom(kontejner, putanjaSlike, id) {

                if (!putanjaSlike) {
                    console.warn('Prazan putanjaSlike, slika neće biti dodana.');
                    return; // Ako je putanjaSlike null ili prazna, izlazimo iz funkcije
                }
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-container');

                const originalPath = putanjaSlike;
                const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos"));

                const img = document.createElement('img');
                img.src = '../../' + trimmedPath;

                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = 'X';
                removeBtn.classList.add('remove-btn');
                removeBtn.addEventListener('click', () => {
                    // Poziv za brisanje slike iz baze
                    axios.delete(`http://localhost:8080/dashboard/deleteImageObjekat`, {
                        params: {
                            imageUrl: putanjaSlike,
                            id: id
                        }
                    })
                    .then(() => {
                        imgContainer.remove();
                        alert("Slika obrisana");
                    })
                    .catch(error => {
                        console.error('Greška pri brisanju slike:', error);
                        alert('Greška pri brisanju slike');
                    });
                });

                imgContainer.appendChild(img);
                imgContainer.appendChild(removeBtn);
                kontejner.appendChild(imgContainer);
            }

            dodajSlikuSaIksom(databaseContainer1, objekat.putanjaCoverSlika, objekat.id);
        })
        .catch(error => console.error('Greška pri dohvatanju podataka o objektu:', error));
});

/*---------------------update slike---------------------------------------------*/

function uploadImage(input) {
    const imageId = input.getAttribute('data-image-id');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('imageId', imageId); // Add image ID to the form data
        formData.append('objekatId', id);

        // Send the image to the server
        axios.post('http://localhost:8080/dashboard/updateImage', formData)
            .then(response => {
                console.log(`Image ${imageId} uploaded successfully`);
            })
            .catch(error => {
                console.error(`Error uploading image ${imageId}`, error);
            });
    }
}


/*-----------------------edit Objekat---------------------------------*/

document.getElementById("objekatForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Gather form data
    const formData = new FormData();
    formData.append("naziv", document.getElementById("naziv").value);
    formData.append("mesto", document.getElementById("mesto").value);
    formData.append("adresa", document.getElementById("adresa").value);
    formData.append("tekst1", document.getElementById("editor1").innerText);
    formData.append("tekst2", document.getElementById("editor2").innerText);  
    formData.append("aktuelan", document.getElementById("aktuelan").value);

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Send form data to backend using PUT method
    axios.put(`http://localhost:8080/dashboard/updateObjekat/${id}`, formData)
        .then(response => {
            // Handle success
            console.log("Objekat successfully updated:", response.data);
            // Redirect to some page or display a success message
            alert("Objekat successfully updated");
        })
        .catch(error => {
            // Handle error
            console.error("Error updating objekat:", error);
            // Display an error message to the user
        });
});

