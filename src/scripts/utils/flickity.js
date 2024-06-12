import "flickity/css/flickity.css";
import "lazysizes";
import "../../styles/flickity.css";
import Flickity from "flickity";

export function initFlickity(selector) {
  const carousel = document.querySelector(selector);

  if (carousel) {
    new Flickity(carousel, {
      cellAlign: "left",
      contain: true,
      wrapAround: true,
      autoPlay: 5000,
      prevNextButtons: true,
      pageDots: true,
      autoPlay: false,
      lazyLoad: 0,
    });
  }
}
