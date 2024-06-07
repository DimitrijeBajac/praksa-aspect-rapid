
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


//-------------------------------------odabir tipa forma za dodavanje stana ------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const tipStanaSelect = document.getElementById("tipStana");
    const stanForm = document.getElementById("stanForm");
    const dupleksFields = document.querySelector(".dupleks-fields");

    tipStanaSelect.addEventListener("change", function() {
        if (tipStanaSelect.value === "dupleks") {
            dupleksFields.style.display = "block";
        } else {
            dupleksFields.style.display = "none";
        }
        // Show the form if a valid option is selected
        stanForm.style.display = tipStanaSelect.value ? "block" : "none";
    });

});


//-------------------------------------dodavanje stana------------------------------------------------------------------

document.getElementById("stanForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("objekatId", document.getElementById("objekat").value);
    formData.append("brojStana", document.getElementById("brojStana").value);
    formData.append("sprat", document.getElementById("sprat").value);
    formData.append("sobnost", document.getElementById("sobnost").value);
    formData.append("kvadratura", document.getElementById("kvadratura").value);
    formData.append("opis", document.getElementById("opisEditor").innerText);
    formData.append("dostupnost", document.getElementById("dostupnost").value);
    formData.append("slika1", document.getElementById("slika1").files[0]);
    formData.append("slika2", document.getElementById("slika2").files[0]);
    formData.append("render", document.getElementById("render").files[0]);
    formData.append("tip", document.getElementById("tipStana").value);
    formData.append("spratnost", document.getElementById("spratnost").value);



    if (document.getElementById("tipStana").value === "dupleks") {
        formData.append("slikaDupleks1", document.getElementById("slikaDupleks1").files[0] || null);
        formData.append("slikaDupleks2", document.getElementById("slikaDupleks2").files[0] || null);
        formData.append("renderDupleks", document.getElementById("renderDupleks").files[0] || null);
    }

    axios.post('http://localhost:8080/stan/addStan', formData)
         .then(response => {
             console.log(response.data);
             alert("Stan je uspešno dodat!");
         })
         .catch(error => {
             console.error(error);
             // Dodajte logiku za obradu greške
             alert("Došlo je do greške prilikom dodavanja stana. Molimo vas, pokušajte ponovo.");
             
         });
});

/*-------------------popunjavanje select za stanove------------------------*/

