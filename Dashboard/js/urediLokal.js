
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


var editorLokal = new Quill('#opisEditorLokal', {
    theme: 'snow'
});

window.onload = function() {
    //dohvatiPodatkeObjekata();
    dohvatiPodatkeProstorija();
};

// Dohvaćanje podataka o svim objektima s servera
function dohvatiPodatkeObjekata() {
    axios.get('http://localhost:8080/dashboard/getObjekti')
        .then(response => {
            // Ako je odgovor uspješan, dohvatite podatke
            const data = response.data;
            console.log(data)
            // Prikazivanje podataka o stanovima
            popuniSelectObjekti(data);
        })
        .catch(error => {
            // Ako je došlo do greške, prikažite poruku o grešci
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
        });
}

function popuniSelectObjekti(objekti) {
    const selectObjekat = document.getElementById('objekatLokal');

    // Prvo, brišemo sve postojeće opcije u select polju
    selectObjekat.innerHTML = '';

    // Zatim iteriramo kroz podatke o objektima i dodajemo opcije u select polje
    objekti.forEach(objekat => {
        const option = document.createElement('option');
        option.value = objekat.id; // Vrednost opcije je ID objekta
        option.textContent = objekat.naziv; // Tekst opcije je naziv objekta
        selectObjekat.appendChild(option);
    });
}




