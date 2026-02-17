// ============================================
// MOBILE MENU TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ============================================
// FAQ ACCORDION
// ============================================
const faqQuestions = document.querySelectorAll('.faq-item__question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    const answer = question.nextElementSibling;

    // Close all other FAQs
    faqQuestions.forEach(q => {
      if (q !== question) {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.style.maxHeight = '0';
      }
    });

    // Toggle current FAQ
    if (isExpanded) {
      question.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = '0';
    } else {
      question.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ============================================
// CONTACT FORM — CONFIGURACIÓN
// ============================================
// WEBHOOK_URL y API_KEY se cargan desde config.js (no se sube a Git)

// ============================================
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');
const submitBtnOriginalText = submitBtn.textContent;

/**
 * Envía los datos al webhook de n8n con timeout.
 * @param {Object} data — payload JSON
 * @returns {Promise<Response>}
 */

const BACKEND_ENDPOINT = "/api/lead";
const FETCH_TIMEOUT_MS = 15000;

async function submitToWebhook(data) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}


/*
async function submitToWebhook(data) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}*/

/**
 * Envía con 1 reintento automático ante fallo de red.
 * @param {Object} data — payload JSON
 * @param {number} retries — cantidad de reintentos restantes
 */
async function submitWithRetry(data, retries = 1) {
  try {
    const response = await submitToWebhook(data);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0 && (error.name === 'AbortError' || error.name === 'TypeError')) {
      // TypeError = fallo de red; AbortError = timeout
      await new Promise(r => setTimeout(r, 2000)); // esperar 2s antes de reintentar
      return submitWithRetry(data, retries - 1);
    }
    throw error;
  }
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // --- Honeypot check ---
  const honeypot = document.getElementById('website');
  if (honeypot && honeypot.value) {
    // Bot detected: simular éxito silencioso
    contactForm.style.display = 'none';
    successMessage.classList.add('show');
    return;
  }

  // --- Obtener datos ---
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const privacyChecked = document.getElementById('privacy').checked;

  // --- Validaciones ---
  if (!nombre || !email || !telefono || !mensaje) {
    alert('Por favor completá todos los campos obligatorios.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor ingresá un email válido.');
    return;
  }

  if (!privacyChecked) {
    alert('Debes aceptar la Política de Privacidad y los Términos de Uso.');
    return;
  }

  // --- Payload para n8n ---
  const payload = {
    name: nombre,
    email: email,
    phone: telefono,
    message: mensaje,
    subject: 'Solicitud de diagnóstico',
    source_url: window.location.href,
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };

  // --- Envío con loading state ---
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    await submitWithRetry(payload);

    // Éxito: limpiar form y mostrar mensaje
    contactForm.reset();
    contactForm.style.display = 'none';
    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

  } catch (error) {
    console.error('Error al enviar formulario:', error);
    alert('Hubo un error al enviar tu solicitud. Por favor intentá de nuevo en unos minutos.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtnOriginalText;
  }
});

// ============================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      // Only animate once
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll(
  '.problem-card, .service-card, .case-card, .process-step, .diff-card, .pricing-card, .faq-item'
);

animatedElements.forEach(el => {
  animateOnScroll.observe(el);
});

// ============================================
// SMOOTH SCROLL OFFSET (for fixed header)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');

    if (targetId === '#') return;

    e.preventDefault();

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// STAGGER ANIMATION DELAYS
// ============================================
function staggerAnimations(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, index) => {
    el.style.animationDelay = `${index * delay}ms`;
  });
}

// Apply stagger delays to different sections
staggerAnimations('.problem-card', 100);
staggerAnimations('.service-card', 100);
staggerAnimations('.case-card', 150);
staggerAnimations('.process-step', 150);
staggerAnimations('.diff-card', 100);
staggerAnimations('.pricing-card', 150);
staggerAnimations('.faq-item', 80);

// ============================================
// FORM RESET HANDLER (optional)
// ============================================
window.addEventListener('load', () => {
  // Reset form on page load
  contactForm.reset();

  // Add subtle entrance animation to hero
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1s ease-out';
      heroContent.style.opacity = '1';
    }, 100);
  }
});
