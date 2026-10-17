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
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  const showBackToTop = window.scrollY > 500;
  backToTop.classList.toggle("show", showBackToTop);
  backToTop.setAttribute("aria-hidden", String(!showBackToTop));
  backToTop.tabIndex = showBackToTop ? 0 : -1;
  siteHeader.classList.toggle("scrolled", window.scrollY > 12);
};
window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
backToTop.addEventListener("click", (event) => {
  event.preventDefault();
  try {
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
  } catch {
    window.scrollTo(0, 0);
  }
  if (window.location.hash) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
});
updateScrollUI();

const serviceSelect = document.getElementById("servico");
const formStatus = document.getElementById("form-status");
const serviceGuide = document.getElementById("service-guide");
const needQuestion = document.getElementById("need-question");
const needOptions = document.getElementById("need-options");
const serviceGuideCopy = document.getElementById("service-guide-copy");
const detailsField = document.getElementById("detalhes");

const serviceGuidance = {
  "Não sei qual serviço preciso": {
    question: "Qual situação descreve melhor o seu momento?",
    copy: "Não tem problema se nenhuma opção for exata. A equipe usa essa resposta apenas para direcionar a conversa inicial.",
    placeholder: "Se quiser, conte com suas palavras qual é a dificuldade.",
    options: ["Preciso definir como conduzir a pesquisa", "Tenho dados e não sei como analisá-los", "Preciso melhorar ou adequar um texto", "Preciso apresentar resultados com clareza", "Minha situação é diferente dessas"]
  },
  "Análise estatística e interpretação": {
    question: "Com qual parte da análise você precisa de ajuda?",
    copy: "Você pode solicitar desde o planejamento dos testes até a interpretação de resultados já obtidos.",
    placeholder: "Ex.: tipo de dados, tamanho da amostra ou análise que já tentou fazer.",
    options: ["Escolher os testes adequados", "Realizar a análise dos dados", "Interpretar resultados", "Revisar uma análise já feita", "Ainda não sei qual análise preciso"]
  },
  "Metodologia científica": {
    question: "Qual ponto da metodologia precisa de mais clareza?",
    copy: "A avaliação considera a pergunta de pesquisa, os objetivos e o desenho mais adequado para o estudo.",
    placeholder: "Ex.: tema, pergunta de pesquisa ou exigência da instituição.",
    options: ["Definir problema e objetivos", "Escolher o desenho do estudo", "Definir amostra ou participantes", "Revisar a metodologia", "Ainda não sei por onde começar"]
  },
  "Tratamento e análise de dados": {
    question: "O que precisa acontecer com a sua base de dados?",
    copy: "Podemos avaliar bases em diferentes estágios, inclusive quando ainda precisam ser organizadas antes da análise.",
    placeholder: "Ex.: formato da planilha, origem dos dados ou dificuldade encontrada.",
    options: ["Organizar ou limpar a base", "Codificar variáveis e respostas", "Juntar ou estruturar planilhas", "Explorar e compreender os dados", "Não sei como preparar os dados"]
  },
  "Revisão e formatação acadêmica": {
    question: "Que tipo de adequação o material precisa?",
    copy: "Se houver um manual da instituição ou do periódico, ele poderá ser considerado na avaliação do escopo.",
    placeholder: "Ex.: tipo de trabalho, norma solicitada ou quantidade aproximada de páginas.",
    options: ["Revisão de clareza e escrita", "Formatação ABNT", "APA ou outra norma", "Citações e referências", "Revisão e formatação completas"]
  },
  "Gráficos e visualizações científicas": {
    question: "Que resultado visual você precisa preparar?",
    copy: "As visualizações são planejadas conforme o tipo de dado, o público e o meio de apresentação.",
    placeholder: "Ex.: dados disponíveis, software utilizado ou onde o material será apresentado.",
    options: ["Gráficos para resultados", "Tabelas científicas", "Gráficos e tabelas", "Melhorar visuais existentes", "Ainda não sei qual visual usar"]
  },
  "Consultoria para artigo, dissertação ou tese": {
    question: "Em qual parte do trabalho você precisa de orientação?",
    copy: "O suporte é técnico e consultivo; autoria, conteúdo intelectual e decisões acadêmicas permanecem com o pesquisador.",
    placeholder: "Ex.: tipo de trabalho, seção que está desenvolvendo ou principal dificuldade.",
    options: ["Estrutura e organização", "Metodologia", "Resultados e discussão", "Adequação para submissão", "Revisão geral e próximos passos"]
  },
  "Apresentação acadêmica": {
    question: "Para qual situação a apresentação será preparada?",
    copy: "A avaliação pode considerar narrativa, seleção de conteúdo, clareza visual e adequação ao tempo disponível.",
    placeholder: "Ex.: tipo de apresentação, duração prevista ou quantidade atual de slides.",
    options: ["Defesa ou banca", "Congresso ou seminário", "Apresentação de projeto", "Revisar slides existentes", "Organizar roteiro e conteúdo"]
  },
  "Outro serviço de apoio à pesquisa": {
    question: "Qual destas opções mais se aproxima da demanda?",
    copy: "Se a necessidade estiver dentro de um suporte acadêmico legítimo, a equipe indicará a melhor forma de atendimento.",
    placeholder: "Conte brevemente o que você precisa e o resultado que espera alcançar.",
    options: ["Planejamento da pesquisa", "Análise ou organização de materiais", "Revisão técnica", "Comunicação de resultados", "Prefiro explicar com minhas palavras"]
  }
};

const updateServiceGuide = () => {
  const guidance = serviceGuidance[serviceSelect.value];
  needOptions.replaceChildren();
  if (!guidance) {
    serviceGuide.hidden = true;
    detailsField.placeholder = "Ex.: o que já foi feito, quais materiais você possui ou qual é a sua maior dúvida.";
    return;
  }

  needQuestion.textContent = guidance.question;
  serviceGuideCopy.textContent = guidance.copy;
  detailsField.placeholder = guidance.placeholder;
  guidance.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "choice-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "necessidade";
    input.value = option;
    input.required = index === 0;
    const text = document.createElement("span");
    text.textContent = option;
    label.append(input, text);
    needOptions.append(label);
  });
  serviceGuide.hidden = false;
};

serviceSelect.addEventListener("change", () => {
  updateServiceGuide();
  formStatus.textContent = "";
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    serviceSelect.value = link.dataset.service;
    updateServiceGuide();
    formStatus.textContent = `Serviço selecionado: ${link.dataset.service}.`;
  });
});

document.getElementById("brief-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "Olá! Gostaria de solicitar uma avaliação e um orçamento para meu projeto.", "",
    `Serviço: ${data.get("servico")}`,
    `Principal necessidade: ${data.get("necessidade") || "Preciso de orientação"}`,
    `Prazo desejado: ${data.get("prazo")}`,
    `Etapa do projeto: ${data.get("etapa")}`,
    `Contexto adicional: ${data.get("detalhes") || "Não informado"}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const fallbackLink = document.getElementById("whatsapp-fallback");
  fallbackLink.href = whatsappUrl;
  fallbackLink.hidden = false;
  formStatus.textContent = "Abrindo uma conversa no WhatsApp…";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

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
