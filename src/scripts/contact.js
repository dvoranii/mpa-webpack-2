"use strict";

import "../styles/contact.css";
import { loadScript } from "./utils/domUtils.js";
import { initializeRecaptchaToken, handleSubmit } from "./utils/apiUtils.js";
import { LoadingSpinner } from "./Components/LoadingSpinner.js";
import { validateForm } from "./utils/validationUtils.js";
import { addInputEventListeners } from "./utils/inputEventListeners.js";
import {
  fetchCsrfToken,
  getCsrfToken,
  appendCsrfToken,
} from "./utils/csrfUtils.js";
import { sanitizeFormInputs } from "./utils/sanitizeUtils.js";

document.addEventListener("DOMContentLoaded", async () => {
  loadScript(
    "https://www.google.com/recaptcha/api.js?render=6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1",
    initializeRecaptchaToken
  );

  const form = document.querySelector(".contact-form");
  addInputEventListeners(form);

  try {
    await fetchCsrfToken();
    console.log("CSRF token successfully fetched and stored");
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }
});

const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector(".contact-form");
const loader = new LoadingSpinner(".loader", ".submit-btn");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) {
    return;
  }

  loader.show();

  try {
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
      throw new Error("CSRF token not available");
    }

    appendCsrfToken(form, csrfToken);

    const sanitizedData = sanitizeFormInputs(form);
    const sanitizedFormData = new FormData();

    for (const key in sanitizedData) {
      sanitizedFormData.append(key, sanitizedData[key]);
    }

    await handleSubmit(form);
    showSuccessMessage();
    form.reset();
  } catch (error) {
    console.error("Form submission error:", error);
    alert("Failed to submit the form. Please try again later.");
  } finally {
    loader.hide();
  }
});

function showSuccessMessage() {
  const successMessage = document.querySelector("#successMessage");
  successMessage.classList.remove("success-hidden");

  setTimeout(() => {
    successMessage.classList.add("success-hidden");
  }, 3000);
}
