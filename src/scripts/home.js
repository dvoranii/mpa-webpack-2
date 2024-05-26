"use strict";
import "../styles/home.css";
import "../styles/modal.css";
import { fetchCsrfToken } from "./utils/csrfUtils.js";
import { handleSubscriptionFormSubmit } from "./utils/apiUtils.js";
import { addInputEventListeners } from "./utils/inputEventListeners.js";
import { validateForm } from "./utils/validationUtils.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchCsrfToken();
    console.log("CSRF token successfully fetched and stored");
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }

  const form = document.querySelector(".newsletter-form");
  addInputEventListeners(form);
});

const modalBg = document.querySelector(".modal-bg");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".modal-close__btn");
const form = document.querySelector(".newsletter-form");

setTimeout(() => {
  modalBg.classList.add("bg-active");
  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
}, 5000);

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  modalBg.classList.remove("bg-active");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) {
    return;
  }

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
    alert("Failed to subscribe. Please try again later.");
  }
});

function showSuccessMessage() {
  const successMessage = document.querySelector("#successMessage");
  successMessage.classList.remove("success-hidden");

  setTimeout(() => {
    successMessage.classList.add("success-hidden");
  }, 3000);
}
