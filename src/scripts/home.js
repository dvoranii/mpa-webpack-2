"use strict";
import "../styles/home.css";
import "../styles/modal.css";
import "../styles/messages.css";
import "../styles/loader.css";
import {
  initializeRecaptcha,
  stopRecaptchaTokenRefresh,
} from "./utils/recaptcha.js";
import { fetchCsrfToken } from "./utils/csrfUtils.js";
import { handleSubscriptionFormSubmit } from "./utils/formUtils.js";
import { addInputEventListeners } from "./utils/inputEventListeners.js";
import { validateForm } from "./utils/validationUtils.js";
import { showLoader, hideLoader } from "./utils/loadingSpinner.js";
import { initializeBasicScroll } from "./utils/basicScroll.js";
import { setupVanillaTilt } from "./utils/vanillaTilt.js";
import { initFlickity } from "./utils/flickity.js";
import { showSuccessMessage } from "./utils/errorUtils.js";
import { lazyLoadImages, lazyLoadBackgrounds } from "./utils/lazyLoad.js";
import { initGlobe } from "./utils/threeGlobe.js";

document.addEventListener("DOMContentLoaded", async () => {
  initializeRecaptcha("recaptchaResponse");
  const form = document.querySelector(".newsletter-form");
  addInputEventListeners(form);
  try {
    await fetchCsrfToken();
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }

  initializeBasicScroll();
  setupVanillaTilt();
  initFlickity(".carousel.carousel-home");
  lazyLoadImages();
  lazyLoadBackgrounds();
  initGlobe();

  const ctaButton = document.querySelector(".cta-btn--color-9");
  const windowLocation = window.location.href;
  ctaButton.addEventListener("click", () => {
    window.location.href = `${windowLocation}quote`;
  });
});

window.addEventListener("beforeunload", () => {
  stopRecaptchaTokenRefresh();
});

const modalBg = document.querySelector(".modal-bg");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".modal__close-btn");
const form = document.querySelector(".newsletter-form");
const subscribeBtn = document.querySelector(".modal__subscribe-btn");
const loader = document.querySelector(".loader");

setTimeout(() => {
  modalBg.classList.add("bg-active");
  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
}, 10000);

function closeModal() {
  modal.classList.remove("show");
  modalBg.classList.remove("bg-active");
}

closeBtn.addEventListener("pointerdown", closeModal);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm(form)) {
    return;
  }

  showLoader(loader, subscribeBtn);

  try {
    await handleSubscriptionFormSubmit(form);
    showSuccessMessage();
    form.reset();
    setTimeout(() => {
      modal.classList.remove("show");
      modalBg.classList.remove("bg-active");
    }, 3000);
  } catch (error) {
    console.error("Subscription error:", error);
  } finally {
    hideLoader(loader, subscribeBtn);
  }
});

const cglLogo = document.querySelector(".home-section__logo");

let observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0.5) {
        entry.target.classList.add("home-section__logo--visible");
      } else {
        entry.target.classList.remove("home-section__logo--visible");
      }
    });
  },
  {
    root: null,
    rootMargin: "-50px",
    threshold: 0.5,
  }
);

observer.observe(cglLogo);
