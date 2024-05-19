import "../../../styles/nav.css";

export function createNav() {
  return `
      <nav class="main-nav">
        <div class="burger-menu" id="burgerMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul class="nav-links" id="navLinks">
          <li><a href="/home">Home</a></li>
          <li class="dropdown">
            <a href="#">Services</a>
            <ul class="dropdown-content">
              <li><a href="/service1">Service 1</a></li>
              <li><a href="/service2">Service 2</a></li>
            </ul>
          </li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    `;
}

export function setupNav() {
  const burgerMenu = document.getElementById("burgerMenu");
  const navLinks = document.getElementById("navLinks");

  burgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        const dropdownContent = dropdown.querySelector(".dropdown-content");
        dropdownContent.classList.toggle("active");
      }
    });
  });
}
