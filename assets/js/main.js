(function() {
  'use strict';

  // ==================== DOM ====================
  const DOM = {
    navToggle: document.getElementById('navToggle'),
    navLinks: document.getElementById('navLinks'),
    mainNav: document.getElementById('mainNav'),
    backBtn: document.getElementById('backToTop'),
    regionFilter: document.getElementById('regionFilter'),
    pageSearch: document.getElementById('pageSearch'),
    filterStats: document.getElementById('filterStats')
  };

  // ==================== DETAIL PAGE ====================
  const isIndexPage = document.querySelector('.category-grid, .rumahadat-grid, .alam-grid, .makanan-grid, .pakaian-grid, .seni-grid, .tradisi-grid, .suku-grid') !== null;

  // ==================== NAVBAR SCROLL ====================
  function initNavbarScroll() {
    if (!DOM.mainNav) return;

    const hero = document.querySelector(
      '.beranda-hero, .rumahadat-hero, .alam-hero, .makanan-hero, ' +
      '.pakaian-hero, .seni-hero, .tradisi-hero, .suku-hero'
    );

    const getTriggerPoint = () => {
      return hero ? hero.offsetHeight - 100 : 500;
    };

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      const triggerPoint = getTriggerPoint();

      if (currentScroll > triggerPoint) {
        DOM.mainNav.classList.add('visible');
      } else {
        DOM.mainNav.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    if (!DOM.navToggle || !DOM.navLinks) return;

    DOM.navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.navLinks.classList.toggle('is-open');
      DOM.navToggle.classList.toggle('active');
      DOM.mainNav.classList.toggle('menu-active');
    });

    DOM.navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {

        if (!link.classList.contains('nav__dropdown-toggle')) {
          DOM.navLinks.classList.remove('is-open');
          DOM.navToggle.classList.remove('active');
          DOM.mainNav.classList.remove('menu-active');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!DOM.navToggle.contains(e.target) && !DOM.navLinks.contains(e.target)) {
        DOM.navLinks.classList.remove('is-open');
        DOM.navToggle.classList.remove('active');
        DOM.mainNav.classList.remove('menu-active');
      }
    });
  }

  // ==================== DROPDOWNS ====================
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav__dropdown');
    
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.nav__dropdown-toggle');
      
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          dropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
          });
          
          dropdown.classList.toggle('active');
        });
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav__dropdown')) {
        dropdowns.forEach(d => d.classList.remove('active'));
      }
    });
  }

  // ==================== SCROLL ANIMATIONS ====================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    });

    const cards = document.querySelectorAll(
      '.category-card, .rumahadat-card, .alam-card, .makanan-card, ' +
      '.pakaian-card, .seni-card, .tradisi-card, .suku-card'
    );
    
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.animationDelay = `${index * 0.08}s`;
      observer.observe(card);
    });

    const sections = document.querySelectorAll(
      '.beranda-intro, .beranda-map, .beranda-categories, .beranda-bookmarks, ' +
      '.rumahadat-intro, .rumahadat-showcase, .alam-intro, .alam-showcase, ' +
      '.makanan-intro, .makanan-showcase, .pakaian-intro, .pakaian-showcase, ' +
      '.seni-intro, .seni-showcase, .tradisi-intro, .tradisi-showcase, ' +
      '.suku-intro, .suku-showcase'
    );
    
    sections.forEach(section => {
      section.style.opacity = '0';
      observer.observe(section);
    });
  }

  

  // ==================== BOOKMARK SYSTEM ====================
  function initBookmarks() {
    const bookmarkButtons = document.querySelectorAll(
      '.category-card__bookmark, .rumahadat-card__bookmark, .alam-card__bookmark, ' +
      '.makanan-card__bookmark, .pakaian-card__bookmark, .seni-card__bookmark, ' +
      '.tradisi-card__bookmark, .suku-card__bookmark'
    );
    
    if (bookmarkButtons.length === 0) return;
    
    if (typeof BookmarkSystem === 'undefined') {
      console.warn('BookmarkSystem not loaded');
      return;
    }
    
    bookmarkButtons.forEach(btn => {
      const itemId = btn.getAttribute('data-id');
      
      if (!itemId) {
        console.warn('Bookmark button missing data-id:', btn);
        return;
      }
      
      if (BookmarkSystem.isBookmarked(itemId)) {
        btn.classList.add('bookmarked');
      }
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        btn.classList.toggle('bookmarked');
        BookmarkSystem.toggleBookmark(itemId);
        
        const event = new CustomEvent('bookmarkChanged', {
          detail: { itemId: itemId, bookmarked: btn.classList.contains('bookmarked') }
        });
        document.dispatchEvent(event);
        
        showNotification(
          btn.classList.contains('bookmarked')
            ? 'Ditambahkan ke koleksi'
            : 'Dihapus dari koleksi'
        );
      });
    });
  }

window.showNotification = function(message) {
  const notification = document.createElement('div');
  notification.className = 'notification-toast';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2600);
}

  function initBackToTop() {
    if (!DOM.backBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        DOM.backBtn.classList.add('show');
      } else {
        DOM.backBtn.classList.remove('show');
      }
    }, { passive: true });

    DOM.backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function init() {
    initNavbarScroll();
    initMobileMenu();
    initDropdowns();
    initScrollAnimations();
    initBookmarks();
    initBackToTop();
    
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
    
    console.log(' Main.js initialized - Page type:', isIndexPage ? 'INDEX' : 'DETAIL');
  }

  // ==================== START ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();