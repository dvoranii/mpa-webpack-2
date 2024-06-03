import { sanitizeInput } from "./domUtils.js";
import { getCsrfToken, appendCsrfToken } from "./csrfUtils.js";

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
      "http://localhost:4444/contact-form",
      ["name", "email", "message", "recaptchaResponse"]
    );
    // Assuming handleFormSubmit returns the response data
    console.log("Form submitted successfully:", data);
  } catch (error) {
    console.error(`Contact form error: ${error}`);
    alert("There was an error submitting the form. Please try again later.");
  }
}

export async function handleSubscriptionFormSubmit(form) {
  try {
    const data = await handleFormSubmit(
      form,
      "http://localhost:4444/subscribe",
      ["name", "email", "recaptchaResponse"]
    );
  } catch (error) {
    console.error(`Subscription error: ${error} `);
  }
}