// Funkcija za popunjavanje select polja sa podacima o objektima
function popuniSelectObjekti(objekti, selectId) {
    const selectObjekat = document.getElementById(selectId);

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





/*--------------------------ucaitavanje stanova---------------------------------*/

// Dohvaćanje podataka o svim stanovima s servera
function dohvatiPodatkeStanova() {
    axios.get('http://localhost:8080/stan/getAllStanovi')
        .then(response => {
            // Ako je odgovor uspješan, dohvatite podatke
            const data = response.data;
            // Prikazivanje podataka o stanovima
            prikaziStanove(data);
            console.log(data);
        })
        .catch(error => {
            // Ako je došlo do greške, prikažite poruku o grešci
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
        });
}

//-----------------------------------------ucitavanje podataka po otvaranju stranice----------------------------------------------------------
window.onload = function() {
    dohvatiPodatkeStanova();
    dohvatiPodatkeObjekata();
    dohvatiPodatkeLokala();
    dohvatiPodatkeGaraza();
};


function prikaziStanove(stanovi) {
    const tabelaStanova = document.createElement('table');
    tabelaStanova.classList.add('stanovi-table');

    // Kreiranje zaglavlja tablice
    const zaglavlje = document.createElement('tr');
    const zaglavljeObjekat = document.createElement('th');
    zaglavljeObjekat.textContent = 'Objekat';
    const zaglavljeBrojStana = document.createElement('th');
    zaglavljeBrojStana.textContent = 'Broj stana';
    const zaglavljeSprat = document.createElement('th');
    zaglavljeSprat.textContent = 'Sprat';
    const zaglavljeDostupnost = document.createElement('th');
    zaglavljeDostupnost.textContent = 'Dostupnost';
    const zaglavljeUredi = document.createElement('th'); // Dodajemo zaglavlje za uređivanje
    zaglavljeUredi.textContent = 'Uredi'; // Tekst za zaglavlje uređivanja
    zaglavlje.appendChild(zaglavljeObjekat);
    zaglavlje.appendChild(zaglavljeBrojStana);
    zaglavlje.appendChild(zaglavljeSprat);
    zaglavlje.appendChild(zaglavljeDostupnost);
    zaglavlje.appendChild(zaglavljeUredi); // Dodajemo zaglavlje za uređivanje
    tabelaStanova.appendChild(zaglavlje);

    // Dodavanje podataka o stanovima u tablicu
    stanovi.forEach(stan => {
        const red = document.createElement('tr');
        
        const poljeObjekat = document.createElement('td');
        if (stan.objekat !== null) {
            poljeObjekat.textContent = stan.objekat.naziv;
        } else {
            // Ako objekat nije povezan, možete postaviti alternativni tekst ili neku drugu akciju
            poljeObjekat.textContent = "Nepoznato";
        }

        const poljeBrojStana = document.createElement('td');
        poljeBrojStana.textContent = stan.brojStana;

        const poljeSprat = document.createElement('td');
        poljeSprat.textContent = stan.sprat;

        const poljeDostupnost = document.createElement('td');
        poljeDostupnost.textContent = stan.dostupnost ? 'Dostupno' : 'Nedostupno';
        

        const poljeUredi = document.createElement('td'); // Dodajemo polje za uređivanje
        const dugmeUredi = document.createElement('button'); // Dodajemo dugme za uređivanje
        dugmeUredi.textContent = 'Uredi';
        dugmeUredi.addEventListener('click', () => {
            // Redirekcija na stranicu za uređivanje stana sa ID-om stan.id
            window.location.href = `../Dashboard/pages/urediStan.html?id=${stan.id}`;
        });
        const dugmeUkloni = document.createElement('button'); // Dodajemo dugme za uređivanje
        dugmeUkloni.textContent = 'Ukloni';
        dugmeUkloni.classList.add('ukloni-dugme');
        dugmeUkloni.addEventListener('click', () => {
            // Pozivamo funkciju za brisanje objekta
            obrisiStan(stan.id);
        });

        poljeUredi.appendChild(dugmeUredi); // Dodajemo dugme za uređivanje u polje
        poljeUredi.appendChild(dugmeUkloni);
       
        red.appendChild(poljeObjekat);
        red.appendChild(poljeBrojStana);
        red.appendChild(poljeSprat);
        red.appendChild(poljeDostupnost);
        red.appendChild(poljeUredi); // Dodajemo polje za uređivanje

        tabelaStanova.appendChild(red);
    });

    document.querySelector('.container_lista_stanova').appendChild(tabelaStanova);

}




/*-------------------------------------------prikaz slike sa inputa ---------------------------------------------*/


// Funkcija za prikazivanje slike ili rendera ispod odgovarajuće labelle
function prikaziSlike(input, divZaPrikaz) {
    if (input.files && input.files.length > 0) {
        const prikazDiv = document.getElementById(divZaPrikaz);
        prikazDiv.innerHTML = ''; // Resetujemo div pre dodavanja novih slika

        // Iteriramo kroz sve odabrane fajlove i prikazujemo ih
        for (let i = 0; i < input.files.length; i++) {
            const reader = new FileReader();

            reader.onload = function(e) {
                // Kreiramo <img> element za prikaz svake slike ili rendera
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('slika-preview');

                // Dodajemo sliku u div za prikaz
                prikazDiv.appendChild(img);
            };

            // Čitamo trenutni fajl kao URL
            reader.readAsDataURL(input.files[i]);
        }
    }
}

// Dodavanje event listener-a za promenu vrednosti polja za sliku 1
document.getElementById('slika1').addEventListener('change', function() {
    prikaziSlike(this, 'prikazSlike1');
});

// Dodavanje event listener-a za promenu vrednosti polja za sliku 2
document.getElementById('slika2').addEventListener('change', function() {
    prikaziSlike(this, 'prikazSlike2');
});

// Dodavanje event listener-a za promenu vrednosti polja za render
document.getElementById('render').addEventListener('change', function() {
    prikaziSlike(this, 'prikazRendera');
});


document.getElementById('naslovnaSlikaLokal').addEventListener('change', function() {
    prikaziSlike(this, 'prikazNaslovnaSlikaLokal');
});

document.getElementById('slika1Lokal').addEventListener('change', function() {
    prikaziSlike(this, 'prikazSlike1Lokal');
});

document.getElementById('slika2Lokal').addEventListener('change', function() {
    prikaziSlike(this, 'prikazSlike2Lokal');
});

document.getElementById('slika3Lokal').addEventListener('change', function() {
    prikaziSlike(this, 'prikazSlike3Lokal');
});

document.getElementById('coverSlika').addEventListener('change', function() {
    prikaziSlike(this, 'prikazCoverSlike');
});

//dupleks
document.getElementById('slikaDupleks1').addEventListener('change', function() {
    prikaziSlike(this, 'prikazSlikeDupleks1');
});

document.getElementById('slikaDupleks2').addEventListener('change', function() {
    prikaziSlike(this, 'prikazSlikeDupleks2');
});

document.getElementById('renderDupleks').addEventListener('change', function() {
    prikaziSlike(this, 'prikazRenderDupleks');
});




/*-----------------------------------dodavanje objekta text edit-----------------------------*/

 // Inicijalizacija prvog Quill editora
 var editor1 = new Quill('#editor1', {
    theme: 'snow'
});

// Inicijalizacija drugog Quill editora
var editor2 = new Quill('#editor2', {
    theme: 'snow'
});

var editor3 = new Quill('#opisEditor', {
    theme: 'snow'
});

var editorLokal = new Quill('#opisEditorLokal', {
    theme: 'snow'
});

var editorGaraza = new Quill('#opisEditorGaraza', {
    theme: 'snow'
});




/*------------------------------dodavanje objekta-------------------------------*/


document.getElementById("objekatForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("naziv", document.getElementById("naziv").value);
    formData.append("mesto", document.getElementById("mesto").value);
    formData.append("adresa", document.getElementById("adresa").value);
    formData.append("tekst1", document.getElementById("editor1").innerText);
    formData.append("tekst2", document.getElementById("editor2").innerText);
    formData.append("aktuelan", document.getElementById("aktuelan").value);
    formData.append("coverSlika", document.getElementById("coverSlika").files[0]);
    axios.post('http://localhost:8080/dashboard/addObjekat', formData)
         .then(response => {
             console.log(response.data);
             alert("Objekat je uspešno dodat!");
         })
         .catch(error => {
             if (error.response.status === 400) {
                 // Ako je status greške 400 (Bad Request), to znači da postoji objekat sa istim nazivom
                 alert("Objekat sa istim nazivom već postoji. Molimo vas, izaberite drugi naziv.");
             } else {
                 // Ako je greška neka druga, obavestite korisnika o opštoj grešci
                 alert("Došlo je do greške prilikom dodavanja objekta. Molimo vas, pokušajte ponovo.");
             }
         });
});



