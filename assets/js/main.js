(function() {
  'use strict';

  // ==================== CACHE DOM ====================
  const DOM = {
    navToggle: document.getElementById('navToggle'),
    navLinks: document.getElementById('navLinks'),
    mainNav: document.getElementById('mainNav'),
    backBtn: document.getElementById('backToTop'),
    regionFilter: document.getElementById('regionFilter'),
    pageSearch: document.getElementById('pageSearch'),
    filterStats: document.getElementById('filterStats')
  };

  // ==================== CHECK IF INDEX OR DETAIL PAGE ====================
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
    });

    DOM.navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        DOM.navLinks.classList.remove('is-open');
        DOM.navToggle.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!DOM.navToggle.contains(e.target) && !DOM.navLinks.contains(e.target)) {
        DOM.navLinks.classList.remove('is-open');
        DOM.navToggle.classList.remove('active');
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

  // ==================== FILTER SYSTEM (INDEX PAGES ONLY) ====================
  function initFilters() {
    // SKIP if not index page
    if (!isIndexPage) return;

    const cards = document.querySelectorAll(
      '.rumahadat-card, .category-card, .alam-card, .makanan-card, ' +
      '.pakaian-card, .seni-card, .tradisi-card, .suku-card'
    );
    
    if (cards.length === 0) return;

    let currentRegion = 'all';
    let currentSearch = '';

    function filterCards() {
      let visibleCount = 0;
      
      cards.forEach(card => {
        const region = card.getAttribute('data-region') || '';
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();
        
        const titleEl = card.querySelector(
          '.rumahadat-card__title, .category-card__title, .alam-card__title, ' +
          '.makanan-card__title, .pakaian-card__title, .seni-card__title, ' +
          '.tradisi-card__title, .suku-card__title'
        );
        const descEl = card.querySelector(
          '.rumahadat-card__desc, .category-card__desc, .alam-card__desc, ' +
          '.makanan-card__desc, .pakaian-card__desc, .seni-card__desc, ' +
          '.tradisi-card__desc, .suku-card__desc'
        );
        const locationEl = card.querySelector(
          '.rumahadat-card__location, .alam-card__location, .makanan-card__location, ' +
          '.pakaian-card__location, .seni-card__location, .tradisi-card__location, ' +
          '.suku-card__location'
        );
        
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const desc = descEl ? descEl.textContent.toLowerCase() : '';
        const location = locationEl ? locationEl.textContent.toLowerCase() : '';
        
        const matchesRegion = currentRegion === 'all' || region === currentRegion;
        const matchesSearch = currentSearch === '' || 
                             title.includes(currentSearch) ||
                             desc.includes(currentSearch) ||
                             location.includes(currentSearch) ||
                             tags.includes(currentSearch);
        
        if (matchesRegion && matchesSearch) {
          card.style.display = '';
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });

      updateStats(visibleCount, cards.length);
      toggleNoResults(visibleCount === 0);
      
      if (typeof FilterSystem !== 'undefined' && currentRegion !== 'all') {
        FilterSystem.saveFilterPreference(currentRegion);
      }
    }

    if (DOM.regionFilter) {
      if (typeof FilterSystem !== 'undefined') {
        const saved = FilterSystem.getFilterPreference();
        DOM.regionFilter.value = saved;
        currentRegion = saved;
      }
      
      DOM.regionFilter.addEventListener('change', (e) => {
        currentRegion = e.target.value;
        filterCards();
      });
    }

    if (DOM.pageSearch) {
      let timeout;
      DOM.pageSearch.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          currentSearch = e.target.value.toLowerCase().trim();
          filterCards();
        }, 300);
      });
      
      DOM.pageSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(timeout);
          currentSearch = e.target.value.toLowerCase().trim();
          filterCards();
        }
      });
    }

    filterCards();
  }

  function updateStats(visible, total) {
    if (!DOM.filterStats) return;
    
    DOM.filterStats.textContent = visible === total 
      ? `Menampilkan ${total} item`
      : `Menampilkan ${visible} dari ${total} item`;
  }

  function toggleNoResults(show) {
    let noResults = document.getElementById('noResults');
    
    if (!noResults && show) {
      const container = document.querySelector(
        '.rumahadat-grid, .alam-grid, .makanan-grid, .pakaian-grid, ' +
        '.seni-grid, .tradisi-grid, .suku-grid, .category-grid'
      );
      
      if (container) {
        noResults = document.createElement('div');
        noResults.id = 'noResults';
        noResults.className = 'no-results';
        noResults.textContent = 'Tidak ada hasil yang ditemukan';
        container.appendChild(noResults);
      }
    }
    
    if (noResults) {
      noResults.style.display = show ? 'block' : 'none';
    }
  }

  // ==================== BOOKMARK SYSTEM (INDEX PAGES ONLY) ====================
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

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--primary);
      color: #000;
      padding: 16px 28px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      z-index: 99999;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.3s;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2600);
  }

  // ==================== BACK TO TOP ====================
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

  // ==================== INIT ALL ====================
  function init() {
    initNavbarScroll();
    initMobileMenu();
    initDropdowns();
    initScrollAnimations();
    initFilters();
    initBookmarks();
    initBackToTop();
    
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
    
    console.log('✅ Main.js initialized - Page type:', isIndexPage ? 'INDEX' : 'DETAIL');
  }

  // ==================== START ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ==================== CSS ANIMATIONS ====================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
    
    .hidden { display: none !important; }
    
    .is-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

})();