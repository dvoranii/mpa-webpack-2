"use strict";

import { hideError, showError } from "./errorUtils.js";

// Configuration object mapping input field IDs to their respective validators and error message IDs
const inputValidationConfig = {
  name: {
    validators: [isNotEmpty],
    errorIds: ["#nameError"],
  },
  email: {
    validators: [isNotEmpty, isValidEmail],
    errorIds: ["#emailEmptyError", "#emailInvalidError"],
  },
  companyName: {
    validators: [isNotEmpty],
    errorIds: ["#companyError"],
  },
  phone: {
    validators: [isNotEmpty, isValidPhoneNumber],
    errorIds: ["#phoneErrorEmpty", "#phoneErrorInvalid"],
  },
  "pickup-address": {
    validators: [isNotEmpty],
    errorIds: ["#pickupAddressError"],
  },
  "shipping-address": {
    validators: [isNotEmpty],
    errorIds: ["#shippingAddressError"],
  },
  skids: {
    validators: [isNotEmpty, isNumberBetween(1, 20)],
    errorIds: ["#skidsError-1", "#skidsError-2"],
  },
  pieces: {
    validators: [isNotEmpty],
    errorIds: ["#piecesError"],
  },
  service: {
    validators: [isNotEmpty],
    errorIds: ["#serviceError"],
  },
  weight: {
    validators: [isNotEmpty],
    errorIds: ["#weightError"],
  },
  units: {
    validators: [isNotEmpty],
    errorIds: ["#unitsError"],
  },
  hazardous: {
    validators: [isNotEmpty],
    errorIds: ["#hazardousError"],
  },
  HSCode: {
    validators: [isNotEmpty],
    errorIds: ["#HSCodeError"],
  },
};

export function validateForm(form) {
  let isValid = true;

  // Validate each input based on the configuration object
  Object.keys(inputValidationConfig).forEach((id) => {
    const { validators, errorIds } = inputValidationConfig[id];
    const input = form.querySelector(`#${id}`);
    const value = input ? input.value.trim() : "";

    if (input) {
      validators.forEach((validator, index) => {
        const errorId = errorIds[index];

        if (validator(value)) {
          hideError(errorId);
        } else {
          showError(errorId);
          isValid = false;
        }
      });
    }
  });

  return isValid;
}

// Validator functions
function isNotEmpty(value) {
  return value !== "";
}

function isValidEmail(value) {
  if (!isNotEmpty(value)) {
    return true; // If empty, it should be handled by isNotEmpty
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isValidPhoneNumber(value) {
  if (!isNotEmpty(value)) {
    return true; // If empty, it should be handled by isNotEmpty
  }
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic regex for international phone numbers
  return phoneRegex.test(value);
}

function isNumberBetween(min, max) {
  return (value) => {
    if (!isNotEmpty(value)) {
      return true; // If empty, it should be handled by isNotEmpty
    }
    const number = parseInt(value, 10);
    return !isNaN(number) && number >= min && number <= max;
  };
}

export function showSuccessMessage() {
  const successMessage = document.querySelector("#successMessage");
  successMessage.classList.remove("success-hidden");

  setTimeout(() => {
    successMessage.classList.add("success-hidden");
  }, 3000);
}
