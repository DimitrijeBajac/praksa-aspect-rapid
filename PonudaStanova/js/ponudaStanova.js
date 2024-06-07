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



function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
}

function showDropdownFilter(event) {
    const dropdownToggle = event.currentTarget.querySelector('.dropdown-toggle');
    const dropdownContent = event.currentTarget.querySelector('.dropdown-content');

    if (dropdownToggle && dropdownContent) {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        } else {
            closeAllDropdowns();
            dropdownContent.classList.add('show');
        }
    }

    initDropdownItems(dropdownContent);
}

function initDropdownItems(dropdownContent) {
    const dropdownItems = dropdownContent.querySelectorAll('li');
    dropdownItems.forEach(function(item) {
        item.removeEventListener('click', handleClick);
        item.addEventListener('click', handleClick);

        // For kvadratura checkboxes
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
            item.removeEventListener('click', handleCheckboxClick);
            item.addEventListener('click', handleCheckboxClick);
        }
    });
}

function handleClick(event) {
    const item = event.currentTarget;
    const category = item.dataset.category;
    const itemName = item.textContent.trim();

    if (category === 'kvadratura') {
        // Kvadratura handled separately
        return;
    }

    const selectedItem = document.querySelector(`.selected-item[data-category="${category}"]`);
    if (selectedItem) {
        selectedItem.remove();
    }
    const { selectedItem: newSelectedItem, closeIcon } = createSelectedItem(item);
    newSelectedItem.classList.add('selected-item');
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');
    selectedItemsContainer.appendChild(newSelectedItem);
    item.classList.add('selected');

    closeIcon.addEventListener('click', function() {
        item.classList.remove('selected');
        newSelectedItem.remove();
    });
}

function handleCheckboxClick(event) {
    if (event.target.tagName.toLowerCase() === 'input') {
        return;
    }

    const item = event.currentTarget;
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;

    handleCheckboxChange({ target: checkbox });
}

function handleCheckboxChange(event) {
    const checkbox = event.target;
    const item = checkbox.parentElement;
    const { selectedItem, closeIcon } = createSelectedItem(item);
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');

    if (checkbox.checked) {
        selectedItemsContainer.appendChild(selectedItem);
        item.classList.add('selected');
    } else {
        const selectedItemToRemove = selectedItemsContainer.querySelector(`[data-category="kvadratura"][data-value="${checkbox.value}"]`);
        if (selectedItemToRemove) {
            selectedItemToRemove.remove();
        }
        item.classList.remove('selected');
    }

    closeIcon.addEventListener('click', function() {
        item.classList.remove('selected');
        checkbox.checked = false;
        selectedItem.remove();
    });
}

function createSelectedItem(item) {
    const selectedItemText = item.textContent.trim();
    const category = item.dataset.category;
    const value = item.querySelector('input[type="checkbox"]')?.value;

    const textSpan = document.createElement('span');
    textSpan.textContent = selectedItemText;

    const closeIcon = document.createElement('span');
    closeIcon.textContent = 'X';
    closeIcon.classList.add('close-icon');

    const selectedItem = document.createElement('p');
    selectedItem.appendChild(textSpan);
    selectedItem.appendChild(closeIcon);
    selectedItem.dataset.category = category;
    if (value) {
        selectedItem.dataset.value = value;
    }

    return { selectedItem, closeIcon };
}



document.getElementById('applyFiltersButton').addEventListener('click', function() {
    const selectedItems = collectSelectedItems();
    sendSelectedItemsToBackend(selectedItems);
});
//------------------------------filter------------------------------------------
function collectSelectedItems() {
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');
    const selectedItems = selectedItemsContainer.querySelectorAll('p');
    const selectedItemsData = {
        objekat: [],
        sobnost: [],
        kvadratura: [],
        spratnost: []
    };

    selectedItems.forEach(item => {
        const category = item.dataset.category;
        const itemName = item.querySelector('span').textContent.trim();
        selectedItemsData[category].push(itemName);
    });

    console.log(selectedItemsData);
    return selectedItemsData;
    
}