/*--------------------------ucaitavanje objekata---------------------------------*/



// Dohvaćanje podataka o svim objektima s servera
function dohvatiPodatkeObjekata() {
    axios.get('http://localhost:8080/dashboard/getObjekti')
        .then(response => {
            // Ako je odgovor uspješan, dohvatite podatke
            const data = response.data;
            // Prikazivanje podataka o stanovima
            popuniSelectObjekti(data, 'objekat');
            popuniSelectObjekti(data, 'objekatLokal');
            popuniSelectObjekti(data, 'objekatGaraza');
            prikaziObjekte(data);
        })
        .catch(error => {
            // Ako je došlo do greške, prikažite poruku o grešci
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
        });
}
function prikaziObjekte(data) {
    const tabelaObjekata = document.createElement('table');
    tabelaObjekata.classList.add('objekti-table');

    // Kreiranje zaglavlja tablice
    const zaglavlje = document.createElement('tr');
    const zaglavljeNaziv = document.createElement('th');
    zaglavljeNaziv.textContent = 'Naziv';
    const zaglavljeDostupnost = document.createElement('th');
    zaglavljeDostupnost.textContent = 'Aktuelno';
    const zaglavljeUredi = document.createElement('th'); // Dodajemo zaglavlje za uređivanje
    zaglavljeUredi.textContent = 'Uredi'; // Tekst za zaglavlje uređivanja
    zaglavlje.appendChild(zaglavljeNaziv);
    zaglavlje.appendChild(zaglavljeDostupnost);
    zaglavlje.appendChild(zaglavljeUredi); // Dodajemo zaglavlje za uređivanje
    tabelaObjekata.appendChild(zaglavlje);

    // Dodavanje podataka o objektima u tablicu
    data.forEach(objekat => {
        const red = document.createElement('tr');

        const poljeNaziv = document.createElement('td');
        poljeNaziv.textContent = objekat.naziv;

        const poljeDostupnost = document.createElement('td');
        poljeDostupnost.textContent = objekat.aktuelan ? 'Da' : 'Ne';

        const poljeUredi = document.createElement('td'); // Dodajemo polje za uređivanje
        const dugmeUredi = document.createElement('button'); // Dodajemo dugme za uređivanje
        dugmeUredi.textContent = 'Uredi';
        dugmeUredi.addEventListener('click', () => {
            // Redirekcija na stranicu za uređivanje objekta sa ID-om objekat.id
            window.location.href = `../Dashboard/pages/urediObjekat.html?id=${objekat.id}`;
        });
        const dugmeUkloni = document.createElement('button'); // Dodajemo dugme za uređivanje
        dugmeUkloni.textContent = 'Ukloni';
        dugmeUkloni.classList.add('ukloni-dugme');
        dugmeUkloni.addEventListener('click', () => {
            // Pozivamo funkciju za brisanje objekta
            obrisiObjekat(objekat.id);
        });
        poljeUredi.appendChild(dugmeUredi); // Dodajemo dugme za uređivanje u polje
        poljeUredi.appendChild(dugmeUkloni);

        red.appendChild(poljeNaziv);
        red.appendChild(poljeDostupnost);
        red.appendChild(poljeUredi); // Dodajemo polje za uređivanje

        tabelaObjekata.appendChild(red);
    });

    document.querySelector('.container_lista_objekata').appendChild(tabelaObjekata);
}

