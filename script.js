/* ==========================================================================
   BLOOM STUDIO — SCRIPT
   Funcionalidades: header dinâmico, menu mobile, scroll reveal (efeito
   "entrando em foco"), revelação da galeria em "clareamento de espelho",
   filtros de galeria, accordion (não usado aqui, reservado), formulário
   demonstrativo, newsletter e botão voltar ao topo.
   Projeto estático — sem backend. Todas as ações de envio são simuladas.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: efeito ao rolar ---------- */
  const header = document.getElementById('header');
  const onScrollHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Filtro de galeria ---------- */
  const filterButtons = document.querySelectorAll('.filter');
  const galleryItems = document.querySelectorAll('.g-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.filter === filter;
        item.classList.toggle('is-hidden', !match);
        // reanima a revelação ao trocar de filtro, caso o item volte a aparecer
        if (match) {
          item.classList.remove('is-visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => item.classList.add('is-visible'));
          });
        }
      });
    });
  });

  /* ---------- Formulário de contato (demonstrativo, sem backend) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const formSubmit = document.getElementById('formSubmit');

  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      if (!contactForm.checkValidity()) {
        formNote.textContent = 'Preencha os campos obrigatórios para continuar.';
        formNote.style.color = '#B4432E';
        return;
      }
      const originalText = formSubmit.textContent;
      formSubmit.textContent = 'Enviando...';
      formSubmit.disabled = true;

      setTimeout(() => {
        formNote.style.color = '';
        formNote.textContent = 'Solicitação enviada! Em breve entraremos em contato para confirmar seu horário. (Formulário demonstrativo)';
        formSubmit.textContent = originalText;
        formSubmit.disabled = false;
        contactForm.reset();
      }, 900);
    });
  }

  /* ---------- Newsletter (demonstrativo) ---------- */
  const newsletterForm = document.querySelector('.newsletter');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', () => {
      const input = newsletterForm.querySelector('input');
      if (input.value) {
        input.value = '';
        input.placeholder = 'Inscrição confirmada ✓';
        setTimeout(() => { input.placeholder = 'Seu melhor e-mail'; }, 3000);
      }
    });
  }

  /* ---------- Botão voltar ao topo ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 700);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Fallback de imagens externas ----------
     Caso alguma imagem do Unsplash falhe ao carregar, substitui por um
     placeholder elegante em tons da marca, mantendo a experiência visual
     consistente mesmo sem conexão com a fonte externa. */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function handler() {
      this.removeEventListener('error', handler);
      this.src = 'data:image/svg+xml,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
          <rect width="600" height="600" fill="#F1D3C9"/>
          <circle cx="300" cy="255" r="90" fill="none" stroke="#C79A4B" stroke-width="2"/>
          <path d="M240 380 q60 -50 120 0" fill="none" stroke="#C79A4B" stroke-width="2"/>
        </svg>`
      );
      this.style.objectFit = 'cover';
      this.alt = 'Imagem indisponível';
    }, { once: true });
  });

});
