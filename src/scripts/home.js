"use strict";
import "../styles/home.css";
import "../styles/modal.css";

const modalBg = document.querySelector(".modal-bg");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".modal-close__btn");

setTimeout(() => {
  modalBg.classList.add("bg-active");
  requestAnimationFrame(() => {
    modal.classList.add("show");
  });
}, 5000);

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  modalBg.classList.remove("bg-active");
});
