// Components/ErrorMessage.js
export class ErrorMessage {
  constructor(errorSelector) {
    this.errorElement = document.querySelector(errorSelector);
  }

  show(message) {
    this.errorElement.textContent = message;
    this.errorElement.classList.remove("error-hidden");
  }

  hide() {
    this.errorElement.classList.add("error-hidden");
    this.errorElement.textContent = "";
  }
}
