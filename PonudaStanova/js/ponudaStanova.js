function showDropdownFilter(event) {
    const dropdown = event.target.nextElementSibling; // Get the next sibling element, which is the dropdown content
    const span = event.currentTarget.querySelector('.dropdown-toggle');
    if (dropdown && dropdown.classList.contains('dropdown-content')) {
        dropdown.classList.toggle('show_filter');
        span.classList.toggle('highlight');
        console.log("done filter");
    }
}

