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
    const arrow = event.target.closest('.arrow-img'); // Check if the click is on the arrow image
    const dropdown = event.currentTarget.querySelector('.dropdown-content'); // Target the dropdown content
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