/**
 * Dennis Mutia - Personal Site Scripts
 * Handles theme toggle, navigation, mobile menu, and print actions
 */

(function () {
  'use strict';

  // 1. Theme Toggle (Dark / Light Mode)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        themeToggleBtn.setAttribute('title', 'Switch to light mode');
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        themeToggleBtn.setAttribute('title', 'Switch to dark mode');
      }
    }
  }

  // Initial theme determination
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDarkScheme.matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Listener for button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(targetTheme);
      localStorage.setItem('theme', targetTheme);
    });
  }

  // Listener for system preference change
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Scrollspy / Active Nav Link Highlight
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // 4. Print CV Triggers
  const printButtons = document.querySelectorAll('.action-print-cv');
  printButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });

  // 5. Copy Email to Clipboard with visual feedback
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'dennis.mutia@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Copied!
        `;
        copyEmailBtn.style.backgroundColor = 'var(--accent-teal)';
        copyEmailBtn.style.color = '#ffffff';
        copyEmailBtn.style.borderColor = 'var(--accent-teal)';

        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
          copyEmailBtn.style.backgroundColor = '';
          copyEmailBtn.style.color = '';
          copyEmailBtn.style.borderColor = '';
        }, 2500);
      });
    });
  }
})();
