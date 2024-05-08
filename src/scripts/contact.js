import "../styles/contact.css";
import { loadScript } from "./utils/domUtils.js";
import { initializeRecaptchaToken, handleSubmit } from "./utils/apiUtils.js";

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
