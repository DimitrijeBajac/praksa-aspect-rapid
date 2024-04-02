document.querySelector('.navbar_item.dropdown').addEventListener('click', showDropdown);


function showDropdown(){
    const dropdown = document.querySelector('.dropdown-content');
    if(dropdown){
        dropdown.classList.toggle('show');
    }
}