"use strict";

import { hideError } from "./errorUtils.js";

const formConfig = {
  name: ["#nameError"],
  email: ["#emailEmptyError", "#emailInvalidError"],
  companyName: ["#companyError"],
  phone: ["#phoneError-1", "#phoneError-2"],
  pickupAddress: ["#pickupAddressError"],
  shippingAddress: ["#shippingAddressError"],
  skids: ["#skidsError-1", "#skidsError-2"],
  pieces: ["#piecesError"],
  service: ["#serviceError"],
  weight: ["#weightError"],
  units: ["#unitsError"],
  HSCode: ["#HSCodeError"],
  hazardous: ["#hazardousError"],
};

export function addInputEventListeners(form) {
  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      hideError("#nameError");
    });
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      hideError("#emailEmptyError");
      hideError("#emailInvalidError");
    });
  }
}

export function addQuoteInputEventListeners(form) {
  Object.keys(formConfig).forEach((id) => {
    const errorIds = formConfig[id];
    const input = form.querySelector(`#${id}`);

    if (input) {
      input.addEventListener("input", () => {
        errorIds.forEach((errorId) => {
          hideError(errorId);
        });
      });
      if (
        input.tagName.toLowerCase() === "select" ||
        input.type === "checkbox"
      ) {
        input.addEventListener("change", () => {
          errorIds.forEach((errorId) => {
            hideError(errorId);
          });
        });
      }
    }
  });

  addDynamicInputEventListeners(form);
}

export function addDynamicInputEventListeners(form) {
  const dynamicFields = form.querySelectorAll(
    ".form-group__grid--1 input, .form-group__grid--2 input, .form-group__grid--3 input, .form-group__grid--4 input"
  );

  dynamicFields.forEach((input) => {
    const errorId = `#${input.id}Error`;
    input.addEventListener("input", () => {
      hideError(errorId);
    });
  });
}
