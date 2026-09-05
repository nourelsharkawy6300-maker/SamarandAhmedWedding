(function () {
  'use strict';
  
  const WEDDING_DATE = new Date('2026-09-18T18:00:00');
  const preloader = document.getElementById('preloader');
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('openInviteBtn');
  const bgAudio = document.getElementById('bgAudio');
  const soundToggle = document.getElementById('soundToggle');
  const mainContent = document.getElementById('mainContent');
  const countdownEl = document.getElementById('countdown');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');

  function openEnvelope() {
    if (envelope.classList.contains('is-open')) return;
    
    const arrow = document.getElementById('cupidArrow');
    const burstWrap = document.getElementById('heartBurst');

    if (openBtn) openBtn.style.opacity = '0';
    
    // تشغيل الصوت التلقائي للهروب من حماية المتصفح
    if (bgAudio) {
      bgAudio.volume = 0.75;
      bgAudio.play().then(() => {
        if(soundToggle) soundToggle.classList.remove('is-muted');
      }).catch(() => {});
    }

    if (arrow) {
      arrow.style.opacity = 1;
      arrow.classList.add('arrow-shoot');
      
      arrow.addEventListener('animationend', function onArrowEnd() {
        arrow.removeEventListener('animationend', onArrowEnd);
        arrow.style.display = 'none';

        const HEART_COUNT = 20;
        for (let i = 0; i < HEART_COUNT; i++) {
          const heart = document.createElement('i');
          heart.className = 'fa-solid fa-heart heart-particle';
          const angle = (360 / HEART_COUNT) * i + (Math.random() * 16 - 8);
          const dist = 70 + Math.random() * 50;
          heart.style.setProperty('--angle', angle + 'deg');
          heart.style.setProperty('--dist', dist + 'px');
          burstWrap.appendChild(heart);
          requestAnimationFrame(() => heart.classList.add('explode'));
        }

        setTimeout(() => {
          envelope.classList.add('is-open');
          setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
              preloader.classList.add('is-hidden');
              document.body.style.overflow = '';
              mainContent.removeAttribute('aria-hidden');
              if (soundToggle) soundToggle.classList.add('is-visible');
              initRevealObserver();
              burstWrap.innerHTML = ''; 
            }, 700);
          }, 1200);
        }, 400);
      }, { once: true });
    }
  }

  if (openBtn) openBtn.addEventListener('click', openEnvelope);
  if (envelope) envelope.addEventListener('click', (e) => {
    if (e.target.closest("#audioToggle") || e.target.closest("#openInviteBtn")) return;
    openEnvelope();
  });

  document.body.style.overflow = 'hidden';

  if (soundToggle && bgAudio) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      bgAudio.muted = !bgAudio.muted;
      soundToggle.classList.toggle('is-muted', bgAudio.muted);
      if (!bgAudio.muted && bgAudio.paused) bgAudio.play().catch(() => {});
    });
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now = new Date();
    if (now >= WEDDING_DATE) {
      if (countdownEl) countdownEl.hidden = true;
      const msg = document.getElementById('weddingDayMessage');
      if (msg) msg.hidden = false;
      return;
    }
    const diff = WEDDING_DATE.getTime() - now.getTime();
    document.getElementById('cd-days').textContent = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
    document.getElementById('cd-hours').textContent = pad(Math.floor((diff / (1000 * 60 * 60)) % 24));
    document.getElementById('cd-minutes').textContent = pad(Math.floor((diff / (1000 * 60)) % 60));
    document.getElementById('cd-seconds').textContent = pad(Math.floor((diff / 1000) % 60));
    requestAnimationFrame(() => setTimeout(updateCountdown, 1000));
  }
  updateCountdown();

  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('حفل زفاف سمر و أحمد')}&dates=20260918T180000/20260918T230000&details=${encodeURIComponent('يسعدنا حضوركم لمشاركتنا فرحة الزفاف 💍')}&ctz=Africa/Cairo`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  function initRevealObserver() {
    const revealEls = document.querySelectorAll('.reveal-up');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => observer.observe(el));
  }
})();