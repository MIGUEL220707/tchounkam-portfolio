/* ==========================================================================
   Portfolio — TCHOUNKAM Miguel
   ==========================================================================

   ► MODIFIEZ UNIQUEMENT LA ZONE « CONFIG » CI-DESSOUS APRÈS L'HÉBERGEMENT
   --------------------------------------------------------------------------
   - liens et captures des sites démo : voir la section Réalisations dans index.html
   - github, linkedin, cv : laissez "" pour masquer le bouton
   ========================================================================== */
const CONFIG = {
  whatsapp: "237679884015",
  email: "tchounkammiguel@gmail.com",
  github: "", // ex : "https://github.com/votre-pseudo"
  linkedin: "", // ex : "https://www.linkedin.com/in/votre-profil"
  cv: "", // ex : "cv-tchounkam-miguel.pdf"
};
/* ==========================================================================
   FIN DE LA ZONE À MODIFIER
   ========================================================================== */

document.documentElement.classList.add("js");

/* ---------- Utilitaires ---------- */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* ---------- Liens de contact ---------- */
function setupLinks() {
  const whatsappUrl = `https://wa.me/${CONFIG.whatsapp}`;

  $("#waLink").href = whatsappUrl;
  $("#waFloat").href = whatsappUrl;
  $("#mailLink").href = `mailto:${CONFIG.email}`;

  // Affiche le lien seulement s'il est renseigné dans CONFIG
  const toggleLink = (selector, url) => {
    const link = $(selector);

    if (url) {
      link.href = url;
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  };

  toggleLink("#ghLink", CONFIG.github);
  toggleLink("#liLink", CONFIG.linkedin);

  const cvButton = $("#cvBtn");

  if (CONFIG.cv) {
    cvButton.href = CONFIG.cv;
    cvButton.hidden = false;
  }
}

/* ---------- Photo de secours (initiales si moi.jpg est absent) ---------- */
function setupPhoto() {
  const image = $("#photo");
  const frame = image.closest(".photo");
  const showFallback = () => frame.classList.add("no-img");

  image.addEventListener("error", showFallback);

  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
}

/* ---------- Navigation ---------- */
function setupNav() {
  const nav = $("#nav");
  const burger = $("#burger");
  const header = $("#header");

  // Ouvre ou ferme le menu mobile (et bloque le défilement de la page derrière)
  const setMenu = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  };

  const closeMenu = () => setMenu(false);

  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));

  $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // Toucher en dehors du menu le referme
  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || burger.contains(event.target)) return;

    closeMenu();
  });

  // Referme le menu si l'écran s'agrandit (rotation, redimensionnement)
  window.matchMedia("(min-width: 1025px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  // Fond de l'en-tête dès que la page défile
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Lien actif selon la section visible
  const links = $$("a[href^='#']", nav).filter((link) => !link.classList.contains("btn"));
  const linkById = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => link.classList.remove("is-active"));
        linkById.get(entry.target.id)?.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  linkById.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

/* ---------- Apparition au scroll ---------- */
function setupReveal() {
  const items = $$(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 80}ms`;
    observer.observe(item);
  });
}

/* ---------- Formulaire de contact ---------- */
function setupForm() {
  const form = $("#form");
  const note = $("#formNote");

  // Chaque règle renvoie un message d'erreur, ou "" si le champ est valide
  const rules = {
    name: (value) => (value.trim().length >= 2 ? "" : "Veuillez indiquer votre nom."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ""
        : "Veuillez saisir une adresse e-mail valide.",
    message: (value) =>
      value.trim().length >= 10 ? "" : "Décrivez brièvement votre projet (10 caractères minimum).",
  };

  const showError = (field, message) => {
    const input = form.elements[field];

    $(`.err[data-for="${field}"]`).textContent = message;
    input.closest(".field").classList.toggle("invalid", Boolean(message));
  };

  const validate = () => {
    let isValid = true;

    Object.keys(rules).forEach((field) => {
      const message = rules[field](form.elements[field].value);

      showError(field, message);
      if (message) isValid = false;
    });

    return isValid;
  };

  const buildMessage = () => {
    const { name, email, message } = form.elements;

    return [
      "Bonjour Miguel,",
      "",
      `Je suis ${name.value.trim()} (${email.value.trim()}).`,
      "",
      "Mon projet :",
      message.value.trim(),
    ].join("\n");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validate()) {
      note.textContent = "";
      return;
    }

    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(buildMessage())}`;

    window.open(url, "_blank", "noopener");
    note.textContent = "WhatsApp s'ouvre avec votre message prêt à envoyer.";
  });

  $("#sendMail").addEventListener("click", () => {
    if (!validate()) {
      note.textContent = "";
      return;
    }

    const subject = encodeURIComponent("Demande de projet web");
    const body = encodeURIComponent(buildMessage());

    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
    note.textContent = "Votre application e-mail s'ouvre avec le message prêt à envoyer.";
  });

  // Efface l'erreur dès que le champ redevient valide
  form.addEventListener("input", (event) => {
    const field = event.target.name;

    if (rules[field] && !rules[field](event.target.value)) {
      showError(field, "");
    }
  });
}

/* ---------- Démarrage ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  setupLinks();
  setupPhoto();
  setupNav();
  setupReveal();
  setupForm();
});
