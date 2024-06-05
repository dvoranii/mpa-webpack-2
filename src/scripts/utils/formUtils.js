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

function appendDynamicFields(form, formData) {
  const dynamicFields = form.querySelectorAll(
    ".form-group__grid--1 input, .form-group__grid--2 input, .form-group__grid--3 input, .form-group__grid--4 input"
  );

  dynamicFields.forEach((input) => {
    formData.set(input.name, sanitizeInput(input.value));
  });
}

function sanitizeFormFields(formData, fields) {
  fields.forEach((field) => {
    formData.set(field, sanitizeInput(formData.get(field)));
  });
}

function handleCsrfToken(form) {
  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    throw new Error("CSRF token not available");
  }
  appendCsrfToken(form, csrfToken);
}

// need to structure the data BEFORE the FormData object is created
// understand how FormData grabs the inputs

async function handleFormSubmit(form, url, fields) {
  handleCsrfToken(form);
  const formData = new FormData(form);
  sanitizeFormFields(formData, fields);
  appendDynamicFields(form, formData);

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

export async function handleQuoteFormSubmit(form) {
  try {
    const fields = [
      "name",
      "email",
      "company",
      "phone",
      "pickupAddress",
      "shippingAddress",
      "skids",
      "pieces",
      "service",
      "weight",
      "units",
      "HSCode",
      "hazardous",
      "nonPersonal",
      "recaptchaResponse",
      "additionalInfo",
      "recaptchaResponse",
    ];

    const skidsCount = parseInt(form.querySelector("#skids").value, 10);
    for (let i = 0; i < skidsCount; i++) {
      fields.push(`type-${i}`);
      fields.push(`length-${i}`);
      fields.push(`width-${i}`);
      fields.push(`height-${i}`);
    }

    const data = await handleFormSubmit(
      form,
      "http://localhost:4444/quote-form",
      fields
    );
    console.log("Quote form submitted successfully:", data);
  } catch (error) {
    console.error(`Quote form error: ${error}`);
  }
}