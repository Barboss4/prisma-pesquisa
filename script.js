const SITE_CONFIG = window.PRISMA_CONFIG || Object.freeze({
  brandName: "Prisma Pesquisa", positioning: "Dados, Tecnologia e Pesquisa",
  operationalEmail: "tccanapolis@gmail.com", whatsappNumber: "5562992818326", whatsappDisplay: "(62) 99281-8326"
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const menu = document.getElementById("menu-principal");
const backToTop = document.getElementById("back-to-top");

document.querySelectorAll("[data-brand]").forEach((el) => { el.textContent = SITE_CONFIG.brandName; });
document.querySelectorAll("[data-positioning]").forEach((el) => { el.textContent = SITE_CONFIG.positioning; });
document.querySelectorAll("[data-contact-email]").forEach((el) => {
  el.textContent = SITE_CONFIG.operationalEmail;
  if (el.matches("a")) el.href = `mailto:${SITE_CONFIG.operationalEmail}`;
});
document.querySelectorAll("[data-whatsapp-display]").forEach((el) => { el.textContent = SITE_CONFIG.whatsappDisplay; });
document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
  const message = el.dataset.message || "Olá! Gostaria de solicitar um orçamento para meu projeto.";
  el.href = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
});
document.querySelectorAll("[data-current-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

const closeMenu = () => {
  if (!menu || !menuButton) return;
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  const label = menuButton.querySelector(".sr-only");
  if (label) label.textContent = "Abrir menu";
};

if (menu && menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    const label = menuButton.querySelector(".sr-only");
    if (label) label.textContent = isOpen ? "Fechar menu" : "Abrir menu";
  });
  menu.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
  document.addEventListener("click", (event) => {
    if (menu.classList.contains("open") && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) { closeMenu(); menuButton.focus(); }
  });
}

// Preserva os hrefs para acessibilidade, mas evita fragmentos em cliques na página atual.
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href*="#"]');
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
  let url;
  try { url = new URL(link.href, window.location.href); } catch { return; }
  const samePage = url.origin === location.origin && url.pathname === location.pathname && url.search === location.search;
  if (!samePage || !url.hash || url.hash === "#") return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  event.preventDefault();
  closeMenu();
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  if (target.matches("main, section")) {
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  }
});

const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const navSections = [...document.querySelectorAll("main section[id]")];
const updateScrollUI = () => {
  if (siteHeader) siteHeader.classList.toggle("scrolled", scrollY > 12);
  if (backToTop) {
    const show = scrollY > 500;
    backToTop.classList.toggle("show", show);
    backToTop.setAttribute("aria-hidden", String(!show));
    backToTop.tabIndex = show ? 0 : -1;
  }
  if (!navLinks.length) return;
  let current = "";
  navSections.forEach((section) => { if (section.offsetTop <= scrollY + 170) current = section.id; });
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${current}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
  });
};
addEventListener("scroll", updateScrollUI, { passive: true });
addEventListener("resize", updateScrollUI);
updateScrollUI();

const serviceSelect = document.getElementById("servico");
const serviceGuide = document.getElementById("service-guide");
const needQuestion = document.getElementById("need-question");
const needOptions = document.getElementById("need-options");
const serviceGuideCopy = document.getElementById("service-guide-copy");
const formStatus = document.getElementById("form-status");

