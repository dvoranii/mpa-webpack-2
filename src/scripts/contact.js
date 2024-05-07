import "../styles/contact.css";

document.addEventListener("DOMContentLoaded", () => {
  loadRecaptchaScript();
});

function loadRecaptchaScript() {
  const script = document.createElement("script");
  script.src =
    "https://www.google.com/recaptcha/api.js?render=6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1";
  script.async = true;
  script.onload = function () {
    setupRecaptcha();
    setupFormSubmission();
  };
  document.body.appendChild(script);
}

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

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:4444/submit-form", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      console.log(`Success: ${JSON.stringify(data)}`);
      alert("Form submitted successfully!");
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    alert("Failed to submit the form. Please try again later.");
  }
}
