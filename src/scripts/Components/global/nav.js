import "../../../styles/nav.css";

export function createNav() {
  return `
      <nav class="main-nav navbar">
      <div class="wrapper">
      <div class="logo-wrapper">
        <img src="../../assets/images/cgl-logo-no-text.png">
      </div>
      <div class="backdrop">
      <img src="../../assets/images/nav-banner.svg">
      </div>
        <div class="burger-menu" id="burgerMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul class="nav-links" id="navLinks">
          <li><a href="/">Home</a></li>
          <li class="dropdown">
            <a href="#">Services<span class="nav-triangle">▾</span></a>
            <ul class="dropdown-content">
              <li><a href="/service1">•&nbsp;Transportation<span class="nav-triangle">▾</span></a></li>
              <li><a href="/service2">•&nbsp;Sporting Goods</a></li>
            </ul>
          </li>
          <li><a href="/about">About</a></li>
          <li><a href="/quote">Quote</a></li>
          <li>
          <a href="/contact">Contact</a>
          </li>
        </ul>
        </div>
      </nav>

    `;
}

export function setupNav() {
  const burgerMenu = document.getElementById("burgerMenu");
  const navLinks = document.getElementById("navLinks");

  burgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    burgerMenu.classList.toggle("active");
  });

  const dropdowns = document.querySelectorAll(".dropdown");

  const toggleDropdown = (e) => {
    e.preventDefault();
    if (window.innerWidth <= 768) {
      const dropdownContent =
        e.currentTarget.querySelector(".dropdown-content");
      dropdownContent.classList.toggle("active");
    }
  };

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", toggleDropdown);
    dropdown.addEventListener("touchstart", toggleDropdown);
  });

  const submenuLinks = document.querySelectorAll(".dropdown-content a");
  submenuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      window.location.href = link.href;
    });
    link.addEventListener("touchstart", (e) => {
      window.location.href = link.href;
    });
  });

  highlightCurrentPage();
}

function highlightCurrentPage() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("current-page");
      const parentDropdown = link.closest(".dropdown-content");
      if (parentDropdown) {
        parentDropdown.previousElementSibling.classList.add("current-page");
      }
    }
  });
}
