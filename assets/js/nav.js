// Mobile navigation menu
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");

function setMenuOpen(isOpen) {
  toggle.setAttribute("aria-expanded", String(isOpen));
  menu.classList.toggle("open", isOpen);
}

// Open or close the menu when the button is pressed
toggle.addEventListener("click", () => {
  setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
});

// Close the menu once a link has been chosen
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

// Close the menu with the Escape key and return focus to the button
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    toggle.focus();
  }
});
