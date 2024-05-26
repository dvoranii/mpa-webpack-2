"use strict";
import { sanitizeInput } from "./domUtils.js";
import { getCsrfToken, appendCsrfToken } from "./csrfUtils.js";

function setupRecaptcha(callback) {
  if (typeof grecaptcha === "undefined") {
    console.error("reCAPTCHA library not loaded!");
    return;
  }
  grecaptcha.ready(() => {
    grecaptcha
      .execute("6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1", { action: "submit" })
      .then((token) => {
        callback(token);
      });
  });
}

export function initializeRecaptchaToken() {
  setupRecaptcha((token) => {
    document.getElementById("recaptchaResponse").value = token;
  });
}

// abstracted this logic to avoid nested callbacks
async function submitForm(url, formData) {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function handleFormSubmit(form, url, fields) {
  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    throw new Error("CSRF token not available");
  }

  appendCsrfToken(form, csrfToken);

  const formData = new FormData(form);
  fields.forEach((field) => {
    formData.set(field, sanitizeInput(formData.get(field)));
  });

  try {
    const data = await submitForm(url, formData);
    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
}

export async function handleContactFormSubmit(form) {
  try {
    const data = await handleFormSubmit(
      form,
      "http://localhost:4444/submit-form",
      ["name", "email", "message"]
    );
  } catch (error) {
    alert("Failed to submit the form. Please try again later.");
  }
}

export async function handleSubscriptionFormSubmit(form) {
  try {
    const data = await handleFormSubmit(
      form,
      "http://localhost:4444/subscribe",
      ["name", "email"]
    );
    console.log("Subscription successful!");
  } catch (error) {
    alert("Failed to subscribe. Please try again later.");
  }
}
