"use strict";

export function validateForm(form) {
  let isValid = true;

  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();

  if (!name) {
    showError("#nameError");
    isValid = false;
  } else {
    hideError("#nameError");
  }

  if (!email) {
    showError("#emailEmptyError");
    hideError("#emailInvalidError");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("#emailInvalidError");
    hideError("#emailEmptyError");
    isValid = false;
  } else {
    hideError("#emailEmptyError");
    hideError("#emailInvalidError");
  }

  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(selector) {
  const errorElement = document.querySelector(selector);
  if (!errorElement) {
    console.error(`Element not found for selector: ${selector}`);
    return;
  }
  errorElement.classList.remove("error-hidden");
}

function hideError(selector) {
  const errorElement = document.querySelector(selector);
  if (!errorElement) {
    console.error(`Element not found for selector: ${selector}`);
    return;
  }
  errorElement.classList.add("error-hidden");
}

export function showSuccessMessage() {
  const successMessage = document.querySelector("#successMessage");
  successMessage.classList.remove("success-hidden");

  setTimeout(() => {
    successMessage.classList.add("success-hidden");
  }, 3000);
}