function obrisiObjekat(id) {
    axios.delete(`http://localhost:8080/dashboard/obrisiObjekat/${id}`)
        .then(response => {
            // Uspešno brisanje objekta
            console.log('Objekat uspešno obrisan:', response);
            // Dodajte dodatne akcije ako je potrebno, kao što je ažuriranje UI-a
            window.location.reload();
        })
        .catch(error => {
            // Greška prilikom brisanja objekta
            console.error('Greška prilikom brisanja objekta:', error);
            // Dodajte logiku za prikazivanje poruke korisniku ili druge akcije
        });
}


function obrisiStan(id) {
    axios.delete(`http://localhost:8080/stan/deleteStan/${id}`)
        .then(response => {
            // Uspešno brisanje objekta
            console.log('Stan uspešno obrisan:', response);
            // Dodajte dodatne akcije ako je potrebno, kao što je ažuriranje UI-a
            window.location.reload();
        })
        .catch(error => {
            // Greška prilikom brisanja objekta
            console.error('Greška prilikom brisanja stana:', error);
            // Dodajte logiku za prikazivanje poruke korisniku ili druge akcije
        });
}





// ------------------------------------------------izgled stranice-------------------------------------------------

    
document.addEventListener('DOMContentLoaded', () => {
    const objektiLink = document.getElementById('objektiLink');
    const stanoviLink = document.getElementById('stanoviLink');
    const lokaliLink = document.getElementById('lokaliLink');
    const garazeLink = document.getElementById('garazeLink');
    const objektiKontejner = document.getElementsByClassName('objektiKontejner')[0];
    const stanoviKontejner = document.getElementsByClassName('stanoviKontejner')[0];
    const lokaliKontejner = document.getElementsByClassName('lokalKontejner')[0];
    const garazaKontejner = document.getElementsByClassName('garazaKontejner')[0];
    

    // Debugging: Log the elements to check if they are correctly referenced
    console.log({ objektiLink, stanoviLink, objektiKontejner, stanoviKontejner });

    // Check if all elements are properly referenced
    if (objektiLink && stanoviLink && objektiKontejner && stanoviKontejner) {
        // Show the Objekti section and hide the Stanovi section
        objektiLink.addEventListener('click', () => {
            objektiKontejner.classList.add('show');
            stanoviKontejner.classList.remove('show');
            lokaliKontejner.classList.remove('show');
            garazaKontejner.classList.remove('show');
        });

        // Show the Stanovi section and hide the Objekti section
        stanoviLink.addEventListener('click', () => {
            stanoviKontejner.classList.add('show');
            objektiKontejner.classList.remove('show');
            lokaliKontejner.classList.remove('show');
            garazaKontejner.classList.remove('show');
        });
        lokaliLink.addEventListener('click', () => {
            stanoviKontejner.classList.remove('show');
            objektiKontejner.classList.remove('show');
            lokaliKontejner.classList.add('show');
            garazaKontejner.classList.remove('show');
        });
        garazeLink.addEventListener('click', () => {
            stanoviKontejner.classList.remove('show');
            objektiKontejner.classList.remove('show');
            lokaliKontejner.classList.remove('show');
            garazaKontejner.classList.add('show');
        });
    } else {
        console.error('One or more elements not found');
    }
});




