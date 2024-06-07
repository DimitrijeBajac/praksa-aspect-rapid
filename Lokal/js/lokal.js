window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const lokalId = urlParams.get('id');
    if (lokalId) {
        dohvatiPodatkeLokala(lokalId);
        dohvatiListuProstorija(lokalId);
        dohvatiSlikeLokala();
    }
};


function dohvatiPodatkeLokala(lokalId) {
    axios.get(`http://localhost:8080/lokal/lokalInfo/${lokalId}`)
        .then(response => {
            const data = response.data;
            console.log(data);
            prikazLokala(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanu:', error);
        });
}

function dohvatiListuProstorija(lokalId){
    axios.get(`http://localhost:8080/dashboard/getProstorijeLokal/${lokalId}`)
    .then(response => {
        const data = response.data;
        console.log(data);
        prikaziProstorije(data);
    })
    .catch(error => {
        console.error('Došlo je do greške prilikom dohvaćanja podataka o prostorijama stana:', error);
    });
}

function dohvatiSlikeLokala() {
    axios.get('http://localhost:8080/dashboard/getExistingImages', {
        params: {
            tip: 'lokal'
        }
    })
    .then(response => {
        const imageUrls = response.data;
        console.log('Lista URL-ova lokala:', imageUrls);
        // Ovdje možete manipulisati listom URL-ova slika kako vam odgovara
        prikazSlikaZaSlider(imageUrls);
    })
    .catch(error => {
        console.error('Greška prilikom dohvatanja slika:', error);
    });
}


function prikazLokala(lokal) {
    document.getElementById('naslovAdresa').textContent = lokal.objekat.adresa;
    const naslovElement = document.querySelector('.lokal_info .naslov h1');
    naslovElement.innerHTML = `<span class="bold">Lokal ${lokal.naziv}</span> ${lokal.kvadratura} m<sup>2</sup>`;

    const dostupnostElement = document.querySelector('.lokal_info .dostupnost');

    // Resetovanje sadržaja elementa dostupnostElement
    dostupnostElement.innerHTML = '';

    // Dodavanje statusa prodaje
    if (lokal.prodaja) {
        dostupnostElement.innerHTML += `<div class="green"><p>DOSTUPNO</p></div>`;
    } else {
        dostupnostElement.innerHTML += `<div class="red"><p>NEDOSTUPNO</p></div>`;
    }

    // Dodavanje statusa izdavanja
    if (lokal.izdavanje) {
        dostupnostElement.innerHTML += `<div class="orange" id="orange_izdavanje"><p>IZDAVANJE</p></div>`;
    }

    const objekatSlikaElement = document.querySelector('.lokal_info .objekat_slika img');

    const originalPath = lokal.slikaPutanja1;
    const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos")); 
    objekatSlikaElement.src = `../` + trimmedPath;

    const opisElement = document.querySelector('.lokal_info .opis');
    opisElement.textContent = lokal.opis;

    const lokalInfoSlikaTopElement = document.querySelector('.lokal_info .lokal_info_right_side .lokal_info_slika_top');
    if(lokal.slikaPutanja2){
        const originalPath = lokal.slikaPutanja2;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos"));
        lokalInfoSlikaTopElement.src = `../` + trimmedPath;
    }
    

    const lokalInfoSlikaBottomElement = document.querySelector('.lokal_info .lokal_info_right_side .lokal_info_slika_bottom');
    if(lokal.slikaPutanja3){
        const originalPath = lokal.slikaPutanja3;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos"));
        lokalInfoSlikaBottomElement.src = `../` + trimmedPath;
    }
    
}


function prikaziProstorije(prostorije){
    const tabelaBody = document.querySelector('#tabelaProstorija tbody');
    const ukupnaPovrsinaElement = document.getElementById('ukupnaPovrsina');
    tabelaBody.innerHTML = ''; // Clear existing rows

    let ukupnaPovrsina = 0;

    prostorije.forEach((prostorija, index) => {
        ukupnaPovrsina += prostorija.kvadraturaProstorije;

        const row = document.createElement('tr');

        const brojCell = document.createElement('td');
        brojCell.textContent = index + 1;
        row.appendChild(brojCell);

        const nazivCell = document.createElement('td');
        nazivCell.textContent = prostorija.naziv;
        row.appendChild(nazivCell);

        const kvadraturaCell = document.createElement('td');
        kvadraturaCell.innerHTML = `${prostorija.kvadraturaProstorije.toFixed(2)}m<sup>2</sup>`;
        row.appendChild(kvadraturaCell);

        tabelaBody.appendChild(row);
    });

    ukupnaPovrsinaElement.innerHTML = `${ukupnaPovrsina.toFixed(2)}m<sup>2</sup>`;
    const link = document.getElementById('pdfText');
    link.textContent = `Lokal - ${ukupnaPovrsina.toFixed(2)}m²`;
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

//------------------------------pdf link----------------------------------

function handlePdfLinkClick(event) {
    event.preventDefault(); // Prevent default link behavior (redirecting)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    axios({
        url: `http://localhost:8080/lokal/downloadPdf/${id}`,
        method: 'GET',
        responseType: 'blob' // Važno je da se postavi 'blob' kako bi preuzeli fajl
    })
    .then(response => {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Lokal.pdf'); // ili dinamički dobijeno ime fajla
        document.body.appendChild(link);
        link.click();
        // Ukloniti link nakon klika
        link.remove();
    })
    .catch(error => {
        console.error('Došlo je do greške prilikom dohvaćanja podataka o garazi:', error);
    });
}

