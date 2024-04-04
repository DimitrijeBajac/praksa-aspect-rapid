function showDropdown(event) {
    const dropdown = event.target.nextElementSibling; // Get the next sibling element, which is the dropdown content
    if (dropdown && dropdown.classList.contains('dropdown-content')) {
        dropdown.classList.toggle('show');
        console.log("done");
    }
}