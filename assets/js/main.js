document.addEventListener('DOMContentLoaded', function() {
  // ====== NAVIGASI HP (TOGGLE MENU) ======
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      navList.classList.toggle('is-open');
    });
  }

  // ====== SHRINK + TOMBOL KE ATAS ======
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 16) {
      document.body.classList.add('is-menciut');
    } else {
      document.body.classList.remove('is-menciut');
    }

    if (toTop) {
      if (window.scrollY > 420) {
        toTop.classList.add('nampak');
      } else {
        toTop.classList.remove('nampak');
      }
    }
  });
  if (toTop) {
    toTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ====== REVEAL ON SCROLL ======
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // ====== SEARCH CEPAT ======
  const siteSearch = document.getElementById('siteSearch');
  const searchPanel = document.getElementById('searchPanel');
  const daftarCepat = [
    {t:'Honai — Suku Dani', u:'pages/rumah-adat.html#honai'},
    {t:'Rumah Pohon — Korowai', u:'pages/rumah-adat.html#korowai'},
    {t:'Kariwari — Biak', u:'pages/rumah-adat.html#kariwari'},
    {t:'Koteka', u:'pages/pakaian.html#koteka'},
    {t:'Noken (UNESCO 2012)', u:'pages/pakaian.html#noken'},
    {t:'Papeda', u:'pages/makanan.html#papeda'},
    {t:'Ulat Sagu', u:'pages/makanan.html#ulat-sagu'},
    {t:'Ikan Bakar Manokwari', u:'pages/makanan.html#ikan-bakar-manokwari'},
    {t:'Petatas (Ubi Jalar)', u:'pages/makanan.html#petatas'},
    {t:'Barapen', u:'pages/tradisi.html#barapen'},
    {t:'Tifa', u:'pages/seni.html#tifa'},
    {t:'Ukir Asmat', u:'pages/seni.html#asmat'},
    {t:'Tari Yospan', u:'pages/seni.html#yospan'},
    {t:'Raja Ampat', u:'pages/alam.html#raja-ampat'},
    {t:'Puncak Jaya', u:'pages/alam.html#puncak-jaya'},
    {t:'Danau Sentani', u:'pages/alam.html#danau-sentani'},
    {t:'Teluk Cenderawasih', u:'pages/alam.html#teluk-cenderawasih'},
    {t:'Taman Nasional Lorentz', u:'pages/alam.html#lorentz'},
    {t:'Suku Dani', u:'pages/suku.html#dani'},
    {t:'Suku Asmat', u:'pages/suku.html#asmat'},
    {t:'Suku Korowai', u:'pages/suku.html#korowai'},
    {t:'Suku Biak', u:'pages/suku.html#biak'},
    {t:'Suku Yali', u:'pages/suku.html#yali'},
    {t:'Suku Mee/Ekari', u:'pages/suku.html#mee'},
    {t:'Suku Kamoro', u:'pages/suku.html#kamoro'},
    {t:'Suku Sentani', u:'pages/suku.html#sentani'}
  ];

  function tampilkanHasil(list) {
    if (!searchPanel) return;
    searchPanel.innerHTML = '';
    if (list.length === 0) { searchPanel.hidden = true; return; }

    list.forEach(item => {
      const a = document.createElement('a');
      a.href = item.u;
      a.textContent = item.t;
      searchPanel.appendChild(a);
    });
    searchPanel.hidden = false;
  }

  if (siteSearch) {
    siteSearch.addEventListener('input', function() {
      const k = siteSearch.value.toLowerCase().trim();
      if (k === '') {
        searchPanel.hidden = true;
        searchPanel.innerHTML = '';
        return;
      }
      const hasil = daftarCepat.filter(item => item.t.toLowerCase().includes(k));
      tampilkanHasil(hasil.slice(0, 8));
    });

    document.addEventListener('click', function(e) {
      if (searchPanel && !searchPanel.contains(e.target) && e.target !== siteSearch) {
        searchPanel.hidden = true;
      }
    });
  }
});
