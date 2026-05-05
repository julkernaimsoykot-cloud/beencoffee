/* ============================================
   MILESTONE COFFEE & PASTRY SHOP - script.js
   Main JavaScript File
   ============================================ */

/* ---- Preloader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 600);
    }
    // Trigger hero background animation
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.classList.add('loaded');
  }, 1200);
});

/* ---- Navbar Scroll ---- */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 400);
  }
});

/* ---- Hamburger Menu ---- */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks?.classList.toggle('open');
});
// Close on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('open');
  });
});

/* ---- Active Nav Link ---- */
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
  });
}
setActiveNav();

/* ---- Back to Top ---- */
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Scroll Reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- Menu Tabs ---- */
const tabBtns = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    menuCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.4s ease both';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ---- Testimonial Slider ---- */
let currentSlide = 0;
const track = document.querySelector('.testimonial-track');
const dots = document.querySelectorAll('.dot');

function getVisible() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function updateSlider() {
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const visible = getVisible();
  const maxSlide = Math.max(0, cards.length - visible);
  currentSlide = Math.min(currentSlide, maxSlide);

  const gap = 28;
  const cardWidth = (track.parentElement.offsetWidth - gap * (visible - 1)) / visible;
  const offset = currentSlide * (cardWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;

  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

document.querySelector('.prev-btn')?.addEventListener('click', () => {
  currentSlide = Math.max(0, currentSlide - 1);
  updateSlider();
});
document.querySelector('.next-btn')?.addEventListener('click', () => {
  const cards = track?.querySelectorAll('.testimonial-card');
  if (!cards) return;
  const visible = getVisible();
  const max = Math.max(0, cards.length - visible);
  currentSlide = Math.min(max, currentSlide + 1);
  updateSlider();
});
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { currentSlide = i; updateSlider(); });
});
window.addEventListener('resize', updateSlider);

// Auto-slide
setInterval(() => {
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const visible = getVisible();
  const max = Math.max(0, cards.length - visible);
  currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
  updateSlider();
}, 5000);

/* ---- Contact Form Validation ---- */
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Reset errors
  document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
    el.style.borderColor = '';
  });

  const name = document.getElementById('c-name');
  const email = document.getElementById('c-email');
  const phone = document.getElementById('c-phone');
  const message = document.getElementById('c-message');

  if (!name?.value.trim()) {
    showError(name, 'name-error', 'Please enter your name'); valid = false;
  }
  if (!email?.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    showError(email, 'email-error', 'Please enter a valid email'); valid = false;
  }
  if (!phone?.value.match(/^[0-9]{10,14}$/)) {
    showError(phone, 'phone-error', 'Please enter a valid phone number'); valid = false;
  }
  if (!message?.value.trim() || message.value.trim().length < 10) {
    showError(message, 'message-error', 'Message must be at least 10 characters'); valid = false;
  }

  if (valid) {
    const success = document.getElementById('form-success');
    if (success) { success.style.display = 'block'; }
    contactForm.reset();
    setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
  }
});

function showError(input, errorId, msg) {
  if (input) input.style.borderColor = '#e53e3e';
  const errEl = document.getElementById(errorId);
  if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
}

/* ---- Order System ---- */
const orderState = {};

function initOrderSystem() {
  const orderCards = document.querySelectorAll('.order-item-card');
  if (!orderCards.length) return;

  orderCards.forEach(card => {
    const id = card.dataset.id;
    const price = parseInt(card.dataset.price);
    const name = card.dataset.name;
    orderState[id] = { qty: 0, price, name };

    const minusBtn = card.querySelector('.qty-btn.minus');
    const plusBtn = card.querySelector('.qty-btn.plus');
    const qtyNum = card.querySelector('.qty-num');

    plusBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      orderState[id].qty++;
      qtyNum.textContent = orderState[id].qty;
      card.classList.add('selected');
      updateSummary();
    });

    minusBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (orderState[id].qty > 0) {
        orderState[id].qty--;
        qtyNum.textContent = orderState[id].qty;
        if (orderState[id].qty === 0) card.classList.remove('selected');
        updateSummary();
      }
    });
  });
}

function updateSummary() {
  const summaryItems = document.getElementById('summary-items');
  const totalEl = document.getElementById('order-total');
  if (!summaryItems || !totalEl) return;

  let total = 0;
  let html = '';
  let hasItems = false;

  Object.values(orderState).forEach(item => {
    if (item.qty > 0) {
      hasItems = true;
      const subtotal = item.qty * item.price;
      total += subtotal;
      html += `<div class="summary-item">
        <span>${item.name} x${item.qty}</span>
        <span>৳${subtotal}</span>
      </div>`;
    }
  });

  summaryItems.innerHTML = hasItems ? html : '<p class="summary-empty">No items selected yet</p>';
  totalEl.textContent = `৳${total}`;
}

/* Payment options */
document.querySelectorAll('.payment-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.querySelector('input[type="radio"]').checked = true;
  });
});

/* Order form submission */
const orderForm = document.getElementById('orderForm');
orderForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const total = document.getElementById('order-total')?.textContent;
  const payment = document.querySelector('.payment-option.selected span.payment-logo')?.textContent || 'Cash on Delivery';
  const hasItems = Object.values(orderState).some(i => i.qty > 0);

  if (!hasItems) {
    alert('Please select at least one item before placing your order.');
    return;
  }

  const successMsg = document.getElementById('order-success');
  if (successMsg) {
    successMsg.innerHTML = `<strong>🎉 Order Placed Successfully!</strong><br>Total: ${total} | Payment: ${payment}<br>We'll confirm via phone shortly.`;
    successMsg.style.display = 'block';
  }
  orderForm.reset();
  Object.keys(orderState).forEach(k => { orderState[k].qty = 0; });
  document.querySelectorAll('.qty-num').forEach(el => el.textContent = '0');
  document.querySelectorAll('.order-item-card').forEach(c => c.classList.remove('selected'));
  updateSummary();
  setTimeout(() => { if (successMsg) successMsg.style.display = 'none'; }, 7000);
});

// Init
initOrderSystem();
updateSummary();

/* ---- CSS fadeIn keyframe injection ---- */
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
