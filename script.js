(() => {
  'use strict';

  const CONFIG = {
    whatsappNumber: '237679884015',
    email: 'tchounkammiguel@gmail.com'
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const header = $('#header');
  const menuToggle = $('#menuToggle');
  const nav = $('#mainNav');
  const backToTop = $('#backToTop');
  const year = $('#year');
  const form = $('#contactForm');
  const formStatus = $('#formStatus');
  const modal = $('#projectModal');
  const modalTitle = $('#modalTitle');
  const modalDescription = $('#modalDescription');
  const modalStack = $('#modalStack');
  const modalEyebrow = $('#modalEyebrow');

  year.textContent = new Date().getFullYear();

  // --- Menu mobile ---
  const closeMenu = () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  $$('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

  // --- Header, liens actifs & retour haut ---
  const updateScrollUI = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
    backToTop.classList.toggle('visible', window.scrollY > 650);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const navSections = $$('main section[id]');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-36% 0px -55% 0px', threshold: 0.01 });
  navSections.forEach(section => navObserver.observe(section));

  // --- Apparition au scroll ---
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // --- Modale projets ---
  const projects = {
    portfolio: {
      eyebrow: 'RÉALISATION 01',
      title: 'Portfolio personnel moderne',
      description: 'Un portfolio conçu en HTML5, CSS3 et JavaScript Vanilla : direction artistique dark premium, animations natives, navigation mobile, formulaire de contact et composants sans framework.',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive', 'UI Design']
    },
    business: {
      eyebrow: 'RÉALISATION 02',
      title: 'Site vitrine professionnel',
      description: 'Concept de présence digitale pour une entreprise ou une activité indépendante : storytelling clair, sections de confiance et appels à l’action visibles sur mobile comme sur desktop.',
      stack: ['Landing page', 'Responsive', 'CTA', 'UI Design']
    },
    education: {
      eyebrow: 'RÉALISATION 03',
      title: 'Site web éducatif',
      description: 'Concept d’interface éducative avec parcours d’apprentissage, ressources et blocs de contenu structurés pour rendre l’information plus simple à parcourir.',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'UX', 'Interaction']
    }
  };

  const openModal = key => {
    const project = projects[key];
    if (!project) return;
    modalEyebrow.textContent = project.eyebrow;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalStack.innerHTML = project.stack.map(item => `<span>${item}</span>`).join('');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };

  $$('.project-details').forEach(button => button.addEventListener('click', () => openModal(button.dataset.project)));
  $$('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // --- Formulaire : validation + préparation WhatsApp & e-mail ---
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.addEventListener('submit', event => {
    event.preventDefault();
    formStatus.className = 'form-status';

    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Veuillez compléter tous les champs.';
      formStatus.classList.add('error');
      return;
    }

    if (!isValidEmail(email)) {
      formStatus.textContent = 'Veuillez saisir une adresse e-mail valide.';
      formStatus.classList.add('error');
      return;
    }

    const subject = `Demande de projet — ${name}`;
    const body = [
      'Bonjour Miguel,',
      '',
      `Nom : ${name}`,
      `Email : ${email}`,
      '',
      'Projet / besoin :',
      message,
      '',
      'Message envoyé depuis le portfolio de TCHOUNKAM Miguel.'
    ].join('\n');

    const whatsappText = encodeURIComponent(body);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${whatsappText}`;
    const mailtoUrl = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = 'Préparation de l’envoi vers WhatsApp et votre messagerie…';
    formStatus.classList.add('success');

    // Ouvre WhatsApp dans un nouvel onglet puis prépare le message e-mail.
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => { window.location.href = mailtoUrl; }, 450);
  });

  // --- Canvas : réseau numérique léger ---
  const canvas = $('#networkCanvas');
  const ctx = canvas?.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (ctx && !reducedMotion) {
    const points = [];
    const density = Math.min(70, Math.floor(window.innerWidth / 22));
    const pointer = { x: null, y: null };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const seed = () => {
      points.length = 0;
      for (let i = 0; i < density; i += 1) {
        points.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.13,
          vy: (Math.random() - 0.5) * 0.13,
          r: Math.random() * 1.25 + 0.35
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20 || p.x > window.innerWidth + 20) p.vx *= -1;
        if (p.y < -20 || p.y > window.innerHeight + 20) p.vy *= -1;
      }

      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(123, 168, 255, .38)';
        ctx.fill();

        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 130) continue;
          const alpha = (1 - dist / 130) * 0.08;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(78, 156, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', () => { resize(); seed(); });
    window.addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; });
    resize();
    seed();
    draw();
  }
})();
