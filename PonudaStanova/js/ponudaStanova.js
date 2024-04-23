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
    const dropdown = event.target.nextElementSibling;
    if (dropdown && dropdown.classList.contains('dropdown-content')) {
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
    const dropdown = event.target.nextElementSibling; 
    if (dropdown && dropdown.classList.contains('dropdown-content')) {
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
        console.log("done");
    }


    const dropdownItems = dropdownContent.querySelectorAll('li');
    dropdownItems.forEach(function(item) {
        const selectedItemText = item.textContent.trim(); // Get the text content of the item

        // Create a span element for the text content
        const textSpan = document.createElement('span');
        textSpan.textContent = selectedItemText;

        // Create a span element for the close icon ("x")
        const closeIcon = document.createElement('span');
        closeIcon.textContent = 'x';
        closeIcon.classList.add('close-icon');

        // Append text span and close icon to the selected item
        const selectedItem = document.createElement('p');
        selectedItem.appendChild(textSpan);
        selectedItem.appendChild(closeIcon);

        // Add click event listener to the close icon to remove the selected item
        closeIcon.addEventListener('click', function() {
            selectedItem.parentElement.removeChild(selectedItem);
        });

         let isSelected = false; // Variable to track if the item is already selected
        item.addEventListener('click', function handleClick() {
            if (!isSelected) { // If the item is not already selected
                const selectedItemsContainer = document.getElementById('selectedItemsContainer');
                selectedItemsContainer.appendChild(selectedItem);
                dropdownContent.classList.remove('show');
                isSelected = true; // Mark the item as selected
            }
            // Remove the click event listener from the item after it has been clicked
            item.removeEventListener('click', handleClick);
        });

    });
}