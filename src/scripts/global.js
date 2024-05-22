"use strict";

import "../styles/global.css";
import { createNav, setupNav } from "./Components/global/nav.js";
import { createFooter } from "./Components/global/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("page-404")) {
    document.body.insertAdjacentHTML("afterbegin", createNav());
    document.body.insertAdjacentHTML("beforeend", createFooter());
    setupNav();
  }
});
