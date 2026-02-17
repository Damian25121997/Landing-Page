// ============================================
// NeutralOps — Landing Page · Script Principal
// ============================================
// Archivo: script.js
// Descripción: Controla toda la interactividad de la landing page,
//              incluyendo navegación móvil, acordeón FAQ, envío del
//              formulario de contacto y animaciones de scroll.
// ============================================


// ============================================
// 1. MENÚ MÓVIL (HAMBURGUESA)
// ============================================
// Selecciona el botón hamburguesa, el contenedor del menú
// y todos los enlaces de navegación.

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');

// Al hacer clic en el botón hamburguesa, alterna la visibilidad
// del menú y la animación del ícono (clase "active").
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Al hacer clic en cualquier enlace del menú, se cierra
// automáticamente el menú móvil para mejorar la experiencia.
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});


// ============================================
// 2. EFECTO DE SCROLL EN EL HEADER
// ============================================
// Agrega la clase "scrolled" al header cuando el usuario
// baja más de 100px, permitiendo aplicar estilos CSS
// como fondo sólido o sombra al hacer scroll.

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
// 3. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
// ============================================
// Implementa un acordeón donde solo UNA pregunta puede estar
// abierta a la vez. Al hacer clic en una pregunta:
//   1. Se cierran todas las demás.
//   2. Se alterna la visibilidad de la respuesta seleccionada.
// Utiliza el atributo aria-expanded para accesibilidad.

