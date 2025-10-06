/* =====================================================
   SEARCH.JS - FINAL FIXED VERSION
   Global Search + Page Search
   ===================================================== */

// ==================== PAGE SEARCH (Filter Bar) ====================
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('#pageSearch');
  
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        performSearch(this.value);
        if (typeof SearchHistory !== 'undefined' && this.value.trim()) {
          SearchHistory.addSearch(this.value.trim());
        }
      }, 300);
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        clearTimeout(searchTimeout);
        performSearch(this.value);
        if (typeof SearchHistory !== 'undefined' && this.value.trim()) {
          SearchHistory.addSearch(this.value.trim());
        }
      }
    });
  }

  // Init global search
  initGlobalSearch();
});

function performSearch(query) {
  const searchTerm = query.toLowerCase().trim();
  const cards = document.querySelectorAll(
    '.rumahadat-card, .category-card, .alam-card, .makanan-card, ' +
    '.pakaian-card, .seni-card, .tradisi-card, .suku-card'
  );
  let foundCount = 0;
  
  if (searchTerm === '') {
    cards.forEach(card => {
      card.style.display = '';
      card.classList.remove('hidden');
    });
    updateSearchStats(cards.length);
    return;
  }
  
  cards.forEach(card => {
    const title = card.querySelector(
      '.rumahadat-card__title, .category-card__title, .alam-card__title, ' +
      '.makanan-card__title, .pakaian-card__title, .seni-card__title, ' +
      '.tradisi-card__title, .suku-card__title'
    )?.textContent.toLowerCase() || '';
    
    const location = card.querySelector(
      '.rumahadat-card__location, .alam-card__location, .makanan-card__location, ' +
      '.pakaian-card__location, .seni-card__location, .tradisi-card__location, ' +
      '.suku-card__location'
    )?.textContent.toLowerCase() || '';
    
    const desc = card.querySelector(
      '.rumahadat-card__desc, .category-card__desc, .alam-card__desc, ' +
      '.makanan-card__desc, .pakaian-card__desc, .seni-card__desc, ' +
      '.tradisi-card__desc, .suku-card__desc'
    )?.textContent.toLowerCase() || '';
    
    const tags = card.getAttribute('data-tags')?.toLowerCase() || '';
    
    const isMatch = title.includes(searchTerm) || 
                   location.includes(searchTerm) || 
                   desc.includes(searchTerm) ||
                   tags.includes(searchTerm);
    
    if (isMatch) {
      card.style.display = '';
      card.classList.remove('hidden');
      foundCount++;
    } else {
      card.style.display = 'none';
      card.classList.add('hidden');
    }
  });
  
  updateSearchStats(foundCount);
  toggleNoResults(foundCount === 0);
}

