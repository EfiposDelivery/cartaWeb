const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main .menu-section");
const navToggle = document.querySelector(".nav-toggle");
const navList = document.getElementById("nav-links");
const backToTopBtn = document.querySelector(".back-to-top");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navList.classList.toggle("is-open");
  });
}

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (!id) return;

      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  {
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => observer.observe(section));

window.addEventListener("scroll", () => {
  if (!backToTopBtn) return;
  const showAfter = 400;
  if (window.scrollY > showAfter) {
    backToTopBtn.classList.add("is-visible");
  } else {
    backToTopBtn.classList.remove("is-visible");
  }
});

