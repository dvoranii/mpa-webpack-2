// utils/inputEventListeners.js

export function addInputEventListeners(form) {
  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const messageInput = form.querySelector("#message");

  nameInput.addEventListener("input", () => {
    hideError("#nameError");
  });

  emailInput.addEventListener("input", () => {
    hideError("#emailEmptyError");
    hideError("#emailInvalidError");
  });

  messageInput.addEventListener("input", () => {
    hideError("#messageError");
  });
}

function hideError(selector) {
  const errorElement = document.querySelector(selector);
  if (!errorElement) {
    console.error(`Element not found for selector: ${selector}`);
    return;
  }
  errorElement.classList.add("error-hidden");
}
