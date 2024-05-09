export class Loader {
  constructor(loaderSelector, triggerSelector) {
    this.loader = document.querySelector(loaderSelector);
    this.trigger = document.querySelector(triggerSelector);
  }

  show() {
    this.loader.classList.remove("loader-hidden");
    this.trigger.style.visibility = "hidden";
  }

  hide() {
    this.loader.classList.add("loader-hidden");
    this.trigger.style.visibility = "visible";
  }
}
