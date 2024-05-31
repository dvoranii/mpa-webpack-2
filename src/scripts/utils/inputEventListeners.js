"use strict";

import { hideError } from "./errorUtils.js";

const formConfig = {
  name: ["#nameError"],
  email: ["#emailEmptyError", "#emailInvalidError"],
  companyName: ["#companyError"],
  phone: ["#phoneError"],
  "pickup-address": ["#pickupAddressError"],
  "shipping-address": ["#shippingAddressError"],
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

  nameInput.addEventListener("input", () => {
    hideError("#nameError");
  });

  emailInput.addEventListener("input", () => {
    hideError("#emailEmptyError");
    hideError("#emailInvalidError");
  });
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
}
