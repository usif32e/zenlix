/* =========================================================
   ZENLIX — SCRIPT.JS
   Handles: hero slider, hamburger menu, scroll reveal,
   form validation, and EN/AR translation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =======================================================
     1. HERO IMAGE SLIDER
     Auto-rotates background slides every 5s with fade.
     ======================================================= */
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  let currentSlide = 0;
  let sliderInterval;

  // Build dot indicators dynamically based on slide count
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('hero-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = document.querySelectorAll('.hero-dot');

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function goToSlide(index) {
    showSlide(index);
    restartSlider(); // reset timer when user manually picks a slide
  }

  function startSlider() {
    sliderInterval = setInterval(nextSlide, 5000);
  }

  function restartSlider() {
    clearInterval(sliderInterval);
    startSlider();
  }

  startSlider();

  /* =======================================================
     2. NAVBAR — HAMBURGER MENU (mobile)
     ======================================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu after clicking a nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* =======================================================
     3. SCROLL REVEAL — Intersection Observer
     Fades + slides up elements with class .reveal when
     they enter the viewport.
     ======================================================= */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.15
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* =======================================================
     4. CONTACT FORM VALIDATION
     ======================================================= */
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formSuccess = document.getElementById('formSuccess');

  // Basic email pattern check
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setError(input, errorEl, message) {
    input.classList.add('invalid');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('invalid');
    errorEl.textContent = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');

    let isValid = true;
    const t = translations[currentLang]; // current language error strings

    // Name validation
    if (nameInput.value.trim().length < 2) {
      setError(nameInput, nameError, t.err_name);
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Email validation
    if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, emailError, t.err_email);
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Message validation
    if (messageInput.value.trim().length < 10) {
      setError(messageInput, messageError, t.err_message);
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    if (isValid) {
      sendToWhatsApp({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      });

      formSuccess.classList.add('show');
      form.reset();
      // Hide success message after a few seconds
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }
  });

  /* -------------------------------------------------------
     WhatsApp Click-to-Chat integration
     Builds a pre-filled message from the form data and
     opens WhatsApp in a new tab. No backend, no email —
     pure vanilla JS using the wa.me link format.
     ------------------------------------------------------- */
  const WHATSAPP_NUMBER = '201038641662'; // agency WhatsApp number (country code, no + or 00)

  function sendToWhatsApp({ name, email, message }) {
    const text =
      `New message from Zenlix website:\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Message: ${message}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

    // Open in a new tab; fall back to same-tab redirect if popups are blocked
    const newTab = window.open(whatsappUrl, '_blank');
    if (!newTab) {
      window.location.href = whatsappUrl;
    }
  }

  // Clear individual field errors as the user types
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
    });
  });

  /* =======================================================
     5. TRANSLATION (EN / AR)
     ======================================================= */
  const translations = {
    en: {
      logo: 'Zenlix',
      nav_home: 'Home',
      nav_about: 'About',
      nav_services: 'Services',
      nav_why: 'Why Us',
      nav_contact: 'Contact',

      hero_heading_pre: 'We Build Digital ',
      hero_heading_highlight: 'Experiences',
      hero_desc: 'Zenlix is a creative digital agency crafting beautiful websites, products, and brands that help businesses grow online.',
      hero_cta: 'Get Started',

      about_eyebrow: 'Who we are',
      about_title: 'About Zenlix',
      about_text: 'Zenlix is a creative digital agency that builds websites and digital solutions for ambitious brands. We blend clean design with solid engineering to turn ideas into fast, elegant, and memorable digital experiences.',

      services_eyebrow: 'What we do',
      services_title: 'Our Services',
      service1_title: 'Web Design',
      service1_desc: 'Clean, modern interfaces crafted to engage visitors and reflect your brand identity.',
      service2_title: 'Web Development',
      service2_desc: 'Fast, reliable, and scalable websites built with clean and modern code.',
      service3_title: 'Digital Branding',
      service3_desc: 'Consistent visual identity and messaging that helps your brand stand out.',
      service4_title: 'Digital Marketing',
      service4_desc: 'Social media management and marketing campaigns designed to boost your online presence and attract more customers.',
      why_eyebrow: 'Our advantage',
      why_title: 'Why Choose Us',
      why1_title: 'Modern Design',
      why1_desc: 'Thoughtful, contemporary visuals that keep your brand feeling current.',
      why2_title: 'Fast Delivery',
      why2_desc: 'Efficient workflows that get your project live without sacrificing quality.',
      why3_title: 'Responsive Websites',
      why3_desc: 'Pixel-perfect experiences on every screen, from phones to desktops.',

      contact_eyebrow: "Let's talk",
      contact_title: 'Contact Us',
      contact_text: 'Have a project in mind? Send us a message and our team will get back to you shortly.',
      contact_location: 'Giza · Elsheikh Zayed',

      form_name: 'Name',
      form_name_ph: 'Your full name',
      form_email: 'Email',
      form_email_ph: 'you@example.com',
      form_message: 'Message',
      form_message_ph: 'Tell us about your project...',
      form_send: 'Send Message',
      form_success: 'Thank you! Your message has been sent.',

      err_name: 'Please enter at least 2 characters.',
      err_email: 'Please enter a valid email address.',
      err_message: 'Message should be at least 10 characters.',

      footer_text: '© 2026 Zenlix. All rights reserved.'
    },

    ar: {
      logo: 'زينليكس',
      nav_home: 'الرئيسيه',
      nav_about: 'من نحن',
      nav_services: 'خدماتنا',
      nav_why: 'لماذا نحن',
      nav_contact: 'تواصل معنا',

      hero_heading_pre: 'نحن نصنع تجارب ',
      hero_heading_highlight: 'رقمية',
      hero_desc: 'زينليكس وكالة رقمية إبداعية تصمم مواقع ومنتجات وهويات مميزة تساعد الأعمال على النمو عبر الإنترنت.',
      hero_cta: 'ابدأ الآن',

      about_eyebrow: 'من نحن',
      about_title: 'عن زينليكس',
      about_text: 'زينليكس وكالة رقمية إبداعية تبني المواقع والحلول الرقمية للعلامات التجارية الطموحة. نمزج بين التصميم الأنيق والهندسة المتينة لتحويل الأفكار إلى تجارب رقمية سريعة وأنيقة لا تُنسى.',

      services_eyebrow: 'ماذا نقدم',
      services_title: 'خدماتنا',
      service1_title: 'تصميم المواقع',
      service1_desc: 'واجهات نظيفة وعصرية مصممة لجذب الزوار وتعكس هوية علامتك التجارية.',
      service2_title: 'تطوير المواقع',
      service2_desc: 'مواقع سريعة وموثوقة وقابلة للتوسع مبنية بأكواد نظيفة وحديثة.',
      service3_title: 'الهوية الرقمية',
      service3_desc: 'هوية بصرية ورسائل متسقة تساعد علامتك التجارية على التميز.',
      service4_title: 'التسويق الرقمي',
      service4_desc: 'إدارة حسابات التواصل الاجتماعي وإنشاء حملات تسويقية تساعد مشروعك على الوصول لعملاء أكثر وزيادة حضورك الرقمي.',
      why_eyebrow: 'ميزتنا',
      why_title: 'لماذا تختارنا',
      why1_title: 'تصميم عصري',
      why1_desc: 'تصاميم مدروسة وعصرية تحافظ على شعور علامتك التجارية بالحداثة.',
      why2_title: 'تسليم سريع',
      why2_desc: 'سير عمل فعّال يضمن إطلاق مشروعك بسرعة دون التضحية بالجودة.',
      why3_title: 'مواقع متجاوبة',
      why3_desc: 'تجارب دقيقة على كل الشاشات، من الهواتف إلى أجهزة الحاسوب.',

      contact_eyebrow: 'لنتحدث',
      contact_title: 'تواصل معنا',
      contact_text: 'هل لديك مشروع في ذهنك؟ أرسل لنا رسالة وسيتواصل فريقنا معك في أقرب وقت.',
      contact_location: 'الجيزة • الشيخ زايد',

      form_name: 'الاسم',
      form_name_ph: 'اسمك الكامل',
      form_email: 'البريد الإلكتروني',
      form_email_ph: 'you@example.com',
      form_message: 'الرسالة',
      form_message_ph: 'أخبرنا عن مشروعك...',
      form_send: 'إرسال الرسالة',
      form_success: 'شكراً لك! تم إرسال رسالتك بنجاح.',

      err_name: 'يرجى إدخال حرفين على الأقل.',
      err_email: 'يرجى إدخال بريد إلكتروني صحيح.',
      err_message: 'يجب أن تكون الرسالة 10 أحرف على الأقل.',

      footer_text: '© 2026 زينليكس. جميع الحقوق محفوظة.'
    }
  };

  let currentLang = 'en';

  const langBtn = document.getElementById('langBtn');
  const langBtnText = document.getElementById('langBtnText');
  const heroHeading = document.querySelector('.hero-heading');

  function applyTranslations(lang) {
    const t = translations[lang];

    // Translate all elements tagged with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // Translate placeholder attributes separately
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // Hero heading has a nested <span class="highlight">, rebuild it manually
    heroHeading.innerHTML = `${t.hero_heading_pre}<span class="highlight">${t.hero_heading_highlight}</span>`;

    // Switch document direction for proper RTL/LTR layout
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update the language toggle button label to show the *other* language
    langBtnText.textContent = lang === 'en' ? 'AR' : 'EN';

    // Clear any visible form errors since wording just changed
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(messageInput, messageError);
    formSuccess.classList.remove('show');
  }

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyTranslations(currentLang);
  });

  // Expose translations to the validation block above via closure variable
  // (currentLang and translations are already in scope)

});
