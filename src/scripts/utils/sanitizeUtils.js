// utils/sanitizeUtils.js

/**
 * Strips HTML tags from a string.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string with HTML tags removed.
 */
export function stripHtmlTags(str) {
  const div = document.createElement("div");
  div.innerHTML = str;
  return div.textContent || div.innerText || "";
}

/**
 * Sanitizes all form inputs by stripping HTML tags.
 * @param {HTMLFormElement} form - The form element containing the inputs to sanitize.
 * @returns {object} - An object with sanitized input values.
 */
export function sanitizeFormInputs(form) {
  const formData = new FormData(form);
  const sanitizedData = {};

  formData.forEach((value, key) => {
    if (typeof value === "string") {
      sanitizedData[key] = stripHtmlTags(value);
    } else {
      sanitizedData[key] = value;
    }
  });

  return sanitizedData;
}
