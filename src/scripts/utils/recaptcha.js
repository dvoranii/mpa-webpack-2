"use strict";
import { loadScript } from "./domUtils.js";

let refreshTokenInterval;

function setupRecaptcha(callback) {
  if (typeof grecaptcha === "undefined") {
    console.error("reCAPTCHA library not loaded!");
    return;
  }
  grecaptcha.ready(() => {
    grecaptcha
      .execute("6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1", { action: "submit" })
      .then((token) => {
        callback(token);
      });
  });
}

function initializeRecaptchaToken() {
  setupRecaptcha((token) => {
    const recaptchaElem = document.getElementById("recaptchaResponse");
    if (recaptchaElem) {
      recaptchaElem.value = token;
    } else {
      console.error("reCAPTCHA response element not found!");
    }
  });
}

function refreshRecaptchaToken() {
  refreshTokenInterval = setInterval(() => {
    setupRecaptcha((token) => {
      const recaptchaElem = document.getElementById("recaptchaResponse");
      if (recaptchaElem) {
        recaptchaElem.value = token;
      }
    });
  }, 2 * 60 * 1000); // Refresh every 2 minutes
}

export function initializeRecaptcha(inputID) {
  loadScript(
    "https://www.google.com/recaptcha/api.js?render=6LddpsMpAAAAAD-7Uj4O_xlo84BMGwjJp_rQBkX1",
    () => {
      initializeRecaptchaToken(inputID);
      refreshRecaptchaToken();
    }
  );
}

export function stopRecaptchaTokenRefresh() {
  if (refreshTokenInterval) {
    clearInterval(refreshTokenInterval);
  }
}
