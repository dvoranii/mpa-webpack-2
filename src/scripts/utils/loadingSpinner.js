export function showLoader(loaderSelector, triggerSelector) {
  const loader = document.querySelector(loaderSelector);
  const trigger = document.querySelector(triggerSelector);
  loader.classList.remove("loader-hidden");
  trigger.style.visibility = "hidden";
}

export function hideLoader(loaderSelector, triggerSelector) {
  const loader = document.querySelector(loaderSelector);
  const trigger = document.querySelector(triggerSelector);
  loader.classList.add("loader-hidden");
  trigger.style.visibility = "visible";
}
