"use strict";

import "../styles/global.css";
import { createNav, setupNav } from "./Components/global/nav.js";

document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", createNav());
  setupNav();
});
