
(function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

(function smoothScrollWithOffset() {
  const navbar = document.querySelector('.navbar.fixed-top');
  const getOffset = () => (navbar ? navbar.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.pageYOffset - getOffset();
          window.scrollTo({ top, behavior: 'smooth' });

          const collapseEl = document.getElementById('nav');
          if (collapseEl && collapseEl.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);
            bsCollapse.hide();
          }
        }
      }
    });
  });

  window.addEventListener('load', () => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - getOffset();
        window.scrollTo({ top });
      }
    }
  });
})();

(function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar .nav-link');
  if (!sections.length || !navLinks.length) return;

  const opts = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.navbar .nav-link[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.remove('active');
          l.removeAttribute('aria-current');
        });
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }, opts);

  sections.forEach(section => observer.observe(section));
})();

(function keyboardFocusOutline() {
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();

(function likeButtonFooter() {
  const btn = document.getElementById('likeButton');
  const countEl = document.getElementById('likeCount');
  const feedbackEl = document.getElementById('likeFeedback');

  if (!btn || !countEl) return;

  const STORAGE_COUNT_KEY = 'sc_site_like_count';
  const STORAGE_USER_KEY = 'sc_site_user_liked';

  let count = 0;

  const storedCount = localStorage.getItem(STORAGE_COUNT_KEY);
  if (storedCount && !Number.isNaN(parseInt(storedCount, 10))) {
    count = parseInt(storedCount, 10);
  }
  countEl.textContent = count;

  const userLiked = localStorage.getItem(STORAGE_USER_KEY) === 'true';
  if (userLiked) {
    btn.classList.add('is-liked');
    btn.setAttribute('aria-pressed', 'true');
  }

  btn.addEventListener('click', () => {
    const isLiked = btn.classList.contains('is-liked');

    if (!isLiked) {
      count += 1;
      btn.classList.add('is-liked');
      btn.setAttribute('aria-pressed', 'true');
      localStorage.setItem(STORAGE_USER_KEY, 'true');
      if (feedbackEl) feedbackEl.textContent = 'Obrigado por curtir!';
    } else {
      count = Math.max(0, count - 1);
      btn.classList.remove('is-liked');
      btn.setAttribute('aria-pressed', 'false');
      localStorage.setItem(STORAGE_USER_KEY, 'false');
      if (feedbackEl) feedbackEl.textContent = 'Você removeu sua curtida.';
    }

    countEl.textContent = count;
    localStorage.setItem(STORAGE_COUNT_KEY, String(count));
  });
})();