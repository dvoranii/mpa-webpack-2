export function loadScript(url, callback) {
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}
