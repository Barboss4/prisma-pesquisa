// Dados centrais para facilitar uma futura mudança de marca e de contato.
const SITE_CONFIG = Object.freeze({ brandName: "Prisma Pesquisa", whatsappNumber: "5562992818326" });

document.querySelectorAll("[data-brand]").forEach((element) => {
  const [name, ...complement] = SITE_CONFIG.brandName.split(" ");
  element.innerHTML = complement.length ? `${name} <span>${complement.join(" ")}</span>` : name;
});
document.getElementById("current-year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-button");
const menu = document.getElementById("menu-principal");
const closeMenu = () => {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector(".sr-only").textContent = "Abrir menu";
};

menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Fechar menu" : "Abrir menu";
});
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (menu.classList.contains("open") && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

const backToTop = document.getElementById("back-to-top");
const siteHeader = document.querySelector(".site-header");
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const navSections = [...document.querySelectorAll("main section[id]")];
const updateScrollUI = () => {
  const scrollMarker = window.scrollY + 160;
  let currentSection = null;
  navSections.forEach((section) => {
    if (section.offsetTop <= scrollMarker) currentSection = section.id;
  });
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  backToTop.classList.toggle("show", window.scrollY > 500);
  siteHeader.classList.toggle("scrolled", window.scrollY > 12);
};
window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

const serviceSelect = document.getElementById("servico");
const formStatus = document.getElementById("form-status");
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    serviceSelect.value = link.dataset.service;
    formStatus.textContent = `Serviço selecionado: ${link.dataset.service}.`;
  });
});

document.getElementById("brief-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "Olá! Gostaria de solicitar uma avaliação e um orçamento para meu projeto.", "",
    `Serviço: ${data.get("servico")}`,
    `Prazo desejado: ${data.get("prazo")}`,
    `Etapa do projeto: ${data.get("etapa") || "Não informada"}`,
    `Resumo: ${data.get("detalhes")}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const fallbackLink = document.getElementById("whatsapp-fallback");
  fallbackLink.href = whatsappUrl;
  fallbackLink.hidden = false;
  formStatus.textContent = "Abrindo uma conversa no WhatsApp…";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealTargets = document.querySelectorAll(".section-heading, .service-card, .steps li, .values-grid article, .faq-list details, .brief-form, .contact-links a");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px" });

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
    revealObserver.observe(element);
  });
}