// -----------------------------------------dodavanje lokala ---------------------------------------------------

document.getElementById("lokalForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Gather form data
    const formData = new FormData();
    formData.append("objekatId", document.getElementById("objekatLokal").value);
    formData.append("naziv", document.getElementById("nazivLokal").value);
    formData.append("prodaja", document.getElementById("prodaja").value === "true");
    formData.append("izdavanje", document.getElementById("izdavanje").value === "true");
    formData.append("kvadratura", document.getElementById("kvadraturaLokal").value);
    formData.append("opisLokal", document.getElementById("opisEditorLokal").innerText); // Ovde možete pročitati sadržaj Quill editora
    formData.append("naslovnaSlikaLokal", document.getElementById("naslovnaSlikaLokal").files[0]);
    formData.append("slika1Lokal", document.getElementById("slika1Lokal").files[0]);
    formData.append("slika2Lokal", document.getElementById("slika2Lokal").files[0]);
    formData.append("slika3Lokal", document.getElementById("slika3Lokal").files[0]);
    
    
     // Log each image before sending
     console.log("Naslovna slika:", document.getElementById("naslovnaSlikaLokal").files[0]);
     console.log("Slika 1:", document.getElementById("slika1Lokal").files[0]);
     console.log("Slika 2:", document.getElementById("slika2Lokal").files[0]);
     console.log("Slika 3:", document.getElementById("slika3Lokal").files[0]);

    // Send form data to backend using POST method
    axios.post("http://localhost:8080/lokal/addLokal", formData)
        .then(response => {
            // Handle success
            console.log("Lokal successfully added:", response.data);
            // Redirect to some page or display a success message
            alert("Uspesno ste dodali Lokal.")
        })
        .catch(error => {
            // Handle error
            console.error("Error adding lokal:", error);
            // Display an error message to the user
        });
});



// ------------------------------- lista svih lokala ----------------------------------------------

function dohvatiPodatkeLokala() {
    axios.get('http://localhost:8080/lokal/getAllLokali')
        .then(response => {
            // Ako je odgovor uspješan, dohvatite podatke
            const data = response.data;
            // Prikazivanje podataka o lokalima
            prikaziLokale(data);
            console.log(data);
        })
        .catch(error => {
            // Ako je došlo do greške, prikažite poruku o grešci
            console.error('Došlo je do greške prilikom dohvaćanja podataka o lokalima:', error);
        });
}



