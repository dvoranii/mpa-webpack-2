import "../styles/quote.css";
import "../styles/messages.css";
import "../styles/loader.css";
import { html, render } from "lit-html";
import {
  initializeRecaptcha,
  stopRecaptchaTokenRefresh,
} from "./utils/recaptcha.js";
import { fetchCsrfToken } from "./utils/csrfUtils.js";
import {
  addQuoteInputEventListeners,
  addDynamicInputEventListeners,
} from "./utils/inputEventListeners.js";
import { handleQuoteFormSubmit } from "./utils/formUtils.js";
import {
  validateForm,
  validateDynamicFields,
} from "./utils/validationUtils.js";
import { showLoader, hideLoader } from "./utils/loadingSpinner.js";
import { showSuccessMessage } from "./utils/errorUtils.js";

const clearBtn = document.querySelector(".clear-btn");
const form = document.querySelector(".quote-form");
const submitBtn = document.querySelector(".submit-btn");
const loader = document.querySelector(".loader");

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.reset();
});

document.addEventListener("DOMContentLoaded", async () => {
  initializeRecaptcha("recaptchaResponse");
  renderRows();
  addQuoteInputEventListeners(form);
  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }
});

window.addEventListener("beforeunload", () => {
  stopRecaptchaTokenRefresh();
});

const renderRows = () => {
  const skidsInput = document.querySelector("#skids");
  const container = document.querySelector(".dynamic-rows-content");

  skidsInput.addEventListener("input", (e) => {
    const value = parseInt(skidsInput.value, 10);
    if (isNaN(value) || value < 1 || value > 20) {
      render(html``, container);
      return;
    }
    generateRows(value);
  });
};

const generateRows = (number) => {
  const rows = [];
  for (let i = 0; i < number; i++) {
    const typeId = `type-${i}`;
    const lengthId = `length-${i}`;
    const widthId = `width-${i}`;
    const heightId = `height-${i}`;

    rows.push(html`
      <div class="form-row__grid">
        <div class="type-wrapper">
          <div class="form-group__grid--1">
            <label for="type-${i}">Type (Skid, Carton, Tube, etc.)</label>
            <input type="text" id="${typeId}" name="type-${i}" />
            <span id="${typeId}Error" class="error-message error-hidden"
              >Please enter a type</span
            >
          </div>
        </div>
        <div class="dimensions-wrapper">
          <div class="form-group__grid--2">
            <label for="length-${i}">Length</label>
            <input type="number" id="${lengthId}" name="length-${i}" />
            <span id="${lengthId}Error" class="error-message error-hidden"
              >Please enter a valid length</span
            >
          </div>
          <div class="form-group__grid--3">
            <label for="width-${i}">Width</label>
            <input type="number" id="${widthId}" name="width-${i}" />
            <span id="${widthId}Error" class="error-message error-hidden"
              >Please enter a valid width</span
            >
          </div>
          <div class="form-group__grid--4">
            <label for="height-${i}">Height</label>
            <input type="number" id="${heightId}" name="height-${i}" />
            <span id="${heightId}Error" class="error-message error-hidden"
              >Please enter a valid height</span
            >
          </div>
        </div>
      </div>
    `);
  }

  render(html`${rows}`, document.querySelector(".dynamic-rows-content"));
  addDynamicInputEventListeners(form);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isFormValid = validateForm(form);
  const areDynamicFieldsValid = validateDynamicFields(form);

  if (!isFormValid || !areDynamicFieldsValid) {
    return;
  }

  if (!isFormValid) {
    return;
  }

  showLoader(loader, submitBtn);

  try {
    await handleQuoteFormSubmit(form);
    showSuccessMessage();
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    hideLoader(loader, submitBtn);
  }
});
