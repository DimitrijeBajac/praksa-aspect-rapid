window.onload = function() {
    dohvatiPodatkeStanova();
    dohvatiSveObjekte();
};

  function dohvatiPodatkeStanova() {
    axios.get('http://localhost:8080/garaza/getAllGaraze')
        .then(response => {
            const data = response.data;
            console.log(data);
            prikazGaraza(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
        });
}

function prikazGaraza(podaci) {
    const cardsContainer = document.getElementById('cards_container');

    // Iteracija kroz podatke i kreiranje kartica za svaku garažu
    podaci.forEach(garaza => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('grid_container');

        let slikaSrc = '';
        if (garaza.tip === 'Garaža') {
            slikaSrc = 'img/garaza_card_1.png'; // Putanja do slike za garažu
        } else if (garaza.tip === 'Garažno mesto') {
            slikaSrc = 'img/garaza_card_2.png'; // Putanja do slike za garažno mesto
        } else if (garaza.tip === 'Parking mesto') {
            slikaSrc = 'img/garaza_card_3.png'; // Putanja do slike za parking mesto
        }

        cardDiv.innerHTML = `
            <div class="card_left_side smaller card_bg_1">
                <img src="${slikaSrc}" alt="Slika garaže">
            </div>
            <div class="card_right_side">
                <h2>${garaza.tip} ${garaza.naziv}</h2>
                <div class="kvadratura">
                    <p>${garaza.kvadratura}<span class="superscript">m<sup>2</sup></span></p>
                </div>
                <p>${garaza.objekat.adresa}</p>
                <a href="../Garaza/garaza.html?id=${garaza.id}" class="btn btn_slider">Pogledajte više</a>
            </div>
        `;

        cardsContainer.appendChild(cardDiv);
    });
}


//------------------------------prikaz objekata u dropdownu-----------------------------------------

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


//----------------------------------------filteri-------------------------------------------------------------

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

        // For items that require single selection
        if (item.dataset.category === 'tip') {
            item.removeEventListener('click', handleSingleSelect);
            item.addEventListener('click', handleSingleSelect);
        }
    });
}

function handleClick(event) {
    const item = event.currentTarget;
    const category = item.dataset.category;
    const itemName = item.textContent.trim();

    if (category === 'kvadratura' || category === 'ponuda') {
        // Kvadratura and ponuda handled separately
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

function handleSingleSelect(event) {
    const item = event.currentTarget;
    const category = item.dataset.category;
    const itemName = item.textContent.trim();

    const previouslySelectedItem = document.querySelector(`.filter_li li.selected[data-category="${category}"]`);
    if (previouslySelectedItem) {
        previouslySelectedItem.classList.remove('selected');
    }

    const selectedItemElement = document.querySelector(`.selected-item[data-category="${category}"]`);
    if (selectedItemElement) {
        selectedItemElement.remove();
    }

    const { selectedItem, closeIcon } = createSelectedItem(item);
    selectedItem.classList.add('selected-item');
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');
    selectedItemsContainer.appendChild(selectedItem);
    item.classList.add('selected');

    closeIcon.addEventListener('click', function() {
        item.classList.remove('selected');
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

//-----------------------------slanje filtera na backend--------------------------

document.getElementById('applyFiltersButton').addEventListener('click', function() {
    const selectedItems = collectSelectedItems();
    sendSelectedItemsToBackend(selectedItems);
});
function collectSelectedItems() {
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');
    const selectedItems = selectedItemsContainer.querySelectorAll('p');
    const selectedItemsData = {
        objekat: [],
        tip: [],
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
    axios.post('http://localhost:8080/garaza/filter', selectedItems)
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
    prikazGaraza(data);
}