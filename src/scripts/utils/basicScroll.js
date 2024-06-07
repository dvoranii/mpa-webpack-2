import basicScroll from "basicscroll";

function createBasicScroll(elem, from, to, props) {
  const instance = basicScroll.create({
    elem: document.querySelector(elem),
    from,
    to,
    props,
  });

  instance.start();
  return instance;
}

export function initializeBasicScroll() {
  createBasicScroll(".scroll-img", "top-bottom", "bottom-top", {
    "--translateX": {
      from: "-20vw",
      to: "40vw",
    },
  });

  createBasicScroll(".scroll-img--2", "top-bottom", "bottom-top", {
    "--translateX": {
      from: "40vw",
      to: "-20vw",
    },
  });

  createBasicScroll(".home-section__logo-wrapper", "top-bottom", "top-center", {
    "--logoBgOpacity": {
      from: "0",
      to: "0.7",
    },
  });

  createBasicScroll(".bg", "viewport-top", "top-middle", {
    "--bg-opacity": {
      from: "1",
      to: "0.01",
    },
  });
}
