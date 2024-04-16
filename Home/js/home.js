function showDropdown(event) {
    const dropdown = event.target.nextElementSibling; // Get the next sibling element, which is the dropdown content
    if (dropdown && dropdown.classList.contains('dropdown-content')) {
        dropdown.classList.toggle('show');
        console.log("done");
    }
}

function showDropdownSidebar(event) {
    const dropdown = event.target.nextElementSibling; // Get the next sibling element, which is the dropdown content
    if (dropdown && dropdown.classList.contains('dropdown-content')) {
        dropdown.classList.toggle('show_sidebar');
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