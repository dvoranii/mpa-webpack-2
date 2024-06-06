"use strict";
import "../styles/home.css";
import "../styles/modal.css";
import "../styles/messages.css";
import "../styles/loader.css";
import { initializeRecaptcha } from "./utils/recaptcha.js";
import { fetchCsrfToken } from "./utils/csrfUtils.js";
import { handleSubscriptionFormSubmit } from "./utils/formUtils.js";
import { addInputEventListeners } from "./utils/inputEventListeners.js";
import { validateForm, showSuccessMessage } from "./utils/validationUtils.js";
import { showLoader, hideLoader } from "./utils/loadingSpinner.js";
import { initializeBasicScroll } from "./utils/basicScroll.js";

document.addEventListener("DOMContentLoaded", async () => {
  initializeRecaptcha("recaptchaResponse");
  const form = document.querySelector(".newsletter-form");
  addInputEventListeners(form);
  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }

  initializeBasicScroll();
});

const modalBg = document.querySelector(".modal-bg");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".modal-close__btn");
const form = document.querySelector(".newsletter-form");
const subscribeBtn = document.querySelector(".modal-subscribe__btn");
const loader = document.querySelector(".loader");

setTimeout(() => {
  modalBg.classList.add("bg-active");
  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
}, 5000);

function closeModal() {
  modal.classList.remove("show");
  modalBg.classList.remove("bg-active");
}

closeBtn.addEventListener("pointerdown", closeModal);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) {
    return;
  }

  showLoader(loader, subscribeBtn);

  try {
    await handleSubscriptionFormSubmit(form);
    showSuccessMessage();
    form.reset();
    setTimeout(() => {
      modal.classList.remove("show");
      modalBg.classList.remove("bg-active");
    }, 3000);
  } catch (error) {
    console.error("Subscription error:", error);
  } finally {
    hideLoader(loader, subscribeBtn);
  }
});
