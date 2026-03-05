const sections = document.querySelectorAll("main .menu-section");
const navToggle = document.querySelector(".nav-toggle");
const drawer = document.getElementById("nav-drawer");
const drawerPanel = drawer ? drawer.querySelector(".nav-drawer-panel") : null;
const drawerBackdrop = drawer ? drawer.querySelector(".nav-drawer-backdrop") : null;
const drawerClose = drawer ? drawer.querySelector(".nav-drawer-close") : null;
const drawerLinks = drawer ? drawer.querySelectorAll(".nav-drawer-links a") : [];
const backToTopBtn = document.querySelector(".back-to-top");

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function setActiveLinks(id) {
  const allLinks = document.querySelectorAll(
    ".nav-links a, .nav-drawer-links a"
  );
  allLinks.forEach((a) => a.classList.remove("is-active"));

  const matches = document.querySelectorAll(
    `.nav-links a[href="#${id}"], .nav-drawer-links a[href="#${id}"]`
  );
  matches.forEach((a) => a.classList.add("is-active"));

  const chipLink = document.querySelector(`.nav-links a[href="#${id}"]`);
  if (chipLink) {
    chipLink.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("is-open");
    isOpen ? closeDrawer() : openDrawer();
  });
}

if (drawerBackdrop) {
  drawerBackdrop.addEventListener("click", closeDrawer);
}

if (drawerClose) {
  drawerClose.addEventListener("click", closeDrawer);
}

drawerLinks.forEach((link) => {
  link.addEventListener("click", closeDrawer);
});

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
  if (window.scrollY > 400) {
    backToTopBtn.classList.add("is-visible");
  } else {
    backToTopBtn.classList.remove("is-visible");
  }
});
