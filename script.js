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
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form data
  const formData = {
    nombre: document.getElementById('nombre').value.trim(),
    email: document.getElementById('email').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    mensaje: document.getElementById('mensaje').value.trim(),
    privacy: document.getElementById('privacy').checked,
    timestamp: new Date().toISOString()
  };

  // Validate required fields
  if (!formData.nombre || !formData.email || !formData.telefono || !formData.mensaje) {
    alert('Por favor completá todos los campos obligatorios.');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert('Por favor ingresá un email válido.');
    return;
  }

  // Validate privacy checkbox
  if (!formData.privacy) {
    alert('Debes aceptar la Política de Privacidad y los Términos de Uso.');
    return;
  }

  // Save to localStorage (simulation)
  try {
    const existingSubmissions = JSON.parse(localStorage.getItem('neutralops_submissions') || '[]');
    existingSubmissions.push(formData);
    localStorage.setItem('neutralops_submissions', JSON.stringify(existingSubmissions));

    // Hide form and show success message
    contactForm.style.display = 'none';
    successMessage.classList.add('show');

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

  } catch (error) {
    console.error('Error saving submission:', error);
    alert('Hubo un error al enviar el formulario. Por favor intentá nuevamente.');
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