const faqQuestions = document.querySelectorAll('.faq-item__question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    const answer = question.nextElementSibling;

    // Cierra todas las preguntas que NO son la seleccionada
    faqQuestions.forEach(q => {
      if (q !== question) {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.style.maxHeight = '0';
      }
    });

    // Alterna la pregunta actual: si estaba abierta la cierra, y viceversa
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
// 4. FORMULARIO DE CONTACTO — CONFIGURACIÓN
// ============================================
// Endpoint del backend que recibe los leads del formulario.
// Timeout máximo de espera por respuesta del servidor (15 seg).

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');
const submitBtnOriginalText = submitBtn.textContent;

const BACKEND_ENDPOINT = "https://api.neutralops.cloud/api/lead";
const FETCH_TIMEOUT_MS = 15000;


// ============================================
// 4.1 ENVÍO AL BACKEND CON TIMEOUT
// ============================================
/**
 * Envía los datos del formulario al backend mediante POST.
 * Implementa un timeout con AbortController: si el servidor
 * no responde en FETCH_TIMEOUT_MS (15s), la petición se aborta.
 *
 * @param {Object} data — Payload JSON con los datos del lead.
 * @returns {Promise<Response>} — La respuesta HTTP del servidor.
 */
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


// ============================================
// 4.2 ENVÍO CON REINTENTO AUTOMÁTICO
// ============================================
/**
 * Envuelve submitToWebhook() con lógica de reintento.
 * Si la petición falla por timeout (AbortError) o por
 * fallo de red (TypeError), espera 2 segundos y reintenta
 * una vez antes de lanzar el error definitivo.
 *
 * @param {Object} data    — Payload JSON con los datos del lead.
 * @param {number} retries — Cantidad de reintentos restantes (default: 1).
 * @returns {Promise<Response>} — La respuesta HTTP exitosa.
 * @throws {Error} — Si todos los intentos fallan.
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
      // AbortError = timeout superado · TypeError = sin conexión a internet
      await new Promise(r => setTimeout(r, 2000));
      return submitWithRetry(data, retries - 1);
    }
    throw error;
  }
}


// ============================================
// 4.3 MANEJO DEL EVENTO SUBMIT DEL FORMULARIO
// ============================================
// Flujo completo al enviar el formulario:
//   1. Prevenir el comportamiento por defecto del form.
//   2. Verificar el campo honeypot (anti-spam).
//   3. Capturar y sanear los datos de los campos.
//   4. Validar campos requeridos, formato de email y checkbox de privacidad.
//   5. Construir el payload JSON para el backend.
//   6. Enviar con estado de carga visual (botón deshabilitado).
//   7. Mostrar mensaje de éxito o alerta de error.

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // --- Anti-spam: campo honeypot oculto ---
  // Si un bot llenó el campo oculto "website", se simula éxito
  // sin enviar nada al servidor (trampa invisible para bots).
  const honeypot = document.getElementById('website');
  if (honeypot && honeypot.value) {
    contactForm.style.display = 'none';
    successMessage.classList.add('show');
    return;
  }

  // --- Captura de datos ingresados por el usuario ---
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const privacyChecked = document.getElementById('privacy').checked;

  // --- Validación: campos obligatorios ---
  if (!nombre || !email || !telefono || !mensaje) {
    alert('Por favor completá todos los campos obligatorios.');
    return;
  }

  // --- Validación: formato de email ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor ingresá un email válido.');
    return;
  }

  // --- Validación: aceptación de términos y política de privacidad ---
  if (!privacyChecked) {
    alert('Debes aceptar la Política de Privacidad y los Términos de Uso.');
    return;
  }

  // --- Construcción del payload para el backend ---
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

  // --- Estado de carga: deshabilitar botón mientras se envía ---
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    await submitWithRetry(payload);

    // Éxito: limpiar formulario, ocultarlo y mostrar mensaje de confirmación
    contactForm.reset();
    contactForm.style.display = 'none';
    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

  } catch (error) {
    console.error('Error al enviar formulario:', error);
    alert('Hubo un error al enviar tu solicitud. Por favor intentá de nuevo en unos minutos.');
  } finally {
    // Siempre restaurar el botón al estado original, haya éxito o error
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtnOriginalText;
  }
});


// ============================================
// 5. ANIMACIONES DE SCROLL (INTERSECTION OBSERVER)
// ============================================
// Utiliza IntersectionObserver para detectar cuándo un elemento
// entra en el viewport. Al ser visible (10% mínimo), se le agrega
// la clase "animate" que dispara la animación CSS.
// Cada elemento se anima UNA SOLA VEZ (se deja de observar después).

const observerOptions = {
  threshold: 0.1,                     // Se activa cuando el 10% del elemento es visible
  rootMargin: '0px 0px -50px 0px'     // Margen inferior negativo para activar un poco antes
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      animateOnScroll.unobserve(entry.target);  // Solo animar una vez
    }
  });
}, observerOptions);

// Registrar todos los elementos que deben animarse al hacer scroll
const animatedElements = document.querySelectorAll(
  '.problem-card, .service-card, .case-card, .process-step, .diff-card, .pricing-card, .faq-item'
);

animatedElements.forEach(el => {
  animateOnScroll.observe(el);
});


// ============================================
// 6. SCROLL SUAVE CON COMPENSACIÓN DE HEADER FIJO
// ============================================
// Intercepta los clics en enlaces ancla (href="#seccion") para
// hacer scroll suave. Resta la altura del header fijo + 20px
// de margen para que la sección no quede tapada por el header.

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');

    // Ignorar enlaces vacíos (href="#")
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
// 7. RETRASOS ESCALONADOS EN ANIMACIONES (STAGGER)
// ============================================
/**
 * Aplica un retraso incremental (stagger) a las animaciones CSS
 * de un grupo de elementos. Cada elemento sucesivo se anima
 * ligeramente después del anterior, creando un efecto cascada.
 *
 * @param {string} selector — Selector CSS del grupo de elementos.
 * @param {number} delay    — Milisegundos de retraso entre cada elemento (default: 100ms).
 */
function staggerAnimations(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, index) => {
    el.style.animationDelay = `${index * delay}ms`;
  });
}

// Aplicar efecto stagger a cada sección de la landing
staggerAnimations('.problem-card', 100);    // Tarjetas de problemas
staggerAnimations('.service-card', 100);    // Tarjetas de servicios
staggerAnimations('.case-card', 150);       // Casos de éxito
staggerAnimations('.process-step', 150);    // Pasos del proceso
staggerAnimations('.diff-card', 100);       // Tarjetas diferenciadoras
staggerAnimations('.pricing-card', 150);    // Tarjetas de precios
staggerAnimations('.faq-item', 80);         // Preguntas frecuentes


// ============================================
// 8. INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================
// Se ejecuta cuando la página termina de cargar completamente.
// Resetea el formulario (evita datos persistidos por el navegador)
// y aplica una animación de fade-in suave al contenido del hero.

window.addEventListener('load', () => {
  contactForm.reset();

  // Animación de entrada progresiva para el hero principal
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1s ease-out';
      heroContent.style.opacity = '1';
    }, 100);
  }
});
