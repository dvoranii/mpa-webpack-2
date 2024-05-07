export function loadScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}

export function setupFormListener(selector, handler) {
  const form = document.querySelector(selector);
  if (!form) {
    console.error("Form not found");
    return;
  }
  form.addEventListener("submit", handler);
}
