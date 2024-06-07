window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const stanId = urlParams.get('id');
    if (stanId) {
        dohvatiPodatkeStana(stanId);
        dohvatiListuProstorija(stanId);
        dohvatiSlikeStanova();
        dohvatiPodatkeStanova();
    }
};

function dohvatiPodatkeStanova() {
    axios.get('http://localhost:8080/stan/getAllDostupniStanovi')
        .then(response => {
            const data = response.data;
            console.log(data);
            dodajSlicnoUPonudi(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
        });
}

function dohvatiPodatkeStana(stanId) {
    axios.get(`http://localhost:8080/stan/stanInfo/${stanId}`)
        .then(response => {
            const data = response.data;
            console.log(data);
            prikazStana(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanu:', error);
        });
}

function dohvatiListuProstorija(stanId){
    axios.get(`http://localhost:8080/dashboard/getProstorije/${stanId}`)
    .then(response => {
        const data = response.data;
        console.log(data);
        prikaziProstorije(data);
    })
    .catch(error => {
        console.error('Došlo je do greške prilikom dohvaćanja podataka o prostorijama stana:', error);
    });
}

function dohvatiSlikeStanova() {
    axios.get('http://localhost:8080/dashboard/getExistingImages', {
        params: {
            tip: 'stan' // Postavite tip na 'stan'
        }
    })
    .then(response => {
        const imageUrls = response.data;
        console.log('Lista URL-ova slika:', imageUrls);
        // Ovdje možete manipulisati listom URL-ova slika kako vam odgovara
        prikazSlikaZaSlider(imageUrls);
    })
    .catch(error => {
        console.error('Greška prilikom dohvatanja slika:', error);
    });
}

function getSobnostName(sobnost) {
    switch (sobnost) {
        case 1:
            return "Jednosoban";
        case 2:
            return "Dvosoban";
        case 3:
            return "Trosoban";
        case 4:
            return "Četvorosoban";
        case 5:
            return "Petosoban";
        default:
            return "Nedefinisano"; // Dodajte ovaj deo ako postoji mogućnost drugih vrednosti osim 1-5
    }
}



function prikazStana(stan) {
    document.getElementById('naslovAdresa').textContent = stan.objekat.adresa;
    document.querySelector('.velicina_dostupnost h2').textContent =getSobnostName(stan.sobnost);
    document.querySelector('.velicina').innerHTML = `${stan.kvadratura} m<sup>2</sup>`;
    
    const kljucVrednostElements = document.querySelectorAll('.broj_stana .kljuc-vrednost');
    kljucVrednostElements[0].querySelector('.grey p').textContent = 'PK';
    kljucVrednostElements[0].querySelector('.red p').textContent = stan.sprat;
    kljucVrednostElements[1].querySelector('.grey p').textContent = 'STAN';
    kljucVrednostElements[1].querySelector('.red p').textContent = stan.brojStana;

    document.querySelector('.nivo p.nivo_levo').textContent = 'Nivo 1';
    if (stan.tip === 'dupleks') {
        document.querySelector('.nivo p:nth-child(2)').textContent = 'Nivo 2';
    }

    // Ažuriranje slika
    if (stan.slikaPutanja1) {  
        const originalPath = stan.slikaPutanja1;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 
        document.querySelector('.nivo_img img:nth-child(1)').src = '../' + trimmedPath;
    }
    if (stan.slikaDupleksPutanja1) {
        const originalPath = stan.slikaDupleksPutanja1;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 
        document.querySelector('.nivo_img img:nth-child(2)').src = '../' + trimmedPath;
    }
    if (stan.slikaPutanja2) {
        const originalPath = stan.slikaPutanja2;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 
        document.querySelector('.top_right img').src = '../' + trimmedPath;
    }
    if (stan.slikaPutanja2) {
        const originalPath = stan.slikaPutanja2;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 
        document.querySelector('.bottom_right .showOnMobile').src = '../' + trimmedPath;
    }
    if (stan.slikaDupleksPutanja2) {
        const originalPath = stan.slikaDupleksPutanja2;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 
        document.querySelector('.bottom_right_img').src = '../' + trimmedPath;
    }
    
    var bottomLeftP = document.querySelector('.bottom_left p');
    bottomLeftP.innerHTML = stan.opis.replace(/\n/g, '<br>');
    if(stan.tip !== 'dupleks'){
        bottomLeftP.style.maxWidth = '550px';
    }

    if(stan.renderPutanja){
        const originalPath = stan.renderPutanja;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 
        document.getElementById("top_img").src = '../' + trimmedPath;
    }

    if(stan.renderDupleksPutanja){
        const originalPath = stan.renderDupleksPutanja;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 
        document.getElementById("bottom_img").src = '../' + trimmedPath;
    }
}


function prikaziProstorije(prostorije) {
    const firstTableBody = document.querySelector('.first_tabela table');
    const secondTableBody = document.querySelector('.second_tabela table');
    let totalKvadraturaNivo1 = 0;
    let totalKvadraturaNivo2 = 0;

    prostorije.forEach(prostorija => {
        const row = document.createElement('tr');
        const nazivCell = document.createElement('td');
        const kvadraturaCell = document.createElement('td');

        nazivCell.textContent = prostorija.naziv;
        kvadraturaCell.textContent = `${prostorija.kvadraturaProstorije}m²`;

        row.appendChild(nazivCell);
        row.appendChild(kvadraturaCell);

        if (prostorija.nivo === 1) {
            firstTableBody.appendChild(row);
            totalKvadraturaNivo1 += prostorija.kvadraturaProstorije;
        } else if (prostorija.nivo === 2) {
            secondTableBody.appendChild(row);
            totalKvadraturaNivo2 += prostorija.kvadraturaProstorije;
        }
    });

    document.getElementById('nivo1-m2').textContent = totalKvadraturaNivo1.toFixed(2);
    document.getElementById('nivo2-m2').textContent = totalKvadraturaNivo2.toFixed(2);

    // Prikaži ili sakrij drugu tabelu na osnovu prisustva nivoa 2 prostorija
    const secondTableContainer = document.querySelector('.second_tabela');
    const hasNivo2 = prostorije.some(prostorija => prostorija.nivo === 2);
    secondTableContainer.style.display = hasNivo2 ? 'block' : 'none';

    // Izračunaj ukupnu površinu stana i ažuriraj odgovarajući HTML element
    const ukupnaPovrsina = totalKvadraturaNivo1 + totalKvadraturaNivo2;
    document.getElementById('ukupna_povrsina').textContent = `${ukupnaPovrsina.toFixed(2)}m²`;

    const link = document.getElementById('pdfText');
    link.textContent = `Stan - ${ukupnaPovrsina.toFixed(2)}m²`;
}

function prikazSlikaZaSlider(imageUrls){

    const sliderContainer = document.getElementById('slider_container');

    imageUrls.forEach(url => {

        const originalPath = url;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 

        const sliderImage = document.createElement('div');
        sliderImage.classList.add('slider_image');
        const image = document.createElement('img');
        image.src = '../' + trimmedPath;
        image.alt = 'Slika stana';
        sliderImage.appendChild(image);
        sliderContainer.appendChild(sliderImage);
    });

    $(document).ready(function(){
        var $slider = $('.slider');

        $slider.on('init reInit afterChange', function(event, slick, currentSlide) {
            var $prevButton = $('.custom-prev');
            var $nextButton = $('.custom-next');
            var firstVisibleIndex = slick.$slides.eq(slick.currentSlide).data('slick-index');
            var lastVisibleIndex = firstVisibleIndex + slick.options.slidesToShow - 1;

            if (firstVisibleIndex === 0) {
             $prevButton.css('background-color', 'rgba(217, 217, 217, 1)'); // Change the background color of the left button
             $prevButton.find('img').attr('src', 'Home/img/slider_arrow_right_black.png');
            } else {
            $prevButton.css('background-color', 'rgba(43, 43, 43, 1)'); // Reset the background color of the left button
            $prevButton.find('img').attr('src', 'Home/img/slider_arrow_right.png');

            }

            if (lastVisibleIndex >= slick.slideCount - 1) {
            $nextButton.css('background-color', 'rgba(217, 217, 217, 1)'); // Change the background color of the right button
            $nextButton.find('img').attr('src', 'Home/img/slider_arrow_right_black.png');
            } else {
            $nextButton.css('background-color', 'rgba(43, 43, 43, 1)'); // Reset the background color of the right button
            $nextButton.find('img').attr('src', 'Home/img/slider_arrow_right.png');
            }
            });

        });

    $('.slider').slick({
        dots: true,
        infinite: false,
        arrows: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: '<div class="custom-prev-stan"><img src="../Stan/img/arrow_left.png" alt=""></div>',
        nextArrow: '<div class="custom-next-stan"><img src="../Stan/img/arrow_right.png" alt=""></div>',
        responsive: [
            {
                breakpoint: 3024,
                settings: {
                 slidesToShow: 3,
                 slidesToScroll: 3,
                 infinite: false,
                 dots: true
                } 
            },
            {
                breakpoint: 2124,
                settings: {
                 slidesToShow: 3,
                 slidesToScroll: 3,
                 infinite: true,
                 dots: true
                } 
            },
            {
                breakpoint: 1024,
                settings: {
                 slidesToShow: 2,
                 slidesToScroll: 2,
                 infinite: true,
                 dots: true
                } 
            },
            {
            breakpoint: 700,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
            },
            {
            breakpoint: 680,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
            },
            {
            breakpoint: 432,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
            }

    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
    ],
    init: function(slick) {
    // Increase the size of the dots
    $('.slick-dots li button').css('font-size', '100px');
    }
    });
    
}


function dodajSlicnoUPonudi(podaci) {
    const sliderContainer = document.getElementById('stanovi-container');

    // Iteracija kroz podatke i kreiranje slajdova
    podaci.forEach(stan => {
        const slideDiv = document.createElement('div');
        const originalPath = stan.renderPutanja;

        // Trimovanje putanje
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos"));
        
        slideDiv.innerHTML = `
            <div class="grid_container">
                        <div class="card_left_side">
                            <img src="${'../' +trimmedPath}" alt="Slika stana">
                        </div>
                        <div class="card_right_side">
                            <h2>${getSobnostName(stan.sobnost)} stan</h2>
                            <div class="kvadratura">
                                <p>${stan.kvadratura}<span class="superscript">m<sup>2</sup></span></p>
                            </div>
                            <p>${stan.objekat.adresa}</p>
                            <a href="Stan/stan.html?id=${stan.id}" class="btn btn_slider">Pogledajte više</a>
                            <div class="footer_slider">
                                <p>${stan.objekat.naziv}</p>
                            </div>
                        </div>
                    </div>`;

        sliderContainer.appendChild(slideDiv);
    });

}


//------------------------------pdf link----------------------------------

function handlePdfLinkClick(event) {
    event.preventDefault(); // Prevent default link behavior (redirecting)
    const urlParams = new URLSearchParams(window.location.search);
    const stanId = urlParams.get('id');

    axios({
        url: `http://localhost:8080/stan/downloadPdf/${stanId}`,
        method: 'GET',
        responseType: 'blob' // Važno je da se postavi 'blob' kako bi preuzeli fajl
    })
    .then(response => {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stan.pdf'); // ili dinamički dobijeno ime fajla
        document.body.appendChild(link);
        link.click();
        // Ukloniti link nakon klika
        link.remove();
    })
    .catch(error => {
        console.error('Došlo je do greške prilikom dohvaćanja podataka o stanu:', error);
    });
}