// Funkcija za slanje odabranih stavki na backend
function sendSelectedItemsToBackend(selectedItems) {
    axios.post('http://localhost:8080/stan/filter', selectedItems)
        .then(response => {
            console.log('Podaci uspešno poslati:', response.data);
            prikaziFiltriraneStanove(response.data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom slanja podataka:', error);
        });
}

// Funkcija za prikazivanje filtriranih stanova
function prikaziFiltriraneStanove(data) {
    // Prvo uklonite sve postojeće karte stanova
    const cardsContainer = document.getElementById('cards_container');
    cardsContainer.innerHTML = '';

    // Zatim prikažite nove karte filtriranih stanova
    prikazStanova(data);
}


// Get the close button and the popup
const closeButton = document.getElementById('closeButton');
const popup = document.getElementById('popup');

// Add click event listener to the close button
closeButton.addEventListener('click', function() {
    popup.style.display = 'none'; // Hide the popup when the close button is clicked
});

// Get the share link
const shareLink = document.getElementById('shareLink');

// Add click event listener to the share link
shareLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default behavior of the link
    popup.style.display = 'block'; // Show the popup
});


// Get the copy button
const copyButton = document.getElementById('copyButton');

// Add click event listener to the copy button
copyButton.addEventListener('click', function(event) {
    // Get the text content from the page link paragraph
    const pageLinkText = document.querySelector('.page_link p').textContent;
    
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = pageLinkText;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the textarea element
    document.body.removeChild(textarea);
    
    // Create a tooltip element
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Link copied!';
    tooltip.classList.add('tooltip');
    tooltip.style.top = `${event.clientY}px`;
    tooltip.style.left = `${event.clientX}px`;
    document.body.appendChild(tooltip);
    
    // Remove the tooltip after a short delay
    setTimeout(function() {
        document.body.removeChild(tooltip);
    }, 300); // Adjust the delay as needed
});


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




//--------------------------------------------------------svi dostupni stanovi---------------------------------------------------

window.onload = function() {
    dohvatiPodatkeStanova();
    dohvatiSveObjekte();
};

  function dohvatiPodatkeStanova() {
    axios.get('http://localhost:8080/stan/getAllDostupniStanovi')
        .then(response => {
            const data = response.data;
            console.log(data);
            prikazStanova(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
        });
}

function dohvatiSveObjekte() {
    axios.get('http://localhost:8080/dashboard/getObjekti')
        .then(response => {
            const data = response.data;
            console.log(data);
            prikaziObjekteUFilteru(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
        });
}

function prikaziObjekteUFilteru(objekti) {
    const filterObjekti = document.getElementById('filterObjekti');
    filterObjekti.innerHTML = ''; // Clear existing list

    objekti.forEach(objekat => {
        const li = document.createElement('li');
        li.textContent = objekat.naziv; // Assuming "naziv" is the property containing object name
        li.dataset.category = "objekat";
        filterObjekti.appendChild(li);
    });
}


function prikazStanova(podaci) {
    const cardsContainer = document.getElementById('cards_container');
    
    // Iteracija kroz podatke i kreiranje kartica za svaki stan
    podaci.forEach(stan => {

        const originalPath = stan.renderPutanja;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos"));

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('grid_container');

        const sobnostName = getSobnostName(stan.sobnost);

        cardDiv.innerHTML = `
            <div class="card_left_side">
                <img src="${'../' + trimmedPath}" alt="Slika stana">
            </div>
            <div class="card_right_side">
                <h2>${sobnostName} stan</h2>
                <div class="kvadratura">
                    <p>${stan.kvadratura}<span class="superscript">m<sup>2</sup></span></p>
                </div>
                <p>${stan.objekat.adresa}</p>
                <a href="../Stan/stan.html?id=${stan.id}" class="btn btn_slider">Pogledajte više</a>
                <div class="footer_slider">
                    <p>${stan.objekat.naziv}</p>
                </div>
            </div>
        `;

        cardsContainer.appendChild(cardDiv);
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

//--------------------------------------dugme za filter---------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');
    const applyFiltersButton = document.getElementById('applyFiltersButton');

    // Sakrij dugme kada je container prazan
    if (selectedItemsContainer.children.length === 1) {
        applyFiltersButton.style.display = 'none';
    }

    function showApplyFiltersButton() {
        // Prikazi dugme kada se nesto doda u container
        if (selectedItemsContainer.children.length > 1) {
            applyFiltersButton.style.display = 'block';
        }
    }

    // Funkcija koja osluškuje promene u selectedItemsContainer
    const observer = new MutationObserver(() => {
        showApplyFiltersButton();
    });

    // Konfigurišemo observer da osluškuje promene u selectedItemsContainer
    const config = { childList: true };

    // Počni osluškivanje
    observer.observe(selectedItemsContainer, config);
});





