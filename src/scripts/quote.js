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

const multiStepForm = document.querySelector("[data-multi-step]");
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
const progressSteps = document.querySelectorAll(".progress-step");
const clearBtn = document.querySelector(".clear-btn");
const loader = document.querySelector(".loader");
const submitBtn = document.querySelector("button[type='submit']");
const nextBtn = document.querySelector("[data-next]");
const errorMessages = document.querySelectorAll(".error-message");
const dynamicRowsContainer = document.querySelector(".dynamic-rows-content");
const skidsInput = document.querySelector("#skids");

// Initial form state
let currentStep = formSteps.findIndex((step) =>
  step.classList.contains("active")
);

if (currentStep < 0) {
  currentStep = 0;
  showCurrentStep();
}

/**
 * Validates the inputs for the current step of the form.
 * It uses a switch statement to apply the correct validation logic for each step.
 * @param {number} stepIndex - The index of the current form step.
 * @returns {boolean} - True if the step is valid, false otherwise.
 */
const validateCurrentStep = (stepIndex) => {
  let isStepValid = true;
  const currentStepElement = formSteps[stepIndex];

  // A list of input IDs for each step to be validated.
  const stepInputIds = [
    ["name", "email", "companyName", "phone"],
    ["pickupAddress", "shippingAddress"],
    ["skids", "pieces", "service", "weight", "units", "hazardous"],
  ];

  // Get all relevant inputs for the current step.
  const inputsToValidate = stepInputIds[stepIndex]
    .map((id) => currentStepElement.querySelector(`#${id}`))
    .filter(Boolean); // Filter out any null values

  // Validate each input using the general validateForm function.
  inputsToValidate.forEach((input) => {
    // We pass a dummy object with a querySelector to mimic the form structure
    if (
      !validateForm({
        querySelector: (selector) => currentStepElement.querySelector(selector),
      })
    ) {
      isStepValid = false;
    }
  });

  // Handle dynamic fields specifically for step 3.
  if (stepIndex === 2) {
    if (!validateDynamicFields(multiStepForm)) {
      isStepValid = false;
    }
  }

  return isStepValid;
};

// Event listener for Next, Previous, and Review buttons
multiStepForm.addEventListener("click", (e) => {
  let incrementor;
  if (e.target.matches("[data-next]")) {
    // Validate current step before allowing to proceed
    const isStepValid = validateCurrentStep(currentStep);
    if (isStepValid) {
      incrementor = 1;
    } else {
      return; // Stop if validation fails
    }
  } else if (e.target.matches("[data-previous]")) {
    incrementor = -1;
  } else if (e.target.matches("[data-review]")) {
    // Validate current step before showing review
    const isStepValid = validateCurrentStep(currentStep);
    if (isStepValid) {
      // Jump to review page (step 3)
      currentStep = 3;
      showCurrentStep();
      return;
    } else {
      return; // Stop if validation fails
    }
  }

  if (incrementor == null) return; // Only move if incrementor is set

  currentStep += incrementor;
  showCurrentStep();
});

// Animate steps
formSteps.forEach((step) => {
  step.addEventListener("animationend", (e) => {
    formSteps[currentStep].classList.remove("hide");
    e.target.classList.toggle("hide", !e.target.classList.contains("active"));
  });
});

// Function to show/hide steps and update progress bar
function showCurrentStep() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  progressSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
    step.classList.toggle("completed", index < currentStep);
  });

  // Update button visibility based on current step
  updateButtonVisibility();
}

// Function to update button visibility
function updateButtonVisibility() {
  const nextBtn = document.querySelector("[data-next]");
  const prevBtn = document.querySelector("[data-previous]");
  const reviewBtn = document.querySelector("[data-review]");
  const submitBtn = document.querySelector("button[type='submit']");

  // Hide all buttons first
  [nextBtn, prevBtn, reviewBtn, submitBtn].forEach((btn) => {
    if (btn) btn.classList.add("hidden");
  });

  if (currentStep === 0) {
    // First step: only show Next
    if (nextBtn) nextBtn.classList.remove("hidden");
  } else if (currentStep === 1) {
    // Second step: show Previous and Next
    if (prevBtn) prevBtn.classList.remove("hidden");
    if (nextBtn) nextBtn.classList.remove("hidden");
  } else if (currentStep === 2) {
    // Third step (shipment details): show Previous and Review
    if (prevBtn) prevBtn.classList.remove("hidden");
    if (reviewBtn) reviewBtn.classList.remove("hidden");
  } else if (currentStep === 3) {
    // Review step: show Previous and Submit
    if (prevBtn) prevBtn.classList.remove("hidden");
    if (submitBtn) submitBtn.classList.remove("hidden");
    renderReviewPage();
  }
}

