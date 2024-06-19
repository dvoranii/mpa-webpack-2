"use strict";

import "../styles/global.css";
import { createNav, setupNav } from "./Components/global/nav.js";
import { createFooter } from "./Components/global/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("page-404")) {
    const navContainer = document.createElement("div");
    navContainer.id = "nav-container";
    document.body.insertAdjacentElement("afterbegin", navContainer);

    createNav();
    setupNav();

    const footerContainer = document.createElement("div");
    footerContainer.id = "footer-container";
    document.body.insertAdjacentElement("beforeend", footerContainer);

    createFooter();
  }
});
