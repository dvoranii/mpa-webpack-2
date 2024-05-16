"use strict";

import "../styles/contact.css";
import { loadScript } from "./utils/domUtils.js";
import { initializeRecaptchaToken, handleSubmit } from "./utils/apiUtils.js";
import { LoadingSpinner } from "./Components/LoadingSpinner.js";
import { validateForm } from "./utils/validationUtils.js";
import { addInputEventListeners } from "./utils/inputEventListeners.js";

document.addEventListener("DOMContentLoaded", () => {
  loadScript(
    "https://www.google.com/recaptcha/api.js?render=6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1",
    initializeRecaptchaToken
  );

  const form = document.querySelector(".contact-form");
  // mount listeners for input events, will need refactoring when new form is created
  addInputEventListeners(form);
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
    await handleSubmit(form);
    showSuccessMessage();
    form.reset();
  } catch (error) {
    showError(".error-message");
  } finally {
    loader.hide();
  }
});

function showError(selector) {
  const errorElement = document.querySelector(selector);
  if (!errorElement) {
    return;
  }
  errorElement.classList.remove("error-hidden");
}

function showSuccessMessage() {
  const successMessage = document.querySelector("#successMessage");
  successMessage.classList.remove("success-hidden");

  setTimeout(() => {
    successMessage.classList.add("success-hidden");
  }, 3000);
}
