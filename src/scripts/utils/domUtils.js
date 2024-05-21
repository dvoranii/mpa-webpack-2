"use strict";
import DOMPurify from "dompurify";

export function loadScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}

export function sanitizeInput(input) {
  return DOMPurify.sanitize(input);
}
