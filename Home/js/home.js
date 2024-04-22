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