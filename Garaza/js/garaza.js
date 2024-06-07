window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const garazaId = urlParams.get('id');
    if (garazaId) {
        dohvatiPodatkeGaraze(garazaId);
        dohvatiSlikeGaraze();
    }
};


function dohvatiPodatkeGaraze(garazaId) {
    axios.get(`http://localhost:8080/garaza/garazaInfo/${garazaId}`)
        .then(response => {
            const data = response.data;
            console.log(data);
            prikazGaraze(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanu:', error);
        });
}

function dohvatiSlikeGaraze() {
    axios.get('http://localhost:8080/dashboard/getExistingImages', {
        params: {
            tip: 'garaza'
        }
    })
    .then(response => {
        const imageUrls = response.data;
        console.log('Lista URL-ova garaze:', imageUrls);
        // Ovdje možete manipulisati listom URL-ova slika kako vam odgovara
        prikazSlikaZaSlider(imageUrls);
    })
    .catch(error => {
        console.error('Greška prilikom dohvatanja slika:', error);
    });
}

function prikazGaraze(garaza) {
    document.getElementById('naslovAdresa').textContent = garaza.objekat.adresa;
    document.getElementById('garaza-naziv').textContent =garaza.tip + ' ' + garaza.naziv;
    document.getElementById('garaza-kvadratura').innerHTML = `${garaza.kvadratura} m<sup>2</sup>`;
    document.getElementById('garaza-opis').innerHTML = garaza.opis.replace(/\n/g, '<br>');
    document.getElementById('pdfText').innerHTML = garaza.tip + ' ' + garaza.naziv + ' - ' + `${garaza.kvadratura} m<sup>2</sup>`
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
        url: `http://localhost:8080/garaza/downloadPdf/${id}`,
        method: 'GET',
        responseType: 'blob' // Važno je da se postavi 'blob' kako bi preuzeli fajl
    })
    .then(response => {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'garaza.pdf'); // ili dinamički dobijeno ime fajla
        document.body.appendChild(link);
        link.click();
        // Ukloniti link nakon klika
        link.remove();
    })
    .catch(error => {
        console.error('Došlo je do greške prilikom dohvaćanja podataka o garazi:', error);
    });
}