// URL del API — cambiar cuando se despliegue en Hetzner
const API_URL = "https://elvar.efiposdelivery.com.es/menu";
// Cuando el backend esté en Hetzner, cambiar a algo como:
// const API_URL = "https://api.elvar.es/menu";

// ── Navegación y UI ──

const navToggle = document.querySelector(".nav-toggle");
const drawer = document.getElementById("nav-drawer");
const drawerPanel = drawer ? drawer.querySelector(".nav-drawer-panel") : null;
const drawerBackdrop = drawer ? drawer.querySelector(".nav-drawer-backdrop") : null;
const drawerClose = drawer ? drawer.querySelector(".nav-drawer-close") : null;
const drawerLinks = drawer ? drawer.querySelectorAll(".nav-drawer-links a") : [];
const backToTopBtn = document.querySelector(".back-to-top");

let observer = null;

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
  document.querySelectorAll(".nav-links a, .nav-drawer-links a")
    .forEach((a) => a.classList.remove("is-active"));
  document.querySelectorAll(`.nav-links a[href="#${id}"], .nav-drawer-links a[href="#${id}"]`)
    .forEach((a) => a.classList.add("is-active"));
  const chipLink = document.querySelector(`.nav-links a[href="#${id}"]`);
  if (chipLink) chipLink.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
}

if (navToggle) navToggle.addEventListener("click", () => {
  drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
});
if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);
if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

window.addEventListener("scroll", () => {
  if (!backToTopBtn) return;
  backToTopBtn.classList.toggle("is-visible", window.scrollY > 400);
});

function initObserver() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id) setActiveLinks(entry.target.id);
    }),
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );
  document.querySelectorAll("main .menu-section").forEach((s) => observer.observe(s));
}

// ── Renderizado dinámico ──

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function renderItem(item) {
  const li = document.createElement("li");
  li.className = "menu-item";

  const main = document.createElement("div");
  main.className = "menu-item-main";

  const name = document.createElement("p");
  name.className = "menu-item-name";
  name.textContent = item.name;
  main.appendChild(name);

  if (item.desc) {
    const desc = document.createElement("p");
    desc.className = "menu-item-desc";
    desc.innerHTML = esc(item.desc).replace(/\n/g, "<br />");
    main.appendChild(desc);
  }

  li.appendChild(main);

  if (item.prices) {
    const isComplex = item.prices.includes(" · ");
    if (isComplex && !item.desc) {
      const desc = document.createElement("p");
      desc.className = "menu-item-desc";
      desc.textContent = item.prices;
      main.appendChild(desc);
    } else if (isComplex && item.desc) {
      const desc = document.createElement("p");
      desc.className = "menu-item-desc";
      desc.textContent = item.prices;
      main.appendChild(desc);
    } else {
      const price = document.createElement("p");
      price.className = "menu-item-price";
      price.textContent = item.prices;
      li.appendChild(price);
    }
  }

  return li;
}

function renderGroup(group) {
  const frag = document.createDocumentFragment();

  if (group.title) {
    const h3 = document.createElement("h3");
    h3.className = "menu-group-title";
    h3.textContent = group.title;
    frag.appendChild(h3);
  }

  if (group.note) {
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = group.note;
    frag.appendChild(note);
  }

  const ul = document.createElement("ul");
  ul.className = "menu-items";
  group.items
    .filter((i) => i.active)
    .forEach((item) => ul.appendChild(renderItem(item)));
  frag.appendChild(ul);

  return frag;
}

function renderSection(sec) {
  const section = document.createElement("section");
  section.id = sec.id;
  section.className = "menu-section";

  const h2 = document.createElement("h2");
  h2.textContent = sec.title;
  section.appendChild(h2);

  if (sec.note) {
    const note = document.createElement("p");
    note.className = "note";
    if (sec.note.includes("€") || sec.note.includes("Salsa")) {
      note.innerHTML = sec.note.replace(/(Salsa a elegir \d+,\d+€)/, "<strong>$1</strong>");
    } else {
      note.textContent = sec.note;
    }
    section.appendChild(note);
  }

  sec.groups
    .filter((g) => g.active)
    .forEach((group) => section.appendChild(renderGroup(group)));

  return section;
}

function updateNav(sections) {
  const navLinks = document.getElementById("nav-links");
  const drawerLinksList = document.querySelector(".nav-drawer-links");
  if (!navLinks || !drawerLinksList) return;

  navLinks.innerHTML = "";
  drawerLinksList.innerHTML = "";

  sections.forEach((sec) => {
    const li1 = document.createElement("li");
    const a1 = document.createElement("a");
    a1.href = `#${sec.id}`;
    a1.textContent = sec.title;
    li1.appendChild(a1);
    navLinks.appendChild(li1);

    const li2 = document.createElement("li");
    const a2 = document.createElement("a");
    a2.href = `#${sec.id}`;
    a2.textContent = sec.title;
    a2.addEventListener("click", closeDrawer);
    li2.appendChild(a2);
    drawerLinksList.appendChild(li2);
  });
}

async function loadDynamicMenu() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.sections || !data.sections.length) throw new Error("Sin secciones");

    const activeSections = data.sections.filter((s) => s.active);
    const main = document.querySelector("main.menu");
    if (!main) return;

    main.innerHTML = "";
    activeSections.forEach((sec) => main.appendChild(renderSection(sec)));

    updateNav(activeSections);
    initObserver();
  } catch {
    // Fallback: el HTML estático ya está cargado, no hacer nada
    initObserver();
  }
}

// ── Inicio ──

loadDynamicMenu();
