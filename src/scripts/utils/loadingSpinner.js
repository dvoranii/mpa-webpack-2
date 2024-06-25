export function showLoader(loader, triggerBtn) {
  loader.classList.remove("loader-hidden");
  triggerBtn.style.visibility = "hidden";
}

export function hideLoader(loader, triggerBtn) {
  loader.classList.add("loader-hidden");
  triggerBtn.style.visibility = "visible";
}
