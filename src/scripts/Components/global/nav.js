import "../../../styles/nav.css";
import { html, render } from "lit-html";

export function createNav() {
  let navContainer = document.getElementById("nav-container");
  let navHtml = html`
    <nav class="main-nav navbar">
      <div class="wrapper">
        <div class="logo-wrapper">
          <img
            src="../../assets/images/nav-logo-optimized(2).webp"
            alt="nav CGL Logo"
          />
        </div>
        <div class="backdrop">
          <img
            src="../../assets/images/nav-banner.svg"
            alt="nav background image"
          />
        </div>
        <div class="burger-menu" id="burgerMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul class="nav-links" id="navLinks">
          <li><a href="/">Home</a></li>
          <li class="dropdown">
            <a href="#" class="services-link"
              >Services<span class="nav-triangle">▾</span></a
            >
            <ul class="dropdown-content">
              <li class="dropdown-secondary">
                <a href="#" class="transportation-link"
                  >Transportation<span class="nav-triangle">▾</span></a
                >
                <ul class="dropdown-secondary-content">
                  <li><a href="/air">Air</a></li>
                  <li><a href="/ocean">Ocean</a></li>
                  <li><a href="/truck">Truck</a></li>
                  <li><a href="/warehouse">Warehouse</a></li>
                </ul>
              </li>
              <li><a href="/special-handling">Special Handling</a></li>
              <li><a href="/sporting-goods">Sporting Goods</a></li>
            </ul>
          </li>
          <li><a href="/about">About</a></li>
          <li><a href="/quote">Quote</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  `;

  return render(navHtml, navContainer);
}

export function setupNav() {
  const burgerMenu = document.getElementById("burgerMenu");
  const navLinks = document.getElementById("navLinks");

  burgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    burgerMenu.classList.toggle("active");
  });

  const dropdowns = document.querySelectorAll(".dropdown");
  const secondaryDropdowns = document.querySelectorAll(".dropdown-secondary");

  // need to fix this for mobile since we last updated it
  const toggleDropdown = (e) => {
    e.preventDefault();
    if (window.innerWidth <= 1366) {
      const dropdownContent =
        e.currentTarget.querySelector(".dropdown-content");
      dropdownContent.classList.toggle("active");
    }
  };
  const toggleSecondaryDropdown = (e) => {
    e.preventDefault();
    if (window.innerWidth <= 1366) {
      const dropdownSecondaryContent = e.currentTarget.querySelector(
        ".dropdown-secondary-content"
      );
      dropdownSecondaryContent.classList.toggle("active");
    }
  };

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", toggleDropdown);
    dropdown.addEventListener("touchstart", toggleDropdown);
  });
  secondaryDropdowns.forEach((dropdownSecondary) => {
    dropdownSecondary.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent the primary dropdown from closing
      toggleSecondaryDropdown(e);
    });
    dropdownSecondary.addEventListener("touchstart", (e) => {
      e.stopPropagation(); // Prevent the primary dropdown from closing
      toggleSecondaryDropdown(e);
    });
  });

  const submenuLinks = document.querySelectorAll(".dropdown-content a");
  submenuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = link.href;
    });
    link.addEventListener("touchstart", (e) => {
      window.location.href = link.href;
    });
  });

  highlightCurrentPage();
  window.addEventListener("resize", handleResize);
}

function handleResize() {
  if (window.innerWidth > 1366) {
    const dropdownContents = document.querySelectorAll(".dropdown-content");
    const secondaryDropdownContents = document.querySelectorAll(
      ".dropdown-secondary-content"
    );

    dropdownContents.forEach((content) => {
      content.classList.remove("active");
    });

    secondaryDropdownContents.forEach((content) => {
      content.classList.remove("active");
    });
  }
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
