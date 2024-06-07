import "flickity/css/flickity.css";
import "../../styles/flickity.css";
import Flickity from "flickity";

export function initFlickity() {
  const carousel = document.querySelector(".carousel");

  if (carousel) {
    new Flickity(carousel, {
      cellAlign: "left",
      contain: true,
      wrapAround: true,
      autoPlay: 5000,
      prevNextButtons: true,
      pageDots: true,
    });
  }
}
