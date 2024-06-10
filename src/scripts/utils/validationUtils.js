"use strict";

import { hideError, showError } from "./errorUtils.js";

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
    errorIds: ["#phoneError-1", "#phoneError-2"],
  },
  pickupAddress: {
    validators: [isNotEmpty],
    errorIds: ["#pickupAddressError"],
  },
  shippingAddress: {
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

export function validateDynamicFields(form) {
  let areDynamicFieldsValid = true;
  const dynamicInputs = form.querySelectorAll(
    ".form-group__grid--1 input, .form-group__grid--2 input, .form-group__grid--3 input, .form-group__grid--4 input"
  );

  dynamicInputs.forEach((input) => {
    const value = input.value.trim();
    const errorId = `#${input.id}Error`;
    const errorElement = document.querySelector(errorId);

    if (isNotEmpty(value)) {
      if (errorElement) {
        errorElement.classList.add("error-hidden");
      }
    } else {
      if (errorElement) {
        errorElement.classList.remove("error-hidden");
      }
      areDynamicFieldsValid = false;
    }
  });

  return areDynamicFieldsValid;
}

function isNotEmpty(value) {
  return value !== "";
}

function isValidEmail(value) {
  if (!isNotEmpty(value)) {
    return true;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isValidPhoneNumber(value) {
  if (!isNotEmpty(value)) {
    return true;
  }
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(value);
}

function isNumberBetween(min, max) {
  return (value) => {
    if (!isNotEmpty(value)) {
      return true;
    }
    const number = parseInt(value, 10);
    return !isNaN(number) && number >= min && number <= max;
  };
}
