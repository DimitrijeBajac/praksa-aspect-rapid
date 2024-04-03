document.querySelector('.navbar_item.dropdown a').addEventListener('click', showDropdown);


function showDropdown(){
    const dropdown = document.querySelector('.dropdown-content');
    if(dropdown){
        dropdown.classList.toggle('show');
        console.log("done");
    }
}