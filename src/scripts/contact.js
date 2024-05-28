"use strict";

import "../styles/contact.css";
import "../styles/messages.css";
import { loadScript } from "./utils/domUtils.js";
import {
  initializeRecaptchaToken,
  handleContactFormSubmit,
} from "./utils/apiUtils.js";
import { showLoader, hideLoader } from "./utils/loadingSpinner.js";
import { validateForm, showSuccessMessage } from "./utils/validationUtils.js";
import { addInputEventListeners } from "./utils/inputEventListeners.js";
import { fetchCsrfToken } from "./utils/csrfUtils.js";

document.addEventListener("DOMContentLoaded", async () => {
  loadScript(
    "https://www.google.com/recaptcha/api.js?render=6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1",
    initializeRecaptchaToken
  );

  const form = document.querySelector(".contact-form");
  addInputEventListeners(form);

  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }
});

const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector(".contact-form");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) {
    return;
  }

  showLoader(".loader", ".submit-btn");

  try {
    await handleContactFormSubmit(form);
    showSuccessMessage();
    form.reset();
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    hideLoader(".loader", ".submit-btn");
  }
});
