// ==========================================================================
// NORTESOL ENGENHARIA — INTERATIVIDADE & CONVERSÃO
// Calculadora de ROI, Menu Mobile, Carrossel com Swipe, Scroll Reveal
// ==========================================================================

function initNorteSol() {

  // === 1. HEADER SCROLL EFFECT ===
  const header = document.getElementById('header');
  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // === 2. HAMBURGER MENU (MOBILE & ACESSIBILIDADE) ===
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Fechar ao clicar em qualquer link interno
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Fechar ao tocar fora do menu no mobile
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // === 3. SCROLL REVEAL SUAVE ===
  const revealElements = document.querySelectorAll(
    '.step-item, .garantia-card, .garantia-text, .servico-card, .depoimento-card, .sobre-text, .sobre-visual, .pillar, .hero-proof-strip'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(el => observer.observe(el));

  // === 4. CALCULADORA DE ROI SOLAR ===
  const calcBtn = document.getElementById('calcular-btn');
  const contaInput = document.getElementById('conta-luz');
  const tipoSelect = document.getElementById('tipo-imovel');
  const resultPlaceholder = document.getElementById('result-placeholder');
  const resultData = document.getElementById('result-data');

  function formatMoney(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function calcular() {
    if (!contaInput) return;
    const conta = parseFloat(contaInput.value);

    if (!conta || conta < 50) {
      contaInput.focus();
      const parent = contaInput.closest('.input-money');
      if (parent) {
        parent.style.borderColor = '#ff4444';
        setTimeout(() => { parent.style.borderColor = ''; }, 2000);
      }
      return;
    }

    const consumoRadio = document.querySelector('input[name="consumo"]:checked');
    const consumo = consumoRadio ? consumoRadio.value : 'medio';
    const tipo = tipoSelect ? tipoSelect.value : 'comercial';

    // Taxa de redução na conta
    const taxaEconomia = { baixo: 0.85, medio: 0.92, alto: 0.95 }[consumo] || 0.92;

    // Custo estimado do kWp instalado
    const custoKwp = { residencial: 4500, comercial: 4000, industrial: 3700, rural: 4200 }[tipo] || 4000;

    // Tarifa média kWh Norte/Nordeste
    const tarifaKwh = 0.82;

    // Consumo estimado em kWh
    const consumoMensalKwh = conta / tarifaKwh;

    // Potência necessária (kWp) considerando HSP de 5.2h
    const potencia = (consumoMensalKwh / (5.2 * 30)).toFixed(2);

    // Economia financeira estimada
    const economiaMensal = conta * taxaEconomia;
    const economiaAnual = economiaMensal * 12;
    const economia25 = economiaAnual * 25 * 1.06;

    // Payback estimado em anos
    const custoEstimado = parseFloat(potencia) * custoKwp;
    const retornoAnos = Math.max(2.6, (custoEstimado / economiaAnual));

    // Impacto ambiental
    const arvores = Math.max(12, Math.round((consumoMensalKwh * 12 * 0.4) / 22));

    // Atualização do DOM
    const elMensal = document.getElementById('res-mensal');
    const elAnual = document.getElementById('res-anual');
    const el25anos = document.getElementById('res-25anos');
    const elRetorno = document.getElementById('res-retorno');
    const elPotencia = document.getElementById('res-potencia');
    const elCo2 = document.getElementById('res-co2');
    const ctaResultado = document.getElementById('resultado-cta');

    if (elMensal) elMensal.textContent = formatMoney(economiaMensal);
    if (elAnual) elAnual.textContent = formatMoney(economiaAnual);
    if (el25anos) el25anos.textContent = formatMoney(economia25);
    if (elRetorno) elRetorno.textContent = `${retornoAnos.toFixed(1)} anos`;
    if (elPotencia) elPotencia.textContent = `${potencia} kWp`;
    if (elCo2) elCo2.textContent = arvores;

    // Link WhatsApp personalizado
    if (ctaResultado) {
      const msg = encodeURIComponent(
        `Olá! Fiz a simulação no site da NorteSol Engenharia.\n\n` +
        `• Minha conta média: ${formatMoney(conta)}/mês\n` +
        `• Tipo de imóvel: ${tipo.toUpperCase()}\n` +
        `• Economia estimada: ${formatMoney(economiaMensal)}/mês\n` +
        `• Retorno estimado: ${retornoAnos.toFixed(1)} anos\n` +
        `• Potência sugerida: ${potencia} kWp\n\n` +
        `Gostaria de receber a proposta oficial!`
      );
      ctaResultado.href = `https://wa.me/556981633399?text=${msg}`;
    }

    // Exibir bloco de resultado
    if (resultPlaceholder) resultPlaceholder.classList.add('hidden');
    if (resultData) resultData.classList.remove('hidden');

    // Scroll suave para visualização no mobile
    if (window.innerWidth <= 768) {
      const resultBox = document.getElementById('calc-result');
      if (resultBox) {
        setTimeout(() => {
          resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
      }
    }
  }

  if (calcBtn) calcBtn.addEventListener('click', calcular);
  if (contaInput) {
    contaInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calcular();
      }
    });
  }

  // Recalcular automaticamente se o usuário alterar as opções após digitar
  document.querySelectorAll('input[name="consumo"], #tipo-imovel').forEach(input => {
    input.addEventListener('change', () => {
      if (contaInput && parseFloat(contaInput.value) >= 50) {
        calcular();
      }
    });
  });

  // === 5. CARROSSEL DE DEPOIMENTOS (TOUCH SWIPE & BUTTONS) ===
  const inner = document.getElementById('depoimentos-inner');
  const dotsContainer = document.getElementById('dep-dots');
  const prevBtn = document.getElementById('dep-prev');
  const nextBtn = document.getElementById('dep-next');
  const cards = inner ? inner.querySelectorAll('.depoimento-card') : [];

  if (inner && cards.length > 0) {
    let currentSlide = 0;

    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getTotalSlides() {
      return Math.max(1, cards.length - getVisibleCount() + 1);
    }

    function setupDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = getTotalSlides();

      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'dep-dot' + (i === currentSlide ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goToSlide(index) {
      const total = getTotalSlides();
      currentSlide = Math.max(0, Math.min(index, total - 1));

      if (window.innerWidth > 768) {
        const firstCard = cards[0];
        const gap = 24;
        const cardWidth = firstCard.offsetWidth + gap;
        inner.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
      } else {
        // No mobile, usar scrollIntoView para alinhamento natural
        if (cards[currentSlide]) {
          cards[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }

      if (dotsContainer) {
        dotsContainer.querySelectorAll('.dep-dot').forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentSlide);
        });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Touch Swipe no Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    inner.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    inner.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
      }
    }, { passive: true });

    setupDots();

    window.addEventListener('resize', () => {
      setupDots();
    }, { passive: true });
  }

  // === 6. SMOOTH ANCHOR SCROLL COM OFFSET DE HEADER ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 64;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // === 7. LINK ATIVO NA NAVEGAÇÃO AO ROLAR ===
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (sections.length > 0 && navAnchors.length > 0) {
    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPos = window.scrollY + 100;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
      });
    }, { passive: true });
  }
}

// Iniciar imediatamente se o DOM já estiver pronto, ou aguardar carregamento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNorteSol);
} else {
  initNorteSol();
}
