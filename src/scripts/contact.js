import "../styles/contact.css";

document.addEventListener("DOMContentLoaded", () => {
  setupRecaptcha();
  setupFormSubmission();
});

function setupFormSubmission() {
  const form = document.querySelector(".contact-form");
  if (!form) {
    console.error("Form not found on the page");
    return;
  }
  form.addEventListener("submit", handleSubmit);
}

function setupRecaptcha() {
  if (typeof grecaptcha === "undefined") {
    console.error("reCAPTCHA library not loaded!");
    return;
  }
  grecaptcha.ready(() => {
    grecaptcha
      .execute("6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1", { action: "submit" })
      .then((token) => {
        let recaptchaResponse = document.getElementById("recaptchaResponse");
        if (!recaptchaResponse) {
          console.error("Recaptcha response element not found!");
          return;
        }
        recaptchaResponse.value = token;
      });
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  fetch("http://localhost:4444/submit-form", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
