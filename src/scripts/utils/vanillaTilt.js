import VanillaTilt from "vanilla-tilt";

export function setupVanillaTilt() {
  VanillaTilt.init(document.querySelectorAll(".card"), {
    max: 10,
    speed: 300,
    glare: true,
    "max-glare": 0.8,
    reverse: true,
    reset: true,
  });
}