const renderReviewPage = () => {
  const form = multiStepForm;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const skidsCount = parseInt(form.querySelector("#skids").value, 10) || 0;
  const skidsData = [];
  for (let i = 0; i < skidsCount; i++) {
    skidsData.push({
      type: data[`type-${i}`] || "Not specified",
      length: data[`length-${i}`] || "Not specified",
      width: data[`width-${i}`] || "Not specified",
      height: data[`height-${i}`] || "Not specified",
    });
  }

  const reviewContent = html`
    <div class="review-content">
      <h2>Personal Information</h2>
      <p><strong>Name:</strong> ${data.name || "Not provided"}</p>
      <p><strong>Email:</strong> ${data.email || "Not provided"}</p>
      <p><strong>Company Name:</strong> ${data.company || "Not provided"}</p>
      <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>

      <h2>Shipping Details</h2>
      <p>
        <strong>Pickup Address:</strong> ${data.pickupAddress || "Not provided"}
      </p>
      <p>
        <strong>Shipping Address:</strong> ${data.shippingAddress ||
        "Not provided"}
      </p>

      <h2>Shipment Details</h2>
      <p><strong>Number of Skids:</strong> ${data.skids || "Not provided"}</p>
      <p><strong>Number of Pieces:</strong> ${data.pieces || "Not provided"}</p>
      <p><strong>Service Type:</strong> ${data.service || "Not provided"}</p>
      <p><strong>Weight:</strong> ${data.weight || "Not provided"}</p>
      <p><strong>Units:</strong> ${data.units || "Not provided"}</p>
      <p><strong>Hazardous:</strong> ${data.hazardous || "Not provided"}</p>
      <p><strong>HS Code:</strong> ${data.HSCode || "Not provided"}</p>
      <p>
        <strong>Non Personal Effects:</strong> ${data.nonPersonal
          ? "Yes"
          : "No"}
      </p>
      <p>
        <strong>Additional Information:</strong> ${data.additionalInfo ||
        "None provided"}
      </p>

      ${skidsCount > 0
        ? html`
            <h2>Individual Skid Details</h2>
            ${skidsData.map(
              (skid, index) => html`
                <div class="skid-item">
                  <h3>Skid #${index + 1}</h3>
                  <p><strong>Type:</strong> ${skid.type}</p>
                  <p>
                    <strong>Dimensions:</strong> ${skid.length} x ${skid.width}
                    x ${skid.height}
                  </p>
                </div>
              `
            )}
          `
        : ""}
    </div>
  `;

  const reviewStep = document.querySelector('[data-step="3"]');
  if (reviewStep) {
    render(reviewContent, reviewStep);
  }
};

// Existing form logic
if (clearBtn) {
  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    multiStepForm.reset();

    errorMessages.forEach((errorMessage) => {
      errorMessage.classList.add("error-hidden");
    });

    if (dynamicRowsContainer) {
      render(html``, dynamicRowsContainer);
    }

    // Reset to first step
    currentStep = 0;
    showCurrentStep();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Only initialize reCAPTCHA if the element exists
  const recaptchaElement = document.querySelector("#recaptchaResponse");
  if (recaptchaElement) {
    initializeRecaptcha("recaptchaResponse");
  }

  renderRows();
  addQuoteInputEventListeners(multiStepForm);

  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
    // Don't block the form if CSRF fails
  }
});

window.addEventListener("beforeunload", () => {
  stopRecaptchaTokenRefresh();
});

const renderRows = () => {
  // Check for skidsInput before adding event listener
  if (skidsInput) {
    skidsInput.addEventListener("input", (e) => {
      const value = parseInt(skidsInput.value, 10);
      if (isNaN(value) || value < 1 || value > 20) {
        if (dynamicRowsContainer) {
          render(html``, dynamicRowsContainer);
        }
        return;
      }
      generateRows(value);
    });
  }
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

  const dynamicContainer = document.querySelector(".dynamic-rows-content");
  if (dynamicContainer) {
    render(html`${rows}`, dynamicContainer);
    addDynamicInputEventListeners(multiStepForm);
  }
};

// Safe form submission handler
if (multiStepForm) {
  multiStepForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isFormValid = validateForm(multiStepForm);
    const areDynamicFieldsValid = validateDynamicFields(multiStepForm);

    if (!isFormValid || !areDynamicFieldsValid) {
      console.log("Form validation failed");
      return;
    }

    // Only show loader if elements exist
    if (loader && submitBtn) {
      showLoader(loader, submitBtn);
    } else {
      console.log("Submitting form...");
      if (submitBtn) submitBtn.disabled = true;
    }

    try {
      await handleQuoteFormSubmit(multiStepForm);

      // Only show success message if the function exists and elements are available
      if (typeof showSuccessMessage === "function") {
        try {
          showSuccessMessage();
        } catch (successError) {
          console.log(
            "Form submitted successfully, but couldn't show success message"
          );
        }
      } else {
        console.log("Form submitted successfully!");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      // Only hide loader if elements exist
      if (loader && submitBtn) {
        hideLoader(loader, submitBtn);
      } else {
        if (submitBtn) submitBtn.disabled = false;
      }
    }
  });
}
