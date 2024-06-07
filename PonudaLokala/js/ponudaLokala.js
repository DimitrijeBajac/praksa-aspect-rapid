window.onload = function() {
    dohvatiPodatkeStanova();
    dohvatiSveObjekte();
};

  function dohvatiPodatkeStanova() {
    axios.get('http://localhost:8080/lokal/getAllLokali')
        .then(response => {
            const data = response.data;
            console.log(data);
            prikazLokala(data);
        })
        .catch(error => {
            console.error('Došlo je do greške prilikom dohvaćanja podataka o stanovima:', error);
        });
}


function prikazLokala(podaci) {
    const cardsContainer = document.getElementById('cards_container');

    // Iteracija kroz podatke i kreiranje kartica za svaki lokal
    podaci.forEach(lokal => {
        const originalPath = lokal.naslovnaSlka;
        const trimmedPath = originalPath.substring(originalPath.lastIndexOf("SavedPhotos"));
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('grid_container');

        // Određivanje naslovne klase kartice na osnovu atributa prodaja i izdavanje
        let headerClass = 'header_card';
        if (lokal.prodaja && !lokal.izdavanje) {
            headerClass += '';
        } else if (!lokal.prodaja && lokal.izdavanje) {
            headerClass += ' orange';
        } else {
            headerClass += ' mix';
        }

        cardDiv.innerHTML = `
            <div class="card_left_side smaller">
                <img src="${'../' + trimmedPath}" alt="">
            </div>
            <div class="card_right_side">
                <div class="${headerClass}">
                <span>${lokal.prodaja ? 'PRODAJA' : ''}${lokal.prodaja && lokal.izdavanje ? '/' : ''}${lokal.izdavanje ? 'IZDAVANJE' : ''}</span>
                </div>
                <h2>Poslovni prostor<br>
                visoko prizemlje</h2>
                <div class="kvadratura">
                    <p>${lokal.kvadratura}<span class="superscript">m<sup>2</sup></span></p>
                </div>
                <p>${lokal.objekat.adresa}</p>
                <a href="../Lokal/lokal.html?id=${lokal.id}" class="btn btn_slider">Pogledajte više</a>
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


//-------------------------------------filteri------------------------------------------------------


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

        // For ponuda and kvadratura checkboxes
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

    if (category === 'kvadratura' || category === 'prodaja' || category === 'izdavanje') {
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
        // Remove any existing item with the same value and category
        const existingItem = selectedItemsContainer.querySelector(`[data-category="${item.dataset.category}"][data-value="${checkbox.value}"]`);
        if (existingItem) {
            existingItem.remove();
        }

        selectedItemsContainer.appendChild(selectedItem);
        item.classList.add('selected');
    } else {
        const selectedItemToRemove = selectedItemsContainer.querySelector(`[data-category="${item.dataset.category}"][data-value="${checkbox.value}"]`);
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

//-----------------------------slanje filtera na backend--------------------------

document.getElementById('applyFiltersButton').addEventListener('click', function() {
    const selectedItems = collectSelectedItems();
    sendSelectedItemsToBackend(selectedItems);
});
function collectSelectedItems() {
    const selectedItemsContainer = document.getElementById('selectedItemsContainer');
    const selectedItems = selectedItemsContainer.querySelectorAll('p');
    const selectedItemsData = {
        prodaja: [],
        izdavanje: [],
        kvadratura: [],
        objekat: []
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
    axios.post('http://localhost:8080/lokal/filter', selectedItems)
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
    prikazLokala(data);
}