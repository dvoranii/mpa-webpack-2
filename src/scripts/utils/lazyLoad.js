export function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy");

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.classList.remove("lazy");
          img.onload = () => {
            img.removeAttribute("data-src");
            img.classList.add("fade-in");
          };
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "200px",
    }
  );

  lazyImages.forEach((image) => {
    imageObserver.observe(image);
  });
}

export function lazyLoadBackgrounds() {
  const lazyBackgrounds = document.querySelectorAll(".lazy-bg");

  const backgroundObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bg = entry.target;
          const src = bg.getAttribute("data-src");
          bg.style.backgroundImage = `url(${src})`;
          bg.classList.add("lazy-bg-loaded");
          observer.unobserve(bg);
        }
      });
    },
    {
      rootMargin: "0px",
    }
  );

  lazyBackgrounds.forEach((bg) => {
    backgroundObserver.observe(bg);
  });
}
