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
  // mount listeners for input events
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
    console.log("Form submitted successfully!");
  } catch (error) {
    console.error(`Error: ${error}`);
    showError(".error-message");
  } finally {
    loader.hide();
  }
});

function showError(selector) {
  const errorElement = document.querySelector(selector);
  if (!errorElement) {
    console.error(`Element not found for selector: ${selector}`);
    return;
  }
  errorElement.classList.remove("error-hidden");
}
