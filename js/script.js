// Get the elements
const menu = document.getElementById('menu');
const menuToggle = document.querySelector('.menu-toggle');
const closeMenu = document.querySelector('.close-menu');

// Event listener to open the menu
menuToggle.addEventListener('click', function() {
    menu.classList.add('open'); // Adds the "open" class to show the menu
});

// Event listener to close the menu
closeMenu.addEventListener('click', function() {
    menu.classList.remove('open'); // Removes the "open" class to hide the menu
});
