document.addEventListener("DOMContentLoaded", function () {
    const allElements = document.querySelectorAll("section, h2, img, p, ul");
    const sections = Array.from(allElements).filter(el => !el.closest(".no-fade"));
  
    const options = {
      root: null,
      threshold: 0.1,
      rootMargin: "0px"
    };
  
    const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
          observer.unobserve(entry.target);
        }
      });
    }, options);
  
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) {
        section.classList.add("fade-in-hidden");
        fadeInOnScroll.observe(section);
      } else {
        section.classList.add("fade-in-visible");
      }
    });
  });