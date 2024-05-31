export function showError(selector) {
  const errorElement = document.querySelector(selector);
  if (!errorElement) {
    console.error(`Element not found for selector: ${selector}`);
    return;
  }
  errorElement.classList.remove("error-hidden");
}

export function hideError(selector) {
  const errorElement = document.querySelector(selector);
  if (!errorElement) {
    console.error(`Element not found for selector: ${selector}`);
    return;
  }
  errorElement.classList.add("error-hidden");
}
