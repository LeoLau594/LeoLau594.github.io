/**
 * Modern Personal Blog - Main JavaScript
 */

// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
  var themeToggle = document.getElementById('theme-toggle');
  var sunIcon = document.getElementById('sun-icon');
  var moonIcon = document.getElementById('moon-icon');
  var html = document.documentElement;
  
  if (!themeToggle) return;
  
  // Get saved theme or system preference
  function getTheme() {
    var saved = localStorage.getItem('theme');
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  
  // Apply theme
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      html.removeAttribute('data-theme');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  }
  
  // Init
  applyTheme(getTheme());
  
  // Toggle on click
  themeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
});

// Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.getElementById('mobile-menu-btn');
  var nav = document.getElementById('nav');
  
  if (!menuBtn || !nav) return;
  
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    nav.classList.toggle('active');
  });
  
  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
      nav.classList.remove('active');
    }
  });
  
  // Close when clicking a link
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('active');
    });
  });
});

// Back to Top
document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var header = document.querySelector('.header');
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
  var elements = document.querySelectorAll('.card, .section-title, .friend-card');
  
  if (!elements.length) return;
  
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});
