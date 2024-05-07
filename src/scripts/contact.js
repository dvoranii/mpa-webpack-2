import "../styles/contact.css";
import { loadScript, setupFormListener } from "./domUtils.js";
import { setupRecaptcha, submitForm } from "./apiUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  loadScript(
    "https://www.google.com/recaptcha/api.js?render=6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1",
    initializeContactPage
  );
});

function initializeContactPage() {
  setupRecaptcha((token) => {
    document.getElementById("recaptchaResponse").value = token;
  });
  setupFormListener(".contact-form", handleSubmit);
}

async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

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