const serviceGuidance = {
  "Não sei qual serviço preciso": ["Qual situação descreve melhor o seu momento?", "Não tem problema se nenhuma opção for exata. A resposta serve para direcionar a conversa inicial.", ["Tenho dados e preciso entender o que fazer", "Quero automatizar uma tarefa repetitiva", "Preciso criar uma ferramenta ou presença digital", "Preciso estruturar uma pesquisa", "Prefiro explicar com minhas palavras"]],
  "Análise estatística": ["Qual é a principal necessidade com os dados?", "A avaliação pode abranger desde o plano de análise até a interpretação dos resultados.", ["Escolher testes adequados", "Realizar a análise", "Interpretar resultados", "Revisar uma análise existente", "Ainda não sei qual análise preciso"]],
  "Automação de planilhas e processos": ["O que mais consome tempo na rotina atual?", "Conte como os arquivos chegam e qual resultado deve ser gerado.", ["Consolidar planilhas", "Limpar e padronizar dados", "Gerar relatórios automaticamente", "Processar CSV ou XLSX", "Integrar etapas de um fluxo"]],
  "Dashboards e Business Intelligence": ["O que o painel precisa ajudar a acompanhar?", "Indicadores, fontes de dados e frequência de atualização ajudam a definir o escopo.", ["Indicadores de desempenho", "Resultados de pesquisa", "Vendas ou operações", "Relatórios recorrentes", "Ainda preciso definir os indicadores"]],
  "Desenvolvimento em Python": ["Que tipo de solução você imagina?", "Mesmo sem uma especificação técnica, descreva a tarefa e o resultado esperado.", ["Script para processar dados", "Automação de cálculos", "Aplicação de apoio à pesquisa", "Integração com API", "Ferramenta para rotina profissional"]],
  "Criação de sites e sistemas": ["Qual presença ou ferramenta digital você precisa?", "A avaliação considera público, conteúdo, funcionalidades e manutenção.", ["Site institucional", "Landing page", "Site para laboratório ou evento", "Formulário ou cadastro", "Sistema web personalizado"]],
  "Automações com inteligência artificial": ["Em qual fluxo a IA pode apoiar?", "A viabilidade depende dos dados, integrações, revisão humana e nível de risco.", ["Classificar documentos", "Extrair informações", "Apoiar atendimento interno", "Automatizar fluxo de trabalho", "Avaliar uma ideia de aplicação"]],
  "Consultoria científica e metodológica": ["Qual etapa da pesquisa precisa de estrutura?", "O suporte é técnico e consultivo; autoria e decisões científicas permanecem com o pesquisador.", ["Planejamento metodológico", "Métodos quantitativos", "Organização de dados", "Reprodutibilidade", "Revisão do plano de análise"]],
  "Gráficos e visualização científica": ["Onde as visualizações serão utilizadas?", "O formato é planejado para o tipo de dado, o público e o canal de publicação.", ["Artigo científico", "Relatório técnico", "Apresentação", "Dashboard", "Melhorar figuras existentes"]],
  "Machine Learning e modelagem preditiva": ["Em que etapa está o projeto de modelagem?", "A avaliação considera qualidade dos dados, objetivo, validação e interpretabilidade.", ["Preparar dados", "Selecionar modelos", "Classificação", "Regressão", "Validar e interpretar resultados"]],
  "Outro serviço": ["Qual resultado você precisa alcançar?", "Descreva o problema com suas palavras; indicaremos o caminho técnico mais adequado.", ["Organizar dados", "Automatizar processo", "Criar ferramenta", "Apoiar pesquisa", "Outra necessidade"]]
};

const updateServiceGuide = () => {
  if (!serviceSelect || !serviceGuide || !needOptions) return;
  const guidance = serviceGuidance[serviceSelect.value];
  needOptions.replaceChildren();
  if (!guidance) { serviceGuide.hidden = true; return; }
  needQuestion.textContent = guidance[0];
  serviceGuideCopy.textContent = guidance[1];
  guidance[2].forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "choice-option";
    const input = document.createElement("input");
    input.type = "radio"; input.name = "necessidade"; input.value = option; input.required = index === 0;
    const text = document.createElement("span");
    text.textContent = option;
    label.append(input, text); needOptions.append(label);
  });
  serviceGuide.hidden = false;
};

if (serviceSelect) {
  serviceSelect.addEventListener("change", () => { updateServiceGuide(); if (formStatus) formStatus.textContent = ""; });
  const requestedService = new URLSearchParams(location.search).get("servico");
  if (requestedService && [...serviceSelect.options].some((option) => option.value === requestedService)) {
    serviceSelect.value = requestedService;
    updateServiceGuide();
    if (formStatus) formStatus.textContent = `Serviço selecionado: ${requestedService}.`;
    history.replaceState(null, "", location.pathname);
  }
}

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!serviceSelect) return;
    serviceSelect.value = link.dataset.service; updateServiceGuide();
    if (formStatus) formStatus.textContent = `Serviço selecionado: ${link.dataset.service}.`;
  });
});

const briefForm = document.getElementById("brief-form");
if (briefForm) {
  briefForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!briefForm.reportValidity()) return;
    const data = new FormData(briefForm);
    if (data.get("website")) return;
    const message = ["Olá! Gostaria de solicitar um orçamento para meu projeto.", "", `Nome: ${data.get("nome")}`, `E-mail: ${data.get("email")}`, `WhatsApp/telefone: ${data.get("telefone") || "Não informado"}`, `Serviço: ${data.get("servico")}`, `Principal necessidade: ${data.get("necessidade") || "Preciso de orientação"}`, `Prazo desejado: ${data.get("prazo")}`, `Descrição: ${data.get("detalhes")}`].join("\n");
    const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    const fallback = document.getElementById("whatsapp-fallback");
    if (fallback) { fallback.href = whatsappUrl; fallback.hidden = false; }
    if (formStatus) formStatus.textContent = "Solicitação preparada. Abrindo o WhatsApp para você revisar e enviar a mensagem…";
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, current) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); current.unobserve(entry.target); } });
  }, { threshold: 0.1, rootMargin: "0px 0px -28px" });
  document.querySelectorAll("[data-reveal]").forEach((el, index) => {
    el.classList.add("reveal"); el.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 50}ms`); observer.observe(el);
  });
}
