// loadingSpinner.js
export function showLoader(loader, triggerBtn) {
  console.log("Showing loader:", loader);
  loader.classList.remove("loader-hidden");
  console.log("Loader classes after showing:", loader.classList);
  triggerBtn.style.visibility = "hidden";
}

export function hideLoader(loader, triggerBtn) {
  loader.classList.add("loader-hidden");
  console.log("Hiding loader:", loader);
  console.log("Loader classes after hiding:", loader.classList);
  triggerBtn.style.visibility = "visible";
}
