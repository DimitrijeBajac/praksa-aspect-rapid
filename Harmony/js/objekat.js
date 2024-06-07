window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const objekatId = urlParams.get('id');
    if (objekatId) {
        dohvatiPodatkeObjekta(objekatId);
        dohvatiSlikeObjekata();
    }
};

  function dohvatiPodatkeObjekta(objekatId) {
    axios.get(`http://localhost:8080/dashboard/objekatInfo/${objekatId}`)
        .then(response => {
            const data = response.data;
            console.log(data);
            prikaziObjekat(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o objektima:', error);
        });
}


function prikaziObjekat(objekat){
    document.getElementById("objekat_naziv").textContent = objekat.naziv;
    document.getElementById("objekat_mesto").textContent = objekat.mesto;
    document.getElementById("tekst1").innerHTML = objekat.tekst1.replace(/\n/g, '<br>');
    document.getElementById("tekst2").innerHTML = objekat.tekst2.replace(/\n/g, '<br>');
}



function dohvatiSlikeObjekata() {
    axios.get('http://localhost:8080/dashboard/getExistingImages', {
        params: {
            tip: 'objekat'
        }
    })
    .then(response => {
        const imageUrls = response.data;
        console.log('Lista URL-ova objekata:', imageUrls);
        // Ovdje možete manipulisati listom URL-ova slika kako vam odgovara
        prikazSlikaZaSlider(imageUrls);
    })
    .catch(error => {
        console.error('Greška prilikom dohvatanja slika:', error);
    });
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
        image.alt = 'Slika objekta';
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
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 3,
            prevArrow: '<div class="custom-prev-stan"><img src="../Stan/img/arrow_left.png" alt=""></div>',
            nextArrow: '<div class="custom-next-stan"><img src="../Stan/img/arrow_right.png" alt=""></div>',
            responsive: [
                {
                    breakpoint: 3024,
                    settings: {
                    slidesToShow: 4,
                    slidesToScroll: 3,
                    infinite: false,
                    dots: true
                    } 
                },
                {
                    breakpoint: 2194,
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
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
                },
                {
                breakpoint: 480,
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