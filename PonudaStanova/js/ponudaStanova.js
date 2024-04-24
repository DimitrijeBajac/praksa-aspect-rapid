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
        const selectedItemText = item.textContent.trim();

        const textSpan = document.createElement('span');
        textSpan.textContent = selectedItemText;

        const closeIcon = document.createElement('span');
        closeIcon.textContent = 'X';
        closeIcon.classList.add('close-icon');

        const selectedItem = document.createElement('p');
        selectedItem.appendChild(textSpan);
        selectedItem.appendChild(closeIcon);

        closeIcon.addEventListener('click', function() {
            const selectedItemText = selectedItem.textContent.trim();
            selectedItem.parentElement.removeChild(selectedItem);
            const itemToRemoveSelectedClass = document.querySelector('.filter_li li.selected');
            if (itemToRemoveSelectedClass && itemToRemoveSelectedClass.textContent.trim() === selectedItemText) {
                itemToRemoveSelectedClass.classList.remove('selected');
            }
        });

         let isSelected = false;
         item.addEventListener('click', function handleClick() {
            const itemName = item.textContent.trim();
            if (!isItemSelected(itemName)) { 
                const selectedItemsContainer = document.getElementById('selectedItemsContainer');
                selectedItemsContainer.appendChild(selectedItem);
                dropdownContent.classList.remove('show');
                isSelected = true; 
                item.classList.add('selected'); 

                closeIcon.addEventListener('click', function() {
                    item.classList.remove('selected');
                });
            }
            item.removeEventListener('click', handleClick);
        });

        function isItemSelected(name) {
            const selectedItems = document.querySelectorAll('.selected');
            for (const selectedItem of selectedItems) {
                if (selectedItem.textContent.trim() === name) {
                    return true; 
                }
            }
            return false;
        }

    });
}