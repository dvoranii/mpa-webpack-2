import "../styles/quote.css";
import "../styles/messages.css";
import { html, render } from "lit-html";
import { initializeRecaptcha } from "./utils/recaptcha.js";
import { fetchCsrfToken } from "./utils/csrfUtils.js";
import { addQuoteInputEventListeners } from "./utils/inputEventListeners.js";
import { validateForm, showSuccessMessage } from "./utils/validationUtils.js";

const clearBtn = document.querySelector(".clear-btn");
const form = document.querySelector(".quote-form");

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.reset();
});

document.addEventListener("DOMContentLoaded", async () => {
  initializeRecaptcha();
  renderRows();
  addQuoteInputEventListeners(form);
  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }
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
    rows.push(html`
      <div class="form-row__grid">
        <div class="type-wrapper">
          <div class="form-group__grid--1">
            <label for="type-${i}">Type (Skid, Carton, Tube, etc.)</label>
            <input type="text" id="type-${i}" name="type-${i}" />
          </div>
        </div>
        <div class="dimensions-wrapper">
          <div class="form-group__grid--2">
            <label for="length-${i}">Length</label>
            <input type="number" id="length-${i}" name="length-${i}" />
          </div>
          <div class="form-group__grid--3">
            <label for="width-${i}">Width</label>
            <input type="number" id="width-${i}" name="width-${i}" />
          </div>
          <div class="form-group__grid--4">
            <label for="height-${i}">Height</label>
            <input type="number" id="height-${i}" name="height-${i}" />
          </div>
        </div>
      </div>
    `);
  }

  render(html`${rows}`, document.querySelector(".dynamic-rows-content"));
};
const submitBtn = document.querySelector(".submit-btn");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) {
    return;
  }

  try {
    console.log("Submitting form...");
    showSuccessMessage();
    // Implement form submission logic here
  } catch (error) {
    console.error("Form submission error:", error);
  }
});
