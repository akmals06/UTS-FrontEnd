(function() {
  'use strict';

  const ALL_ITEMS_DATA = [
    { id: 'rumah-adat', title: 'Rumah Adat NTT', url: 'pages/rumah-adat/index.html', category: 'Arsitektur', desc: 'Mbaru Niang, Lopo, Sao Ata Mosa' },
    { id: 'mbaru-niang', title: 'Mbaru Niang', url: 'pages/rumah-adat/mbaru-niang.html', category: 'Rumah Adat', desc: 'Rumah kerucut ikonik dari Wae Rebo.' },
    { id: 'mbaru-gendang', title: 'Mbaru Gendang', url: 'pages/rumah-adat/mbaru-gendang.html', category: 'Rumah Adat', desc: 'Rumah drum tradisional Manggarai.' },
    { id: 'sao-ngada', title: 'Sa\'o', url: 'pages/rumah-adat/sao.html', category: 'Rumah Adat', desc: 'Rumah panggung adat Suku Ngada.' },
    { id: 'lopo-timor', title: 'Lopo', url: 'pages/rumah-adat/lopo.html', category: 'Rumah Adat', desc: 'Rumah bulat tradisional Suku Atoni.' },
    { id: 'alam', title: 'Wisata Alam NTT', url: 'pages/alam/index.html', category: 'Wisata', desc: 'Danau Kelimutu, Pulau Komodo, Wae Rebo' },
    { id: 'danau-kelimutu', title: 'Danau Kelimutu', url: 'pages/alam/danau-kelimutu.html', category: 'Wisata Alam', desc: 'Danau vulkanik dengan tiga warna berbeda.' },
    { id: 'pulau-komodo', title: 'Pulau Komodo', url: 'pages/alam/pulau-komodo.html', category: 'Wisata Alam', desc: 'Habitat asli komodo, kadal terbesar di dunia.' },
    { id: 'wae-rebo', title: 'Desa Wae Rebo', url: 'pages/alam/wae-rebo.html', category: 'Wisata Alam', desc: 'Desa tradisional di ketinggian 1.200 mdpl.' },
    { id: 'labuan-bajo', title: 'Labuan Bajo', url: 'pages/alam/labuan-bajo.html', category: 'Wisata Alam', desc: 'Gerbang menuju Taman Nasional Komodo.' },
    { id: 'makanan', title: 'Kuliner Khas', url: 'pages/makanan/index.html', category: 'Kuliner', desc: 'Se\'i, Jagung Bose, Kolo' },
    { id: 'jagung-bose', title: 'Jagung Bose', url: 'pages/makanan/jagung-bose.html', category: 'Kuliner', desc: 'Makanan ritual dari jagung dan labu.' },
    { id: 'kolo', title: 'Kolo', url: 'pages/makanan/kolo.html', category: 'Kuliner', desc: 'Makanan khas upacara Penti suku Ngada.' },
    { id: 'sei', title: 'Se\'i', url: 'pages/makanan/sei.html', category: 'Kuliner', desc: 'Daging asap tradisional khas NTT.' },
    { id: 'pakaian', title: 'Tenun & Kain Adat', url: 'pages/pakaian/index.html', category: 'Tekstil', desc: 'Hinggi, Lau Pahudu, Sarung Sabu' },
    { id: 'hinggi', title: 'Hinggi', url: 'pages/pakaian/hinggi.html', category: 'Tenun', desc: 'Kain tenun ikat khas pria Sumba.' },
    { id: 'lau-pahudu', title: 'Lau Pahudu', url: 'pages/pakaian/lau-pahudu.html', category: 'Tenun', desc: 'Selendang tenun ikat khas perempuan Sumba.' },
    { id: 'sarung-sabu', title: 'Sarung Sabu', url: 'pages/pakaian/sarung-sabu.html', category: 'Tenun', desc: 'Sarung tenun khas Pulau Sabu.' },
    { id: 'seni', title: 'Seni Tradisional', url: 'pages/seni/index.html', category: 'Seni', desc: 'Sasando, Tari Caci, Gong Waning' },
    { id: 'sasando', title: 'Sasando', url: 'pages/seni/sasando.html', category: 'Musik', desc: 'Alat musik petik khas Rote dari daun lontar.' },
    { id: 'tari-caci', title: 'Tari Caci', url: 'pages/seni/tari-caci.html', category: 'Tari', desc: 'Tarian perang cambuk dari Manggarai.' },
    { id: 'tari-likurai', title: 'Tari Likurai', url: 'pages/seni/tari-likurai.html', category: 'Tari', desc: 'Tarian panen yang dibawakan perempuan.' },
    { id: 'gong-waning', title: 'Gong Waning', url: 'pages/seni/gong-waning.html', category: 'Musik', desc: 'Gamelan tradisional Manggarai.' },
    { id: 'tari-padoa', title: 'Tari Padoa', url: 'pages/seni/tari-padoa.html', category: 'Tari', desc: 'Tarian gembira khas suku Ngada.' },
    { id: 'tradisi', title: 'Tradisi & Ritual', url: 'pages/tradisi/index.html', category: 'Budaya', desc: 'Pasola, Penti, Reba, Wulla Poddu' },
    { id: 'pasola', title: 'Pasola', url: 'pages/tradisi/pasola.html', category: 'Tradisi', desc: 'Perang tombak berkuda yang sakral.' },
    { id: 'penti', title: 'Penti', url: 'pages/tradisi/penti.html', category: 'Tradisi', desc: 'Ritual syukuran panen di compang Manggarai.' },
    { id: 'reba', title: 'Reba', url: 'pages/tradisi/reba.html', category: 'Tradisi', desc: 'Upacara pemujaan leluhur suku Ngada.' },
    { id: 'wulla-poddu', title: 'Wulla Poddu', url: 'pages/tradisi/wulla.html', category: 'Tradisi', desc: 'Bulan suci di Sumba untuk ritual.' },
    { id: 'nyale', title: 'Nyale', url: 'pages/tradisi/nyale.html', category: 'Tradisi', desc: 'Ritual tangkap cacing laut untuk ramalan.' },
    { id: 'suku', title: 'Suku & Adat', url: 'pages/suku/index.html', category: 'Budaya', desc: 'Manggarai, Sumba, Ngada, Atoni' },
    { id: 'manggarai', title: 'Manggarai', url: 'pages/suku/manggarai.html', category: 'Suku', desc: 'Suku terbesar di Flores Barat dengan filosofi Todo.' },
    { id: 'sumba', title: 'Sumba', url: 'pages/suku/sumba.html', category: 'Suku', desc: 'Suku dengan kepercayaan Marapu yang kuat.' },
    { id: 'ngada', title: 'Ngada', url: 'pages/suku/ngada.html', category: 'Suku', desc: 'Suku dengan arsitektur Sa\'o yang unik.' },
    { id: 'atoni', title: 'Atoni Meto', url: 'pages/suku/atoni.html', category: 'Suku', desc: 'Suku terbesar di Timor dengan rumah Lopo.' },
    { id: 'rote', title: 'Rote', url: 'pages/suku/rote.html', category: 'Suku', desc: 'Suku dengan alat musik sasando khas.' }
  ];

  const DOM = {
    bookmarkList: document.getElementById('bookmarkList'),
    bookmarkFilter: document.getElementById('bookmarkFilter'),
    bookmarkSearch: document.getElementById('bookmarkSearch'),
    bookmarkStats: document.getElementById('bookmarkStats'),
    clearAllBtn: document.getElementById('clearAllBookmarks')
  };

  let currentFilter = 'all';
  let currentSearch = '';

  function getCorrectPath(url) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
      return '../../' + url;
    }
    return url;
  }

  function renderBookmarks() {
    if (!DOM.bookmarkList) return;

    const bookmarkIds = BookmarkSystem.getBookmarks();
    if (bookmarkIds.length === 0) {
      showEmptyState();
      updateStats(0);
      return;
    }

    const bookmarkedItems = bookmarkIds.map(id => ALL_ITEMS_DATA.find(item => item.id === id)).filter(Boolean);

    let filtered = bookmarkedItems;
    if (currentFilter !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase().replace(/ /g, '-') === currentFilter || item.id === currentFilter);
    }

    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.desc.toLowerCase().includes(searchLower)
      );
    }

    DOM.bookmarkList.innerHTML = '';

    if (filtered.length === 0) {
      showNoResults();
      updateStats(0);
      return;
    }

    filtered.forEach(itemData => {
      const itemElement = createBookmarkItem(itemData);
      DOM.bookmarkList.appendChild(itemElement);
    });

    updateStats(filtered.length);
  }

  function createBookmarkItem(itemData) {
    const item = document.createElement('a');
    item.className = 'bookmark-item';
    item.href = getCorrectPath(itemData.url);
    item.setAttribute('data-id', itemData.id);

    item.innerHTML = `
      <div class="bookmark-item__header">
        <span class="bookmark-item__category">${itemData.category}</span>
        <button class="bookmark-item__remove" data-id="${itemData.id}" aria-label="Hapus bookmark">×</button>
      </div>
      <div class="bookmark-item__content">
        <h3 class="bookmark-item__title">${itemData.title}</h3>
        <p class="bookmark-item__desc">${itemData.desc}</p>
      </div>
    `;

    item.querySelector('.bookmark-item__remove').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeBookmark(itemData.id);
    });

    return item;
  }

  function removeBookmark(id) {
    if (!confirm(`Hapus '${ALL_ITEMS_DATA.find(i=>i.id===id)?.title || 'item'}' dari koleksi?`)) return;

    BookmarkSystem.toggleBookmark(id);
    
    const buttonOnPage = document.querySelector(`.bookmark-icon[data-id='${id}'], .category-card__bookmark[data-id='${id}']`);
    if (buttonOnPage) {
      buttonOnPage.classList.remove('bookmarked');
    }

    renderBookmarks();
    showNotification('Bookmark dihapus');
  }

  function clearAllBookmarks() {
    const count = BookmarkSystem.getBookmarkCount();
    if (count === 0) {
      window.showNotification('Tidak ada bookmark untuk dihapus', 'info');
      return;
    }
    if (!confirm(`Hapus semua ${count} bookmark?`)) return;

    BookmarkSystem.clearBookmarks();
    document.querySelectorAll('.bookmarked').forEach(el => el.classList.remove('bookmarked'));
    renderBookmarks();
    showNotification('Semua bookmark telah dihapus');
  }

  function showEmptyState() {
    DOM.bookmarkList.innerHTML = `
      <div class="bookmark-empty">
        <p class="bookmark-empty__text">Belum ada koleksi tersimpan</p>
        <p class="bookmark-empty__hint">
              Klik tombol <i class="fa fa-heart-o" aria-hidden="true"></i> pada kategori di atas untuk menyimpan
        </p>
      </div>`;
  }

  function showNoResults() {
    DOM.bookmarkList.innerHTML = `
      <div class="bookmark-empty">
        <p class="bookmark-empty__text">Tidak ada hasil yang cocok</p>
        <p class="bookmark-empty__hint">Coba ubah filter atau kata kunci pencarian Anda.</p>
      </div>`;
  }

  function updateStats(count) {
    if (!DOM.bookmarkStats) return;
    const total = BookmarkSystem.getBookmarkCount();
    DOM.bookmarkStats.textContent = (currentFilter === 'all' && currentSearch === '')
      ? `${total} koleksi tersimpan`
      : `Menampilkan ${count} dari ${total} koleksi`;
  }

  

  function initEventListeners() {
    if (DOM.bookmarkFilter) {
      DOM.bookmarkFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderBookmarks();
      });
    }

    if (DOM.bookmarkSearch) {
      let timeout;
      DOM.bookmarkSearch.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          currentSearch = e.target.value;
          renderBookmarks();
        }, 300);
      });
    }

    if (DOM.clearAllBtn) {
      DOM.clearAllBtn.addEventListener('click', clearAllBookmarks);
    }

    document.addEventListener('bookmarkChanged', renderBookmarks);
  }

  function init() {
    if (!document.getElementById('bookmarks')) return; 
    initEventListeners();
    renderBookmarks();
    console.log('Bookmark Manager (Refactored) initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
