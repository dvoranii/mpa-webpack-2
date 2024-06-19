"use strict";
import "../styles/contact.css";
import "../styles/messages.css";
import "../styles/loader.css";
import {
  initializeRecaptcha,
  stopRecaptchaTokenRefresh,
} from "./utils/recaptcha.js";
import { handleContactFormSubmit } from "./utils/formUtils.js";
import { showLoader, hideLoader } from "./utils/loadingSpinner.js";
import { validateForm } from "./utils/validationUtils.js";
import { addInputEventListeners } from "./utils/inputEventListeners.js";
import { fetchCsrfToken } from "./utils/csrfUtils.js";
import { showSuccessMessage } from "./utils/errorUtils.js";

document.addEventListener("DOMContentLoaded", async () => {
  initializeRecaptcha("recaptchaResponseContact");
  const form = document.querySelector(".contact-form");
  addInputEventListeners(form);

  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }

  const tabs = document.querySelectorAll(".tab-link");
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const office = tab.getAttribute("data-office");
      showOffice(office);
    });
  });

  showOffice("ontario");
});

window.addEventListener("beforeunload", () => {
  stopRecaptchaTokenRefresh();
});

function showOffice(office) {
  const offices = document.querySelectorAll(".office-section");
  offices.forEach((section) => {
    section.style.display = "none";
  });

  const activeSection = document.getElementById(office);
  if (activeSection) {
    activeSection.style.display = "block";
  }

  const tabs = document.querySelectorAll(".tab-link");
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  const activeTab = document.querySelector(
    `.tab-link[data-office="${office}"]`
  );
  if (activeTab) {
    activeTab.classList.add("active");
  }
}

const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector(".contact-form");
const loader = document.querySelector(".loader");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) {
    return;
  }

  showLoader(loader, submitBtn);

  try {
    await handleContactFormSubmit(form);
    showSuccessMessage();
    form.reset();
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    hideLoader(loader, submitBtn);
  }
});
