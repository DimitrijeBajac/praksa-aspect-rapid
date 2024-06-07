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

window.onload = function() {
    //dohvatiPodatkeObjekata();
    dohvatiPodatkeProstorija();
};

var opisEditor = new Quill('#opisEditor', {
    theme: 'snow'
});


/*-------------------popunjavanje select za stanove------------------------*/

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

// Funkcija za popunjavanje select polja sa podacima o objektima
function popuniSelectObjekti(objekti) {
    const selectObjekat = document.getElementById('objekat');

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


document.addEventListener('DOMContentLoaded', () => {
    // Dohvatanje ID-a stana iz URL-a
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Dohvatanje podataka o stanu sa servera koristeći Axios
    axios.get(`http://localhost:8080/stan/stanInfo/${id}`)
        .then(response => {
            const stan = response.data;
            // Popunjavanje polja forme sa podacima o stanu
            document.getElementById('brojStana').value = stan.brojStana;
            document.getElementById('sprat').value = stan.sprat;
            document.getElementById('sobnost').value = stan.sobnost;
            document.getElementById('kvadratura').value = stan.kvadratura;
            opisEditor.root.innerHTML = stan.opis;
            document.getElementById('dostupnost').value = stan.dostupnost ? 'true' : 'false';
            document.getElementById('spratnost').value = stan.spratnost;

            const databaseContainer1 = document.getElementById('databaseContainer1');
            const databaseContainer2 = document.getElementById('databaseContainer2');
            const databaseContainer3 = document.getElementById('databaseContainer3');

            let dupleksSlikeSection = document.querySelector('.dupleks_slike');
            if (stan.tip !== 'dupleks') {
                dupleksSlikeSection.style.display = 'none';
            }

            const databaseContainer4 = document.getElementById('databaseContainer4');
            const databaseContainer5 = document.getElementById('databaseContainer5');
            const databaseContainer6 = document.getElementById('databaseContainer6');

            const pdfContainer = document.getElementById('pdfContainer');

            //--------------funkcija za brisanje i prikazivanje slika------------

            function dodajSlikuSaIksom(kontejner, putanjaSlike, id) {

                if (!putanjaSlike) {
                    console.warn('Prazan putanjaSlike, slika neće biti dodana.');
                    return; // Ako je putanjaSlike null ili prazna, izlazimo iz funkcije
                }
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-container');

                const img = document.createElement('img');
                const originalPath = putanjaSlike;
                const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos"));
                img.src = '../../' +trimmedPath;

                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = 'X';
                removeBtn.classList.add('remove-btn');
                removeBtn.addEventListener('click', () => {
                    // Poziv za brisanje slike iz baze
                    axios.delete(`http://localhost:8080/stan/deleteImage`, {
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
                    axios.delete(`http://localhost:8080/stan/deletePdf`, {
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

            dodajSlikuSaIksom(databaseContainer1, stan.slikaPutanja1, stan.id);
            dodajSlikuSaIksom(databaseContainer2, stan.slikaPutanja2, stan.id);
            dodajSlikuSaIksom(databaseContainer3, stan.renderPutanja, stan.id);

            dodajSlikuSaIksom(databaseContainer4, stan.slikaDupleksPutanja1, stan.id);
            dodajSlikuSaIksom(databaseContainer5, stan.slikaDupleksPutanja2, stan.id);
            dodajSlikuSaIksom(databaseContainer6, stan.renderDupleksPutanja, stan.id);
            prikaziPDF(pdfContainer, stan.pdfPutanja, stan.id);
            console.log(stan.pdfPutanja);
                    
        
        })
                    .catch(error => console.error('Greška pri dohvatanju podataka o stanu:', error));
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
        formData.append('stanId', id);

        // Send the image to the server
        axios.post('http://localhost:8080/stan/updateImage', formData)
            .then(response => {
                console.log(`Image ${imageId} uploaded successfully`);
            })
            .catch(error => {
                console.error(`Error uploading image ${imageId}`, error);
            });
    }
}
            

/*-----------------------edit stan---------------------------------*/

document.getElementById("stanForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Gather form data
    const formData = new FormData();
    formData.append("brojStana", document.getElementById("brojStana").value);
    formData.append("sprat", document.getElementById("sprat").value);
    formData.append("sobnost", document.getElementById("sobnost").value);
    formData.append("kvadratura", document.getElementById("kvadratura").value);
    formData.append("dostupnost", document.getElementById("dostupnost").value);
    formData.append("spratnost", document.getElementById("spratnost").value);

    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Send form data to backend using PUT method
    axios.put(`http://localhost:8080/stan/updateStan/${id}`, formData)
        .then(response => {
            // Handle success
            console.log("Stan successfully updated:", response.data);
            // Redirect to some page or display a success message
        })
        .catch(error => {
            // Handle error
            console.error("Error updating stan:", error);
            // Display an error message to the user
        });
});



/*--------------------------------prostotije-------------------------------------------------------------------------------------*/


// Dohvaćanje podataka o svim objektima s servera
function dohvatiPodatkeProstorija() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); 
    axios.get(`http://localhost:8080/dashboard/getProstorije/${id}`)
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
        <td>${prostorija.nivo}</td>
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
        <select id="nivoProstorije" name="nivoProstorije" required>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </td>
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
        formData.append("nivo", document.getElementById("nivoProstorije").value);
        console.log(formData);
        axios.post(`http://localhost:8080/dashboard/addProstorija/${id}`, formData)
             .then(response => {
                 console.log(response.data);
                 alert("Prostorija je uspešno dodat!");
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
        tr.querySelectorAll('td:not(:last-child)').forEach((td, index) => {
            let input;
            if (index === 2) { // Za nivo
                input = document.createElement('select');
                input.innerHTML = `
                    <option value="1">1</option>
                    <option value="2">2</option>
                `;
                input.value = td.textContent;
            } else {
                input = document.createElement('input');
                input.value = td.textContent;
            }
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
                const nivo = tr.querySelector('td:nth-child(3) select').value;

                console.log(prostorijaId, naziv, kvadratura, nivo);
                
                // Pozivamo funkciju za ažuriranje prostorije na serveru
                updateProstorija(prostorijaId, naziv, kvadratura, nivo);

                
                // Onemogućavamo uređivanje nakon što se ažuriranje izvrši
                disableEditing(tr);
            }
        }
        
        // Onemogućava uređivanje polja unosa u redu tabele
        function disableEditing(tr) {
            tr.querySelectorAll('td:not(:last-child)').forEach((td, index) => {
                const input = td.querySelector('input, select');
                td.textContent = input.value;
            });
            
            // Uklanjamo slušača događaja sa polja unosa
            tr.removeEventListener('keydown', handleEnterKey);
        }
        
        // Funkcija za ažuriranje prostorije na serveru
        function updateProstorija(id, naziv, kvadratura, nivo) {
            const formData = new FormData();
            formData.append("naziv", naziv);
            formData.append("kvadraturaProstorije", kvadratura);
            formData.append("nivo", nivo);
            axios.put(`http://localhost:8080/dashboard/updateProstorija/${id}`, formData)
            .then(response => {
                // Handle success
                console.log("Stan successfully updated:", response.data);
                // Redirect to some page or display a success message
                alert("Uspesno ste dodali prostoriju");
                window.location.reload();
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
                console.log("Stan successfully updated:", response.data);
                alert("Uspesno ste obirsali prostoriju");
                window.location.reload();
            })
            .catch(error => {
                console.error("Error deleting stan:", error);
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
        axios.post(`http://localhost:8080/stan/uploadPdf/${id}`, formData)
            .then(response => {
                console.log(`File uploaded successfully`);
                alert(`File uploaded successfully`);
            })
            .catch(error => {
                console.error(`Error uploading file`, error);
            });
    }
}

  
  

