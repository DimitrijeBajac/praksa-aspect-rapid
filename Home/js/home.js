document.addEventListener('click', function(event) {
    const clickedElement = event.target;
    if (!clickedElement.closest('.dropdown') && !clickedElement.matches('.dropdown-content')) {
        closeAllDropdowns();
    }
});

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('show');
        dropdown.classList.remove('show_sidebar');
    });
}


function showDropdown(event) {
    const arrow = event.target.closest('.arrow-img'); // Check if the click is on the arrow image
    const dropdown = event.currentTarget.querySelector('.dropdown-content'); // Target the dropdown content
    if (dropdown) {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        } else {
            closeAllDropdowns();
            dropdown.classList.add('show');
        }
        console.log("done");
    }
}

function showDropdownSidebar(event) {
    const arrow = event.target.closest('.arrow-img');
    const dropdown = event.currentTarget.querySelector('.dropdown-content');
    if (dropdown) {
        if (dropdown.classList.contains('show_sidebar')) {
            dropdown.classList.remove('show_sidebar');
        } else {
            closeAllDropdowns();
            dropdown.classList.add('show_sidebar');
        }
        console.log("done");
    }
}

function showSidebar() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex'
}

function hideSidebar(){
    var sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none'
}

/*-------------animation---------------- */

document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll(".animate");
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    });
  
    sections.forEach(section => {
      observer.observe(section);
    });
  });




  //-------------------------------ucitavanje stanova---------------------------------

  window.onload = function() {
    dohvatiPodatkeStanova();
};

  function dohvatiPodatkeStanova() {
    axios.get('http://localhost:8080/stan/getAllDostupniStanovi')
        .then(response => {
            const data = response.data;
            console.log(data);
            dodajPodatkeUslajder(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
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


function dodajPodatkeUslajder(podaci) {
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
                            <img src="${trimmedPath}" alt="Slika stana">
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
        dots: false,
        infinite: false,
        arrows: true,
        speed: 300,
        slidesToShow: 2.2,
        slidesToScroll: 1,
        prevArrow: '<div class="custom-prev"><img src="Home/img/slider_arrow_right_black.png" alt=""></div>',
        nextArrow: '<div class="custom-next"><img src="Home/img/slider_arrow_right.png" alt=""></div>',
        responsive: [
            {
                breakpoint: 3000,
                settings: {
                 slidesToShow: 3,
                 slidesToScroll: 1,
                 infinite: false,
                 dots: false
                } 
            },
            {
                breakpoint: 2000,
                settings: {
                 slidesToShow: 2.2,
                 slidesToScroll: 1,
                 infinite: false,
                 dots: false
                } 
            },
            {
                breakpoint: 1350,
                settings: {
                 slidesToShow: 2,
                 slidesToScroll: 1,
                 infinite: false,
                 dots: false
                } 
            },
            {
                breakpoint: 1275,
                settings: {
                 slidesToShow: 1.5,
                 slidesToScroll: 1,
                 infinite: false,
                 dots: false
                } 
            },
            {
            breakpoint: 900,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
            },
            {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
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
]
});
}
