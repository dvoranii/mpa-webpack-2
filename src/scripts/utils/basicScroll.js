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

function initializeBasicScrollInstances() {
  const scrollInstances = [];

  // Always initialize these instances regardless of screen size
  scrollInstances.push(
    createBasicScroll(
      ".home-section__logo-wrapper",
      "top-bottom",
      "top-center",
      {
        "--logoBgOpacity": {
          from: "0",
          to: "0.7",
        },
      }
    )
  );

  scrollInstances.push(
    createBasicScroll(".bg", "viewport-top", "top-top", {
      "--bg-opacity": {
        from: "1",
        to: "0.01",
      },
    })
  );

  scrollInstances.push(
    createBasicScroll(".card", "top-bottom", "bottom-center", {
      "--shadowOpacity": {
        from: "0.0",
        to: "0.6",
      },
    })
  );

  // Conditionally initialize scroll-grid images based on screen size
  if (window.innerWidth > 1024) {
    scrollInstances.push(
      createBasicScroll(".scroll-img--1", "top-bottom", "bottom-top", {
        "--translateX1": {
          from: "20vw",
          to: "-40vw",
        },
      })
    );

    scrollInstances.push(
      createBasicScroll(".scroll-img--2", "top-bottom", "bottom-top", {
        "--translateX2": {
          from: "40vw",
          to: "0vw",
        },
      })
    );

    scrollInstances.push(
      createBasicScroll(".scroll-img--3", "top-bottom", "bottom-top", {
        "--translateX3": {
          from: "20vw",
          to: "-40vw",
        },
      })
    );

    scrollInstances.push(
      createBasicScroll(".scroll-img--4", "top-bottom", "bottom-top", {
        "--translateX4": {
          from: "40vw",
          to: "0vw",
        },
      })
    );
  }

  return scrollInstances;
}

export function initializeBasicScroll() {
  let scrollInstances = initializeBasicScrollInstances();

  window.addEventListener("resize", () => {
    scrollInstances.forEach((instance) => instance.destroy());
    scrollInstances = initializeBasicScrollInstances();
  });
}
