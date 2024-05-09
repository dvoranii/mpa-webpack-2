import "../styles/contact.css";
import { loadScript } from "./utils/domUtils.js";
import { initializeRecaptchaToken, handleSubmit } from "./utils/apiUtils.js";
import { Loader } from "./Components/Loader.js";

// to control async loading of the script
document.addEventListener("DOMContentLoaded", () => {
  loadScript(
    "https://www.google.com/recaptcha/api.js?render=6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1",
    initializeRecaptchaToken
  );
});

const submitBtn = document.querySelector(".submit-btn");
const form = document.querySelector(".contact-form");
const loader = new Loader(".loader", ".submit-btn");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  loader.show();

  try {
    await handleSubmit(form);
  } catch (error) {
    console.error(`Error: ${error}`);
    console.log("Failed to submit the form. Please try again later.");
  } finally {
    loader.hide();
  }
});
