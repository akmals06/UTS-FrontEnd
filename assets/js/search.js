(function() {
  'use strict';

  // ==================== DOM & STATE  ====================
  const pageSearchInput = document.querySelector('#pageSearch');
  const regionFilterInput = document.querySelector('#regionFilter');
  const filterStats = document.getElementById('filterStats');
  const cards = document.querySelectorAll(
    '.rumahadat-card, .category-card, .alam-card, .makanan-card, ' +
    '.pakaian-card, .seni-card, .tradisi-card, .suku-card'
  );

  let currentRegion = 'all';
  let currentSearch = '';

  // ==================== PAGE-LEVEL  ====================
  function filterAndRender() {
    if (cards.length === 0) return;

    let visibleCount = 0;
    
    cards.forEach(card => {
      const region = card.getAttribute('data-region') || '';
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      
      const titleEl = card.querySelector('.rumahadat-card__title, .category-card__title, .alam-card__title, .makanan-card__title, .pakaian-card__title, .seni-card__title, .tradisi-card__title, .suku-card__title');
      const descEl = card.querySelector('.rumahadat-card__desc, .category-card__desc, .alam-card__desc, .makanan-card__desc, .pakaian-card__desc, .seni-card__desc, .tradisi-card__desc, .suku-card__desc');
      const locationEl = card.querySelector('.rumahadat-card__location, .alam-card__location, .makanan-card__location, .pakaian-card__location, .seni-card__location, .tradisi-card__location, .suku-card__location');
      
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
  }

  function updateStats(visible, total) {
    if (!filterStats) return;
    filterStats.textContent = visible === total 
      ? `Menampilkan ${total} item`
      : `Menampilkan ${visible} dari ${total} item`;
  }

  function toggleNoResults(show) {
    const noResults = document.getElementById('noResults');
    if (noResults) {
      noResults.style.display = show ? 'block' : 'none';
    }
  }

  function initPageFilters() {
    if (cards.length === 0) return;
    if (regionFilterInput) {
      if (typeof FilterSystem !== 'undefined') {
        const savedRegion = FilterSystem.getFilterPreference();
        if (savedRegion) {
          regionFilterInput.value = savedRegion;
          currentRegion = savedRegion;
        }
      }
      regionFilterInput.addEventListener('change', (e) => {
        currentRegion = e.target.value;
        filterAndRender();
        if (typeof FilterSystem !== 'undefined') {
          FilterSystem.saveFilterPreference(currentRegion);
        }
      });
    }

    if (pageSearchInput) {
      let timeout;
      pageSearchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          currentSearch = e.target.value.toLowerCase().trim();
          filterAndRender();
        }, 300);
      });
    }
    filterAndRender();
  }

  // ==================== GLOBAL NAVBAR SEARCH ====================
  function initGlobalSearch() {
    const globalSearchInput = document.getElementById('searchInput');
    const searchPanel = document.getElementById('searchPanel');
    if (!globalSearchInput || !searchPanel) return;

    const searchData = [
      { title: 'Rumah Adat NTT', url: 'pages/rumah-adat/index.html', category: 'Arsitektur', keywords: 'mbaru niang gendang sao lopo rumah adat' },
      { title: 'Mbaru Niang', url: 'pages/rumah-adat/mbaru-niang.html', category: 'Rumah Adat', keywords: 'wae rebo manggarai flores kerucut' },
      { title: 'Mbaru Gendang', url: 'pages/rumah-adat/mbaru-gendang.html', category: 'Rumah Adat', keywords: 'manggarai flores drum' },
      { title: 'Sao Ngada', url: 'pages/rumah-adat/sao.html', category: 'Rumah Adat', keywords: 'bajawa ngada flores panggung' },
      { title: 'Lopo', url: 'pages/rumah-adat/lopo.html', category: 'Rumah Adat', keywords: 'timor atoni bulat ume kbubu' },
      { title: 'Wisata Alam NTT', url: 'pages/alam/index.html', category: 'Wisata', keywords: 'alam pantai gunung danau komodo' },
      { title: 'Danau Kelimutu', url: 'pages/alam/danau-kelimutu.html', category: 'Wisata Alam', keywords: 'danau tiga warna ende flores vulkanik' },
      { title: 'Pulau Komodo', url: 'pages/alam/pulau-komodo.html', category: 'Wisata Alam', keywords: 'komodo dragon naga taman nasional' },
      { title: 'Wae Rebo', url: 'pages/alam/wae-rebo.html', category: 'Wisata Alam', keywords: 'desa awan manggarai mbaru' },
      { title: 'Labuan Bajo', url: 'pages/alam/labuan-bajo.html', category: 'Wisata Alam', keywords: 'pelabuhan gerbang komodo diving' },
      { title: 'Kuliner NTT', url: 'pages/makanan/index.html', category: 'Kuliner', keywords: 'makanan masakan khas kuliner' },
      { title: 'Jagung Bose', url: 'pages/makanan/jagung-bose.html', category: 'Kuliner', keywords: 'jagung labu ritual manggarai' },
      { title: 'Kolo', url: 'pages/makanan/kolo.html', category: 'Kuliner', keywords: 'upacara penti ngada ubi' },
      { title: 'Sei', url: 'pages/makanan/sei.html', category: 'Kuliner', keywords: 'daging asap tradisional' },
      { title: 'Tenun & Kain Adat', url: 'pages/pakaian/index.html', category: 'Tekstil', keywords: 'tenun ikat songket kain' },
      { title: 'Hinggi', url: 'pages/pakaian/hinggi.html', category: 'Tenun', keywords: 'kain pria sumba ikat marapu' },
      { title: 'Lau Pahudu', url: 'pages/pakaian/lau-pahudu.html', category: 'Tenun', keywords: 'selendang perempuan sumba' },
      { title: 'Sarung Sabu', url: 'pages/pakaian/sarung-sabu.html', category: 'Tenun', keywords: 'sabu rote geometris' },
      { title: 'Seni Tradisional', url: 'pages/seni/index.html', category: 'Seni', keywords: 'ukiran patung musik tari' },
      { title: 'Sasando', url: 'pages/seni/sasando.html', category: 'Musik', keywords: 'alat musik lontar rote' },
      { title: 'Tari Caci', url: 'pages/seni/tari-caci.html', category: 'Tari', keywords: 'perang cambuk manggarai' },
      { title: 'Tari Likurai', url: 'pages/seni/tari-likurai.html', category: 'Tari', keywords: 'panen manggarai perempuan' },
      { title: 'Gong Waning', url: 'pages/seni/gong-waning.html', category: 'Musik', keywords: 'gamelan manggarai' },
      { title: 'Tari Padoa', url: 'pages/seni/tari-padoa.html', category: 'Tari', keywords: 'gembira ngada flores' },
      { title: 'Tradisi NTT', url: 'pages/tradisi/index.html', category: 'Budaya', keywords: 'upacara ritual adat tradisi' },
      { title: 'Pasola', url: 'pages/tradisi/pasola.html', category: 'Tradisi', keywords: 'perang tombak berkuda sumba' },
      { title: 'Penti', url: 'pages/tradisi/penti.html', category: 'Tradisi', keywords: 'ritual syukuran manggarai' },
      { title: 'Reba', url: 'pages/tradisi/reba.html', category: 'Tradisi', keywords: 'upacara ngada leluhur' },
      { title: 'Wulla Poddu', url: 'pages/tradisi/wulla.html', category: 'Tradisi', keywords: 'bulan suci sumba marapu' },
      { title: 'Nyale', url: 'pages/tradisi/nyale.html', category: 'Tradisi', keywords: 'cacing laut sumba panen' },
      { title: 'Suku & Adat', url: 'pages/suku/index.html', category: 'Budaya', keywords: 'suku adat etnis' },
      { title: 'Manggarai', url: 'pages/suku/manggarai.html', category: 'Suku', keywords: 'flores barat todo mbaru' },
      { title: 'Sumba', url: 'pages/suku/sumba.html', category: 'Suku', keywords: 'marapu pasola hinggi' },
      { title: 'Ngada', url: 'pages/suku/ngada.html', category: 'Suku', keywords: 'bajawa ngadhu bhaga' },
      { title: 'Atoni Meto', url: 'pages/suku/atoni.html', category: 'Suku', keywords: 'timor lopo ume kbubu' },
      { title: 'Rote', url: 'pages/suku/rote.html', category: 'Suku', keywords: 'sasando lontar selatan' }
    ];

    let searchTimeout;
    globalSearchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      if (query.length === 0) {
        searchPanel.classList.add('hidden');
        return;
      }
      searchTimeout = setTimeout(() => {
        performGlobalSearch(query, searchData, searchPanel);
      }, 200);
    });

    document.addEventListener('click', (e) => {
      if (!globalSearchInput.contains(e.target) && !searchPanel.contains(e.target)) {
        searchPanel.classList.add('hidden');
      }
    });
  }

  function performGlobalSearch(query, data, panel) {
    const searchTerm = query.toLowerCase();
    const results = data.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.keywords.toLowerCase().includes(searchTerm)
    ).slice(0, 8);

    if (results.length === 0) {
      panel.innerHTML = `<div class="search__item" style="text-align: center; padding: 20px;">Tidak ada hasil ditemukan</div>`;
    } else {
      panel.innerHTML = results.map(item => `
        <a href="${getCorrectPath(item.url)}" class="search__item">
          <div>${highlightMatch(item.title, searchTerm)}</div>
          <div style="font-size: 0.85rem; opacity: 0.7;">${item.category}</div>
        </a>
      `).join('');
    }
    panel.classList.remove('hidden');
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\\\]\\]/g, '\\$&');
  }

  window.getCorrectPath = function(url) {
    const currentPath = window.location.pathname;
    const isRoot = currentPath.endsWith('/') || currentPath.endsWith('index.html');
    const isSubPage = currentPath.includes('/pages/');

    if (isSubPage) {
      return '../../' + url;
    } else if (isRoot) {
      return url;
    }
    return url;
  }

  // ==================== INITIALIZATION ====================
  function init() {
    initPageFilters();
    initGlobalSearch();
    console.log('search.js consolidated and initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();