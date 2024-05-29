"use strict";
import "../styles/contact.css";
import "../styles/messages.css";
import "../styles/loader.css";
import { initializeRecaptcha } from "./utils/recaptcha.js";
import { handleContactFormSubmit } from "./utils/apiUtils.js";
import { showLoader, hideLoader } from "./utils/loadingSpinner.js";
import { validateForm, showSuccessMessage } from "./utils/validationUtils.js";
import { addInputEventListeners } from "./utils/inputEventListeners.js";
import { fetchCsrfToken } from "./utils/csrfUtils.js";

document.addEventListener("DOMContentLoaded", async () => {
  initializeRecaptcha();

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
const loader = document.querySelector(".loader");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) {
    return;
  }

  showLoader(loader, submitBtn);

  try {
    await handleContactFormSubmit(form);
    showSuccessMessage();
    form.reset();
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    hideLoader(loader, submitBtn);
  }
});