document.addEventListener('DOMContentLoaded', function() {
    const lokalId = new URLSearchParams(window.location.search).get('id');

    function popuniFormuPodacima(lokal) {
        document.getElementById('nazivLokal').value = lokal.naziv;
        document.getElementById('prodaja').value = lokal.prodaja;
        document.getElementById('izdavanje').value = lokal.izdavanje;
        document.getElementById('kvadraturaLokal').value = lokal.kvadratura;
        editorLokal.root.innerHTML = lokal.opis;
        
        const databaseContainer1 = document.getElementById('databaseNaslovnaSlikaLokal');
        const databaseContainer2 = document.getElementById('databaseSlika1Lokal');
        const databaseContainer3 = document.getElementById('databaseSlika2Lokal');
        const databaseContainer4 = document.getElementById('databaseSlika3Lokal');
        const pdfContainer = document.getElementById('pdfContainer');


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
                axios.delete(`http://localhost:8080/lokal/deleteImage`, {
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
                axios.delete(`http://localhost:8080/lokal/deletePdf`, {
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

        dodajSlikuSaIksom(databaseContainer1, lokal.naslovnaSlka, lokal.id);
        dodajSlikuSaIksom(databaseContainer2, lokal.slikaPutanja1, lokal.id);
        dodajSlikuSaIksom(databaseContainer3, lokal.slikaPutanja2, lokal.id);
        dodajSlikuSaIksom(databaseContainer4, lokal.slikaPutanja3, lokal.id);
        prikaziPDF(pdfContainer, lokal.pdfPutanja, lokal.id);
    }

    function dohvatiPodatkeLokala() {
        axios.get(`http://localhost:8080/lokal/lokalInfo/${lokalId}`)
            .then(response => {
                const lokal = response.data;
                popuniFormuPodacima(lokal);
            })
            .catch(error => {
                console.error('Došlo je do greške prilikom dohvaćanja podataka o lokalu:', error);
            });
    }

    /*-----------------------update lokal-----------------------*/

    document.getElementById('urediLokalForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('naziv', document.getElementById('nazivLokal').value);
        formData.append('prodaja', document.getElementById('prodaja').value === 'true');
        formData.append('izdavanje', document.getElementById('izdavanje').value === 'true');
        formData.append('kvadratura', document.getElementById('kvadraturaLokal').value);
        formData.append("opisLokal", document.getElementById("opisEditorLokal").innerText);
        
        axios.put(`http://localhost:8080/lokal/updateLokal/${lokalId}`, formData)
            .then(response => {
                console.log('Lokal uspešno ažuriran:', response.data);
                alert("Uspesno ste azurirali podatke")
            })
            .catch(error => {
                console.error('Došlo je do greške prilikom ažuriranja lokala:', error);
            });
    });

    dohvatiPodatkeLokala();
    
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
        formData.append('lokalId', id);

        // Send the image to the server
        axios.post('http://localhost:8080/lokal/updateImage', formData)
            .then(response => {
                console.log(`Image ${imageId} uploaded successfully`);
            })
            .catch(error => {
                console.error(`Error uploading image ${imageId}`, error);
            });
    }
}


/*--------------------------------prostotije-------------------------------------------------------------------------------------*/


// Dohvaćanje podataka o svim objektima s servera
function dohvatiPodatkeProstorija() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); 
    axios.get(`http://localhost:8080/dashboard/getProstorijeLokal/${id}`)
        .then(response => {
            const data = response.data;
            console.log(data);
            prikaziProstorije(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o prostorijama:', error);
        });
}

// Funkcija za prikazivanje prostorija
function prikaziProstorije(prostorije) {
    const tabela = document.getElementById('prostorijeTable');
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = ''; // Resetovanje tabele
  
    prostorije.forEach(prostorija => {
      const red = document.createElement('tr');
      red.innerHTML = `
        <td>${prostorija.naziv}</td>
        <td>${prostorija.kvadraturaProstorije}</td>
        <td>
          <button class="editBtn" data-id="${prostorija.id}">Edit</button>
          <button class="deleteBtn" data-id="${prostorija.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(red);
    });
  }
  
  // Funkcija za dodavanje novog reda za unos prostorije
  function dodajRedZaUnos() {
    const tabela = document.getElementById('prostorijeTable').querySelector('tbody');
    const noviRed = document.createElement('tr');
    noviRed.innerHTML = `
      <td><input type="text" id="naziv" required></td>
      <td><input type="number" id="kvadraturaProstorije22" name="kvadraturaProstorije22" step="0.01" required></td>
      <td>
        <button id="sacuvajBtn">Sacuvaj</button>
        <button id="odustaniBtn">Odustani</button>
      </td>
    `;
    tabela.appendChild(noviRed);
  }
  
  // Event listener za dugme "Dodaj prostoriju"
  document.getElementById('dodajProstorijuBtn').addEventListener('click', dodajRedZaUnos);
  
  // Event listener za dugmad "Sacuvaj" i "Odustani" u novom redu za unos
  document.getElementById('prostorijeTable').addEventListener('click', event => {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); 

    if (event.target.id === 'sacuvajBtn') {

        const formData = new FormData();
        formData.append("naziv", document.getElementById("naziv").value);
        formData.append("kvadraturaProstorije", document.getElementById("kvadraturaProstorije22").value);
        console.log(formData);
        axios.post(`http://localhost:8080/dashboard/addProstorijaLokal/${id}`, formData)
             .then(response => {
                 console.log(response.data);
                 alert("Prostorija je uspešno dodata!");
                 window.location.reload();
             })
             .catch(error => {
                 console.error('Došlo je do greške prilikom dohvaćanja podataka o prostorijama:', error);
                alert("Došlo je do greške prilikom dodavanja objekta. Molimo vas, pokušajte ponovo.");
             });
    } else if (event.target.id === 'odustaniBtn') {

        const redZaBrisanje = event.target.closest('tr');
        redZaBrisanje.remove();
    }
  });
  
  // Event listener za dugmad "Edit" i "Delete" u tabeli
  document.getElementById('prostorijeTable').addEventListener('click', event => {
    if (event.target.classList.contains('editBtn')) {
      const prostorijaId = event.target.dataset.id;
      console.log(prostorijaId);
      // Implementirajte logiku za editovanje prostorije sa ID-jem prostorijaId

      const tr = event.target.closest('tr');
      enableEditing(tr);

      function enableEditing(tr) {
        tr.querySelectorAll('td:not(:last-child)').forEach(td => {
            const input = document.createElement('input');
            input.value = td.textContent;
            td.textContent = '';
            td.appendChild(input);
        });
    
        // Dodajemo slušač događaja na svako polje unosa da bismo hvatali pritisak na taster "Enter"
        tr.addEventListener('keydown', handleEnterKey);
        }
        function handleEnterKey(event) {
            if (event.key === 'Enter') {
                const tr = event.target.closest('tr');
                const naziv = tr.querySelector('td:nth-child(1) input').value;
                const kvadratura = tr.querySelector('td:nth-child(2) input').value;

                console.log(prostorijaId, naziv, kvadratura);
                
                // Pozivamo funkciju za ažuriranje prostorije na serveru
                updateProstorija(prostorijaId, naziv, kvadratura);

                
                // Onemogućavamo uređivanje nakon što se ažuriranje izvrši
                disableEditing(tr);
            }
        }
        
        // Onemogućava uređivanje polja unosa u redu tabele
        function disableEditing(tr) {
            tr.querySelectorAll('td:not(:last-child)').forEach(td => {
                const inputValue = td.querySelector('input').value;
                td.textContent = inputValue;
            });
            
            // Uklanjamo slušača događaja sa polja unosa
            tr.removeEventListener('keydown', handleEnterKey);
        }
        
        // Funkcija za ažuriranje prostorije na serveru
        function updateProstorija(id, naziv, kvadratura) {
            const formData = new FormData();
            formData.append("naziv", naziv);
            formData.append("kvadraturaProstorije", kvadratura);
            axios.put(`http://localhost:8080/dashboard/updateProstorija/${id}`, formData)
            .then(response => {
                // Handle success
                console.log("Stan successfully updated:", response.data);
                // Redirect to some page or display a success message
                alert("Uspesno ste dodali prostoriju");
            })
            .catch(error => {
                // Handle error
                console.error("Error updating stan:", error);
                // Display an error message to the user
            });
        }
    }else if (event.target.classList.contains('deleteBtn')) {
      const prostorijaId = event.target.dataset.id;
      // Implementirajte logiku za brisanje prostorije sa ID-jem prostorijaId
      axios.delete(`http://localhost:8080/dashboard/deleteProstorija/${prostorijaId}`)
            .then(response => {
                console.log("Prostorija successfully deleted:", response.data);
                alert("Uspesno ste obirsali prostoriju");
                window.location.reload();
            })
            .catch(error => {
                console.error("Error deleting prostorija:", error);
            });
    }
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
        axios.post(`http://localhost:8080/lokal/uploadPdf/${id}`, formData)
            .then(response => {
                console.log(`File uploaded successfully`);
            })
            .catch(error => {
                console.error(`Error uploading file`, error);
            });
    }
}



  
  
