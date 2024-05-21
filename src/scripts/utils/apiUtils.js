"use strict";
import { sanitizeInput } from "./domUtils.js";

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
    });
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function handleSubmit(form) {
  const formData = new FormData(form);
  formData.set("name", sanitizeInput(formData.get("name")));
  formData.set("email", sanitizeInput(formData.get("email")));
  formData.set("message", sanitizeInput(formData.get("message")));

  try {
    const data = await submitForm(
      "http://localhost:4444/submit-form",
      formData
    );
    console.log(`Success: ${JSON.stringify(data)}`);
    console.log("Form submitted successfully!");
  } catch (error) {
    console.error(`Error: ${error}`);
    alert("Failed to submit the form. Please try again later.");
  }
}
