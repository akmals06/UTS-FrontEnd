/* =====================================================
   BOOKMARK-MANAGER.JS - FULL CRUD FUNCTIONALITY
   Tambah, Hapus, Filter, Search, Export Bookmarks
   ===================================================== */

(function() {
  'use strict';

  // Category Data (untuk display bookmarks)
  const CATEGORY_DATA = {
    'alam': {
      title: 'Wisata Alam',
      desc: 'Danau Kelimutu, Pulau Komodo, Wae Rebo'
    },
    'rumah-adat': {
      title: 'Rumah Adat',
      desc: 'Mbaru Niang, Lopo, Sao Ata Mosa'
    },
    'pakaian': {
      title: 'Tenun & Kain Adat',
      desc: 'Hinggi, Lau Pahudu, Sarung Sabu'
    },
    'makanan': {
      title: 'Kuliner Khas',
      desc: 'Se\'i, Jagung Bose, Kolo'
    },
    'seni': {
      title: 'Seni Tradisional',
      desc: 'Sasando, Tari Caci, Gong Waning'
    },
    'suku': {
      title: 'Suku & Adat',
      desc: 'Manggarai, Sumba, Ngada, Atoni'
    },
    'tradisi': {
      title: 'Tradisi & Ritual',
      desc: 'Pasola, Penti, Reba, Wulla Poddu'
    }
  };

  // DOM Cache
  const DOM = {
    bookmarkList: document.getElementById('bookmarkList'),
    bookmarkFilter: document.getElementById('bookmarkFilter'),
    bookmarkSearch: document.getElementById('bookmarkSearch'),
    bookmarkStats: document.getElementById('bookmarkStats'),
    clearAllBtn: document.getElementById('clearAllBookmarks')
  };

  // State
  let currentFilter = 'all';
  let currentSearch = '';

  // ==================== RENDER BOOKMARKS ====================
  function renderBookmarks() {
    if (!DOM.bookmarkList) return;

    const bookmarks = BookmarkSystem.getBookmarks();
    
    if (bookmarks.length === 0) {
      showEmptyState();
      updateStats(0);
      return;
    }

    // Filter bookmarks
    let filtered = bookmarks;

    // Filter by category
    if (currentFilter !== 'all') {
      filtered = filtered.filter(id => id === currentFilter);
    }

    // Filter by search
    if (currentSearch) {
      filtered = filtered.filter(id => {
        const data = CATEGORY_DATA[id];
        if (!data) return false;
        
        const searchLower = currentSearch.toLowerCase();
        const titleMatch = data.title.toLowerCase().includes(searchLower);
        const descMatch = data.desc.toLowerCase().includes(searchLower);
        
        return titleMatch || descMatch;
      });
    }

    // Clear container
    DOM.bookmarkList.innerHTML = '';

    // No results after filter
    if (filtered.length === 0) {
      showNoResults();
      updateStats(0);
      return;
    }

    // Render each bookmark
    filtered.forEach(id => {
      const data = CATEGORY_DATA[id];
      if (!data) return;

      const item = createBookmarkItem(id, data);
      DOM.bookmarkList.appendChild(item);
    });

    updateStats(filtered.length);
  }

  // ==================== CREATE BOOKMARK ITEM ====================
  function createBookmarkItem(id, data) {
    const item = document.createElement('div');
    item.className = 'bookmark-item';
    item.setAttribute('data-id', id);

    // Get saved date
    const savedDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    item.innerHTML = `
      <div class="bookmark-item__header">
        <span class="bookmark-item__category">${getCategoryLabel(id)}</span>
        <button class="bookmark-item__remove" data-id="${id}" aria-label="Hapus bookmark">
          ×
        </button>
      </div>
      <div class="bookmark-item__content">
        <h3 class="bookmark-item__title">${data.title}</h3>
        <p class="bookmark-item__desc">${data.desc}</p>
        <div class="bookmark-item__meta">
          <span class="bookmark-item__date">${savedDate}</span>
        </div>
      </div>
    `;

    // Add remove event listener
    const removeBtn = item.querySelector('.bookmark-item__remove');
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      removeBookmark(id);
    });

    return item;
  }

  // ==================== REMOVE BOOKMARK ====================
  function removeBookmark(id) {
    // Confirm before delete
    if (!confirm('Hapus bookmark ini?')) return;

    // Remove from storage
    BookmarkSystem.toggleBookmark(id);

    // Update UI
    const categoryCard = document.querySelector(`.category-card__bookmark[data-id="${id}"]`);
    if (categoryCard) {
      categoryCard.classList.remove('bookmarked');
    }

    // Re-render
    renderBookmarks();

    // Show notification
    showNotification('Bookmark dihapus', 'success');
  }

  // ==================== CLEAR ALL BOOKMARKS ====================
  function clearAllBookmarks() {
    const bookmarks = BookmarkSystem.getBookmarks();
    
    if (bookmarks.length === 0) {
      showNotification('Tidak ada bookmark untuk dihapus', 'info');
      return;
    }

    if (!confirm(`Hapus semua ${bookmarks.length} bookmark?`)) return;

    // Clear storage
    BookmarkSystem.clearBookmarks();

    // Update all bookmark buttons
    document.querySelectorAll('.category-card__bookmark').forEach(btn => {
      btn.classList.remove('bookmarked');
    });

    // Re-render
    renderBookmarks();

    // Show notification
    showNotification('Semua bookmark dihapus', 'success');
  }

  // Export feature removed - pure front-end only

  // ==================== HELPER FUNCTIONS ====================
  function getCategoryLabel(id) {
    const labels = {
      'alam': 'Wisata Alam',
      'rumah-adat': 'Rumah Adat',
      'pakaian': 'Tenun & Kain',
      'makanan': 'Kuliner',
      'seni': 'Seni',
      'suku': 'Suku & Adat',
      'tradisi': 'Tradisi'
    };
    return labels[id] || id;
  }

  function showEmptyState() {
    DOM.bookmarkList.innerHTML = `
      <div class="bookmark-empty">
        <div class="bookmark-empty__icon">📌</div>
        <p class="bookmark-empty__text">
          Belum ada bookmark tersimpan
        </p>
        <p class="bookmark-empty__hint">
          Klik tombol <span class="bookmark-icon">☆</span> pada kategori di atas untuk menyimpan
        </p>
      </div>
    `;
  }

  function showNoResults() {
    DOM.bookmarkList.innerHTML = `
      <div class="bookmark-empty">
        <div class="bookmark-empty__icon">🔍</div>
        <p class="bookmark-empty__text">
          Tidak ada hasil yang cocok
        </p>
        <p class="bookmark-empty__hint">
          Coba ubah filter atau kata kunci pencarian
        </p>
      </div>
    `;
  }

  function updateStats(count) {
    if (!DOM.bookmarkStats) return;
    
    const total = BookmarkSystem.getBookmarkCount();
    
    if (count === total) {
      DOM.bookmarkStats.textContent = `${total} bookmark tersimpan`;
    } else {
      DOM.bookmarkStats.textContent = `Menampilkan ${count} dari ${total} bookmark`;
    }
  }

  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-toast--${type}`;
    notification.textContent = message;
    
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    };
    
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: ${colors[type] || colors.success};
      color: #fff;
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

  // ==================== EVENT LISTENERS ====================
  function initEventListeners() {
    // Filter change
    if (DOM.bookmarkFilter) {
      DOM.bookmarkFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderBookmarks();
      });
    }

    // Search input
    if (DOM.bookmarkSearch) {
      let timeout;
      DOM.bookmarkSearch.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          currentSearch = e.target.value.toLowerCase().trim();
          renderBookmarks();
        }, 300);
      });
    }

    // Clear all button
    if (DOM.clearAllBtn) {
      DOM.clearAllBtn.addEventListener('click', clearAllBookmarks);
    }

    // Export button removed - pure front-end only

    // Listen to bookmark changes from category cards
    document.addEventListener('bookmarkChanged', () => {
      renderBookmarks();
    });
  }

  // ==================== INIT ====================
  function init() {
    if (!DOM.bookmarkList) return;

    initEventListeners();
    renderBookmarks();
    
    console.log('✅ Bookmark Manager initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

})();