function updateSearchStats(count) {
  const statsElement = document.getElementById('filterStats');
  if (statsElement) {
    const total = document.querySelectorAll(
      '.rumahadat-card, .category-card, .alam-card, .makanan-card, ' +
      '.pakaian-card, .seni-card, .tradisi-card, .suku-card'
    ).length;
    statsElement.textContent = count === total 
      ? `Menampilkan ${total} item`
      : `Menampilkan ${count} dari ${total} item`;
  }
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

// ==================== GLOBAL SEARCH (Navbar) ====================
function initGlobalSearch() {
  const globalSearchInput = document.getElementById('searchInput');
  const searchPanel = document.getElementById('searchPanel');
  
  if (!globalSearchInput || !searchPanel) return;

  // Search data
  const searchData = [
    // Rumah Adat
    { title: 'Rumah Adat NTT', url: 'pages/rumah-adat/index.html', category: 'Arsitektur', keywords: 'mbaru niang gendang sao lopo rumah adat' },
    { title: 'Mbaru Niang', url: 'pages/rumah-adat/mbaru-niang.html', category: 'Rumah Adat', keywords: 'wae rebo manggarai flores kerucut' },
    { title: 'Mbaru Gendang', url: 'pages/rumah-adat/mbaru-gendang.html', category: 'Rumah Adat', keywords: 'manggarai flores drum' },
    { title: 'Sao Ngada', url: 'pages/rumah-adat/sao.html', category: 'Rumah Adat', keywords: 'bajawa ngada flores panggung' },
    { title: 'Lopo', url: 'pages/rumah-adat/lopo.html', category: 'Rumah Adat', keywords: 'timor atoni bulat ume kbubu' },
    
    // Alam
    { title: 'Wisata Alam NTT', url: 'pages/alam/index.html', category: 'Wisata', keywords: 'alam pantai gunung danau komodo' },
    { title: 'Danau Kelimutu', url: 'pages/alam/danau-kelimutu.html', category: 'Wisata Alam', keywords: 'danau tiga warna ende flores vulkanik' },
    { title: 'Pulau Komodo', url: 'pages/alam/pulau-komodo.html', category: 'Wisata Alam', keywords: 'komodo dragon naga taman nasional' },
    { title: 'Wae Rebo', url: 'pages/alam/wae-rebo.html', category: 'Wisata Alam', keywords: 'desa awan manggarai mbaru' },
    { title: 'Labuan Bajo', url: 'pages/alam/labuan-bajo.html', category: 'Wisata Alam', keywords: 'pelabuhan gerbang komodo diving' },
    
    // Makanan
    { title: 'Kuliner NTT', url: 'pages/makanan/index.html', category: 'Kuliner', keywords: 'makanan masakan khas kuliner' },
    { title: 'Jagung Bose', url: 'pages/makanan/jagung-bose.html', category: 'Kuliner', keywords: 'jagung labu ritual manggarai' },
    { title: 'Kolo', url: 'pages/makanan/kolo.html', category: 'Kuliner', keywords: 'upacara penti ngada ubi' },
    { title: 'Sei', url: 'pages/makanan/sei.html', category: 'Kuliner', keywords: 'daging asap tradisional' },
    
    // Pakaian
    { title: 'Tenun & Kain Adat', url: 'pages/pakaian/index.html', category: 'Tekstil', keywords: 'tenun ikat songket kain' },
    { title: 'Hinggi', url: 'pages/pakaian/hinggi.html', category: 'Tenun', keywords: 'kain pria sumba ikat marapu' },
    { title: 'Lau Pahudu', url: 'pages/pakaian/lau-pahudu.html', category: 'Tenun', keywords: 'selendang perempuan sumba' },
    { title: 'Sarung Sabu', url: 'pages/pakaian/sarung-sabu.html', category: 'Tenun', keywords: 'sabu rote geometris' },
    
    // Seni
    { title: 'Seni Tradisional', url: 'pages/seni/index.html', category: 'Seni', keywords: 'ukiran patung musik tari' },
    { title: 'Sasando', url: 'pages/seni/sasando.html', category: 'Musik', keywords: 'alat musik lontar rote' },
    { title: 'Tari Caci', url: 'pages/seni/tari-caci.html', category: 'Tari', keywords: 'perang cambuk manggarai' },
    { title: 'Tari Likurai', url: 'pages/seni/tari-likurai.html', category: 'Tari', keywords: 'panen manggarai perempuan' },
    { title: 'Gong Waning', url: 'pages/seni/gong-waning.html', category: 'Musik', keywords: 'gamelan manggarai' },
    { title: 'Tari Padoa', url: 'pages/seni/tari-padoa.html', category: 'Tari', keywords: 'gembira ngada flores' },
    
    // Tradisi
    { title: 'Tradisi NTT', url: 'pages/tradisi/index.html', category: 'Budaya', keywords: 'upacara ritual adat tradisi' },
    { title: 'Pasola', url: 'pages/tradisi/pasola.html', category: 'Tradisi', keywords: 'perang tombak berkuda sumba' },
    { title: 'Penti', url: 'pages/tradisi/penti.html', category: 'Tradisi', keywords: 'ritual syukuran manggarai' },
    { title: 'Reba', url: 'pages/tradisi/reba.html', category: 'Tradisi', keywords: 'upacara ngada leluhur' },
    { title: 'Wulla Poddu', url: 'pages/tradisi/wulla.html', category: 'Tradisi', keywords: 'bulan suci sumba marapu' },
    { title: 'Nyale', url: 'pages/tradisi/nyale.html', category: 'Tradisi', keywords: 'cacing laut sumba panen' },
    
    // Suku
    { title: 'Suku & Adat', url: 'pages/suku/index.html', category: 'Budaya', keywords: 'suku adat etnis' },
    { title: 'Manggarai', url: 'pages/suku/manggarai.html', category: 'Suku', keywords: 'flores barat todo mbaru' },
    { title: 'Sumba', url: 'pages/suku/sumba.html', category: 'Suku', keywords: 'marapu pasola hinggi' },
    { title: 'Ngada', url: 'pages/suku/ngada.html', category: 'Suku', keywords: 'bajawa ngadhu bhaga' },
    { title: 'Atoni Meto', url: 'pages/suku/atoni.html', category: 'Suku', keywords: 'timor lopo ume kbubu' },
    { title: 'Rote', url: 'pages/suku/rote.html', category: 'Suku', keywords: 'sasando lontar selatan' }
  ];

  let searchTimeout;

  // Input event
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

  // Enter key
  globalSearchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = this.value.trim();
      if (query) {
        performGlobalSearch(query, searchData, searchPanel);
      }
    }
  });

  // Close panel on outside click
  document.addEventListener('click', function(e) {
    if (!globalSearchInput.contains(e.target) && !searchPanel.contains(e.target)) {
      searchPanel.classList.add('hidden');
    }
  });

  // Focus handler
  globalSearchInput.addEventListener('focus', function() {
    if (this.value.trim().length > 0) {
      searchPanel.classList.remove('hidden');
    }
  });
}

function performGlobalSearch(query, data, panel) {
  const searchTerm = query.toLowerCase();
  const results = data.filter(item => {
    return item.title.toLowerCase().includes(searchTerm) ||
           item.category.toLowerCase().includes(searchTerm) ||
           item.keywords.toLowerCase().includes(searchTerm);
  });

  if (results.length === 0) {
    panel.innerHTML = `
      <div class="search__item" style="opacity: 0.6; text-align: center; padding: 20px;">
        Tidak ada hasil ditemukan
      </div>
    `;
    panel.classList.remove('hidden');
    return;
  }

  // Limit to 8 results
  const limitedResults = results.slice(0, 8);
  
  panel.innerHTML = limitedResults.map(item => `
    <a href="${getCorrectPath(item.url)}" class="search__item">
      <div style="font-weight: 600; margin-bottom: 4px;">${highlightMatch(item.title, searchTerm)}</div>
      <div style="font-size: 0.85rem; opacity: 0.7;">${item.category}</div>
    </a>
  `).join('');

  panel.classList.remove('hidden');

  // Track search
  if (typeof SearchHistory !== 'undefined') {
    SearchHistory.addSearch(query);
  }
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<strong style="color: var(--primary);">$1</strong>');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getCorrectPath(url) {
  const currentPath = window.location.pathname;
  
  // If at root (index.html)
  if (currentPath.endsWith('index.html') && !currentPath.includes('/pages/')) {
    return url;
  }
  
  // If inside pages folder
  if (currentPath.includes('/pages/')) {
    return '../../' + url;
  }
  
  return url;
}

console.log('✅ search.js loaded');