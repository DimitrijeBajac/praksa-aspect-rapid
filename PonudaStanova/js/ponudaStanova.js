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