function prikaziLokale(lokali) {
    const tabelaLokala = document.createElement('table');
    tabelaLokala.classList.add('lokali-table');

    // Kreiranje zaglavlja tablice
    const zaglavlje = document.createElement('tr');
    const zaglavljeNaziv = document.createElement('th');
    zaglavljeNaziv.textContent = 'Naziv'; // Dodajemo zaglavlje za naziv
    const zaglavljeObjekat = document.createElement('th');
    zaglavljeObjekat.textContent = 'Objekat';
    const zaglavljeProdaja = document.createElement('th');
    zaglavljeProdaja.textContent = 'Prodaja';
    const zaglavljeIzdavanje = document.createElement('th');
    zaglavljeIzdavanje.textContent = 'Izdavanje';
    const zaglavljeKvadratura = document.createElement('th');
    zaglavljeKvadratura.textContent = 'Kvadratura';
    const zaglavljeUredi = document.createElement('th'); // Dodajemo zaglavlje za uređivanje
    zaglavljeUredi.textContent = 'Uredi'; // Tekst za zaglavlje uređivanja
    zaglavlje.appendChild(zaglavljeNaziv); // Dodajemo zaglavlje za naziv
    zaglavlje.appendChild(zaglavljeObjekat);
    zaglavlje.appendChild(zaglavljeProdaja);
    zaglavlje.appendChild(zaglavljeIzdavanje);
    zaglavlje.appendChild(zaglavljeKvadratura);
    zaglavlje.appendChild(zaglavljeUredi); // Dodajemo zaglavlje za uređivanje
    tabelaLokala.appendChild(zaglavlje);

    // Dodavanje podataka o lokalima u tablicu
    lokali.forEach(lokal => {
        const red = document.createElement('tr');

        const poljeNaziv = document.createElement('td');
        poljeNaziv.textContent = lokal.naziv; // Dodajemo naziv lokala

        const poljeObjekat = document.createElement('td');
        if (lokal.objekat !== null) {
            poljeObjekat.textContent = lokal.objekat.naziv;
        } else {
            // Ako objekat nije povezan, možete postaviti alternativni tekst ili neku drugu akciju
            poljeObjekat.textContent = "Nepoznato";
        }

        const poljeProdaja = document.createElement('td');
        poljeProdaja.textContent = lokal.prodaja ? 'Da' : 'Ne';

        const poljeIzdavanje = document.createElement('td');
        poljeIzdavanje.textContent = lokal.izdavanje ? 'Da' : 'Ne';

        const poljeKvadratura = document.createElement('td');
        poljeKvadratura.textContent = lokal.kvadratura;

        const poljeUredi = document.createElement('td'); // Dodajemo polje za uređivanje
        const dugmeUredi = document.createElement('button'); // Dodajemo dugme za uređivanje
        dugmeUredi.textContent = 'Uredi';
        dugmeUredi.addEventListener('click', () => {
            // Redirekcija na stranicu za uređivanje lokala sa ID-jem lokal.id
            window.location.href = `../Dashboard/pages/urediLokal.html?id=${lokal.id}`;
        });
        const dugmeUkloni = document.createElement('button'); // Dodajemo dugme za uređivanje
        dugmeUkloni.textContent = 'Ukloni';
        dugmeUkloni.classList.add('ukloni-dugme');
        dugmeUkloni.addEventListener('click', () => {
            // Pozivamo funkciju za brisanje objekta
            obrisiLokal(lokal.id);
        });

        poljeUredi.appendChild(dugmeUredi); // Dodajemo dugme za uređivanje u polje
        poljeUredi.appendChild(dugmeUkloni);

        red.appendChild(poljeNaziv); // Dodajemo polje za naziv
        red.appendChild(poljeObjekat);
        red.appendChild(poljeProdaja);
        red.appendChild(poljeIzdavanje);
        red.appendChild(poljeKvadratura);
        red.appendChild(poljeUredi); // Dodajemo polje za uređivanje

        tabelaLokala.appendChild(red);
    });

    document.querySelector('.container_lista_lokala').appendChild(tabelaLokala);
}

function obrisiLokal(id) {
    axios.delete(`http://localhost:8080/lokal/deleteLokal/${id}`)
        .then(response => {
            // Uspešno brisanje objekta
            console.log('Stan uspešno obrisan:', response);
            // Dodajte dodatne akcije ako je potrebno, kao što je ažuriranje UI-a
            alert("Uspesno ste obrisali lokal.");
            window.location.reload();
        })
        .catch(error => {
            // Greška prilikom brisanja objekta
            console.error('Greška prilikom brisanja objekta:', error);
            // Dodajte logiku za prikazivanje poruke korisniku ili druge akcije
        });
}




