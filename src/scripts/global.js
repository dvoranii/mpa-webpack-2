"use strict";

import "../styles/global.css";
import { createNav, setupNav } from "./Components/global/nav.js";
import { createFooter } from "./Components/global/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", createNav());
  document.body.insertAdjacentHTML("beforeend", createFooter());
  setupNav();
});
