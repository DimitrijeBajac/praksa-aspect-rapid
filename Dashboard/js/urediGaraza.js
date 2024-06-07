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


var editorGaraza = new Quill('#opisEditorGaraza', {
    theme: 'snow'
});

//------------------------------------------------------popunjavanje polja ----------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // Dohvatanje ID-a garaže iz URL-a ili nekog drugog izvora
    const garazaId = new URLSearchParams(window.location.search).get('id');

    // Funkcija za dohvatanje podataka o garaži
    function dohvatiPodatkeGaraze(garazaId) {
        axios.get(`http://localhost:8080/garaza/garazaInfo/${garazaId}`)
            .then(response => {
                const garaza = response.data;

                document.getElementById('nazivGaraza').value = garaza.naziv;
                document.getElementById('tipGaraza').value = garaza.tip;
                document.getElementById('kvadraturaGaraza').value = garaza.kvadratura;
                editorGaraza.root.innerHTML = garaza.opis;
                document.getElementById('dostupnostGaraza').value = garaza.dostupnost ? 'true' : 'false';

                const pdfContainer = document.getElementById('pdfContainer');

                 //------------------funkcija za brisanje i prikazivanje pdfa-------------

                function prikaziPDF(kontejner, putanjaPDF, id) {
                    if (!putanjaPDF) {
                        console.warn('Prazna putanjaPDF, PDF fajl neće biti prikazan.');
                        return; // Ako je putanjaPDF null ili prazna, izlazimo iz funkcije
                    }
                
                    const pdfElement = document.createElement('div');
                    pdfElement.classList.add('pdf-element');
                
                    const embedPdf = document.createElement('embed');
                    const originalPath = putanjaPDF;
                    const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPdf"));
                    embedPdf.src ='../' + '../' + trimmedPath;
                    embedPdf.type = 'application/pdf';
                
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = 'X';
                    removeBtn.classList.add('remove-btn');
                    removeBtn.addEventListener('click', () => {
                        // Poziv za brisanje PDF fajla iz baze
                        axios.delete(`http://localhost:8080/garaza/deletePdf`, {
                            params: {
                                pdfUrl: putanjaPDF,
                                id: id
                            }
                        })
                        .then(() => {
                            pdfElement.remove();
                            alert("PDF fajl obrisan");
                        })
                        .catch(error => {
                            console.error('Greška pri brisanju PDF fajla:', error);
                            alert('Greška pri brisanju PDF fajla');
                        });
                    });
                
                    pdfElement.appendChild(embedPdf);
                    pdfElement.appendChild(removeBtn);
                    kontejner.appendChild(pdfElement);
                }

                prikaziPDF(pdfContainer, garaza.pdfPutanja, garaza.id);
            })
            .catch(error => {
                console.error('Greška prilikom dohvatanja podataka o garaži:', error);
            });
    }

    // Pozivanje funkcije za dohvatanje podataka o garaži kada se DOM učita
    dohvatiPodatkeGaraze(garazaId);

    // Slanje forme za editovanje garaže
    document.getElementById('editGarazaForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Zaustavljanje automatskog slanja forme

        // Priprema FormData objekta sa podacima iz forme
        const formData = new FormData();
        formData.append('naziv', document.getElementById('nazivGaraza').value);
        formData.append('tip', document.getElementById('tipGaraza').value);
        formData.append('kvadratura', document.getElementById('kvadraturaGaraza').value);
        formData.append('opis', document.getElementById('opisEditorGaraza').innerText);
        formData.append('dostupnost', document.getElementById('dostupnostGaraza').value === 'true');

        // Slanje AJAX zahteva za ažuriranje podataka o garaži
        axios.put(`http://localhost:8080/garaza/updateGaraza/${garazaId}`, formData)
            .then(response => {
                console.log('Podaci o garaži uspešno ažurirani:', response.data);
                // Dodajte logiku za redirekciju ili prikaz poruke o uspešnom ažuriranju
                alert("Uspesno ste izmenili podatke")
            })
            .catch(error => {
                console.error('Greška prilikom ažuriranja podataka o garaži:', error);
                // Dodajte logiku za prikaz poruke o grešci
            });
    });
});


 //--------------------------------------------------dodavanje pdfa------------------------------------------


 function uploadFile(input) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('pdf', file);

        // Send the file to the server
        axios.post(`http://localhost:8080/garaza/uploadPdf/${id}`, formData)
            .then(response => {
                console.log(`File uploaded successfully`);
                alert(`File uploaded successfully`);
            })
            .catch(error => {
                console.error(`Error uploading file`, error);
            });
    }
}