//----------------------------------------------------dodavanje garaze---------------------------------------------------

document.getElementById('garazaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('objekatId', document.getElementById('objekatGaraza').value);
    formData.append('naziv', document.getElementById('nazivGaraza').value);
    formData.append('tip', document.getElementById('tipGaraza').value);
    formData.append('kvadratura', document.getElementById('kvadraturaGaraza').value);
    formData.append('opis', document.getElementById('opisEditorGaraza').innerText);
    formData.append('dostupnost', document.getElementById('dostupnostGaraza').value === 'true');

    console.log(document.getElementById('objekatGaraza').value);

    axios.post('http://localhost:8080/garaza/addGaraza', formData)
        .then(response => {
            console.log('Garaža uspešno dodata:', response.data);
            alert('Garaža uspešno dodata');
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dodavanja garaže:', error);
        });
});



//--------------------------------------listanje svih garaza------------------------------------------------------------------

function dohvatiPodatkeGaraza() {
    axios.get('http://localhost:8080/garaza/getAllGaraze')
        .then(response => {
            // Ako je odgovor uspešan, dohvatite podatke
            const data = response.data;
            // Prikazivanje podataka o garažama
            prikaziGaraze(data);
            console.log(data);
        })
        .catch(error => {
            // Ako je došlo do greške, prikažite poruku o grešci
            console.error('Došlo je do greške prilikom dohvaćanja podataka o garažama:', error);
        });
}

function prikaziGaraze(garaze) {
    const tabelaGaraza = document.createElement('table');
    tabelaGaraza.classList.add('garaze-table');

    // Kreiranje zaglavlja tablice
    const zaglavlje = document.createElement('tr');
    const zaglavljeObjekat = document.createElement('th');
    zaglavljeObjekat.textContent = 'Objekat';
    const zaglavljeNaziv = document.createElement('th');
    zaglavljeNaziv.textContent = 'Naziv';
    const zaglavljeTip = document.createElement('th');
    zaglavljeTip.textContent = 'Tip';
    const zaglavljeKvadratura = document.createElement('th');
    zaglavljeKvadratura.textContent = 'Kvadratura';
    const zaglavljeDostupnost = document.createElement('th');
    zaglavljeDostupnost.textContent = 'Dostupnost';
    const zaglavljeUredi = document.createElement('th');
    zaglavljeUredi.textContent = 'Uredi';

    zaglavlje.appendChild(zaglavljeObjekat);
    zaglavlje.appendChild(zaglavljeNaziv);
    zaglavlje.appendChild(zaglavljeTip);
    zaglavlje.appendChild(zaglavljeKvadratura);
    zaglavlje.appendChild(zaglavljeDostupnost);
    zaglavlje.appendChild(zaglavljeUredi);

    tabelaGaraza.appendChild(zaglavlje);

    // Dodavanje podataka o garažama u tablicu
    garaze.forEach(garaza => {
        const red = document.createElement('tr');

        const poljeObjekat = document.createElement('td');
        if (garaza.objekat !== null) {
            poljeObjekat.textContent = garaza.objekat.naziv;
        } else {
            poljeObjekat.textContent = "Nepoznato";
        }

        const poljeNaziv = document.createElement('td');
        poljeNaziv.textContent = garaza.naziv;

        const poljeTip = document.createElement('td');
        poljeTip.textContent = garaza.tip;

        const poljeKvadratura = document.createElement('td');
        poljeKvadratura.textContent = garaza.kvadratura;

        const poljeDostupnost = document.createElement('td');
        poljeDostupnost.textContent = garaza.dostupnost ? 'Da' : 'Ne';

        const poljeUredi = document.createElement('td');
        const dugmeUredi = document.createElement('button');
        dugmeUredi.textContent = 'Uredi';
        dugmeUredi.addEventListener('click', () => {
            // Redirekcija na stranicu za uređivanje garaže sa ID-om garaza.id
            window.location.href = `../Dashboard/pages/urediGaraza.html?id=${garaza.id}`;
        });

        const dugmeUkloni = document.createElement('button');
        dugmeUkloni.textContent = 'Ukloni';
        dugmeUkloni.classList.add('ukloni-dugme');
        dugmeUkloni.addEventListener('click', () => {
            // Pozivamo funkciju za brisanje garaže
            obrisiGarazu(garaza.id);
        });

        poljeUredi.appendChild(dugmeUredi);
        poljeUredi.appendChild(dugmeUkloni);

        red.appendChild(poljeObjekat);
        red.appendChild(poljeNaziv);
        red.appendChild(poljeTip);
        red.appendChild(poljeKvadratura);
        red.appendChild(poljeDostupnost);
        red.appendChild(poljeUredi);

        tabelaGaraza.appendChild(red);
    });

    document.querySelector('.container_lista_garaza').appendChild(tabelaGaraza);
}

