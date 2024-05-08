import "../styles/contact.css";
import { loadScript } from "./utils/domUtils.js";
import { setupRecaptcha, submitForm } from "./utils/apiUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  loadScript(
    "https://www.google.com/recaptcha/api.js?render=6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1",
    initializeRecaptchaToken
  );

  const submitBtn = document.querySelector(".submit-btn");
  const form = document.querySelector(".contact-form");

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await handleSubmit(form);
  });
});

function initializeRecaptchaToken() {
  setupRecaptcha((token) => {
    document.getElementById("recaptchaResponse").value = token;
  });
}

async function handleSubmit(form) {
  const formData = new FormData(form);

  try {
    const data = await submitForm(
      "http://localhost:4444/submit-form",
      formData
    );
    console.log(`Success: ${JSON.stringify(data)}`);
    alert("Form submitted successfully!");
  } catch (error) {
    console.error(`Error: ${error}`);
    alert("Failed to submit the form. Please try again later.");
  }
}
