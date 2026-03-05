const navLinks = document.querySelectorAll(".nav-links a");
const drawer = document.getElementById("nav-drawer");
const drawerLinks = drawer ? drawer.querySelectorAll("a") : null;
const sections = document.querySelectorAll("main .menu-section");
const navToggle = document.querySelector(".nav-toggle");
const backToTopBtn = document.querySelector(".back-to-top");

function setActiveLinks(id) {
  const selector = `.nav-links a[href="#${id}"], .nav-drawer-links a[href="#${id}"]`;
  const allNavLinks = document.querySelectorAll(
    ".nav-links a, .nav-drawer-links a"
  );
  const current = document.querySelectorAll(selector);

  allNavLinks.forEach((a) => a.classList.remove("is-active"));
  current.forEach((a) => a.classList.add("is-active"));
}

if (navToggle && drawer) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;
    navToggle.setAttribute("aria-expanded", String(nextExpanded));
    drawer.classList.toggle("is-open", nextExpanded);
    drawer.setAttribute("aria-hidden", String(!nextExpanded));
  });
}

if (drawerLinks && drawer) {
  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
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

      if (entry.isIntersecting) {
        setActiveLinks(id);
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