function obrisiGarazu(id) {
    axios.delete(`http://localhost:8080/garaza/deleteGaraza/${id}`)
        .then(response => {
            console.log('Garaža uspešno obrisana:', response.data);
            alert("Garaža uspešno obrisana");
            location.reload(); // Osvežavanje stranice nakon brisanja
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom brisanja garaže:', error);
            alert('Došlo je do greške prilikom brisanja garaže');
        });
}

//-------------------------------galerijaaaaaa kod-----------------------------------------------------------------------


document.addEventListener("DOMContentLoaded", function() {
    const gallerySections = document.querySelectorAll('.galerijaSection');

    gallerySections.forEach(section => {
        const tip = section.getAttribute('data-tip');
        const previewContainer = section.querySelector('.image-preview');
        const form = section.querySelector('.imageGalleryForm');
        const input = section.querySelector('.galerijaInput');
        const databaseContainer = section.querySelector('.images_database');

        fetchExistingImages(tip, databaseContainer);

        input.addEventListener('change', function() {
            previewContainer.innerHTML = ''; // Clear existing previews
            const files = this.files;
            const fileArray = Array.from(files);

            fileArray.forEach((file, index) => {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-container');
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;

                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = 'X';
                    removeBtn.classList.add('remove-btn');
                    removeBtn.addEventListener('click', () => {
                        imgContainer.remove();
                        fileArray.splice(index, 1);
                        updateFileInput(fileArray, input);
                    });

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    previewContainer.appendChild(imgContainer);
                }

                reader.readAsDataURL(file);
            });

            function updateFileInput(files, input) {
                const dataTransfer = new DataTransfer();
                files.forEach(file => {
                    dataTransfer.items.add(file);
                });
                input.files = dataTransfer.files;
            }
        });

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData();
            const files = input.files;

            for (let i = 0; i < files.length; i++) {
                formData.append("listaSlika", files[i]);
            }
            console.log(files);
            formData.append("tip", tip);

            console.log('FormData content:');
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            axios.post(`http://localhost:8080/dashboard/uploadGallery`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log('Success:', response.data);
                alert('Images uploaded successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error uploading images');
            });
        });
    });
});

function fetchExistingImages(tip, databaseContainer) {
    axios.get(`http://localhost:8080/dashboard/getExistingImages?tip=${tip}`)
        .then(response => {
            const images = response.data;
            databaseContainer.innerHTML = ''; // Clear existing previews

            images.forEach(imageUrl => {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-container');
                
                const trimmedPath = imageUrl.substring(imageUrl.lastIndexOf("SavedPhotos"));
                const img = document.createElement('img');
                img.src = '../' + trimmedPath;

                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = 'X';
                removeBtn.classList.add('remove-btn');
                removeBtn.addEventListener('click', () => {
                    // Call backend to remove the image from the server
                    axios.delete(`http://localhost:8080/dashboard/deleteImage`, {
                        params: {
                            imageUrl: imageUrl,
                            tip: tip
                        }
                    })
                        .then(() => {
                            imgContainer.remove();
                            alert("Image deleted");
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Error deleting image');
                        });
                });

                imgContainer.appendChild(img);
                imgContainer.appendChild(removeBtn);
                databaseContainer.appendChild(imgContainer);
            });
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
}














