function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Storage error:', e);
    return false;
  }
}

function load(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Load error:', e);
    return null;
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Remove error:', e);
    return false;
  }
}

// ==================== BOOKMARK SYSTEM ====================
const BookmarkSystem = {
  STORAGE_KEY: 'ntt_bookmarks',
  
  getBookmarks: function() {
    const data = load(this.STORAGE_KEY);
    return data || [];
  },
  
  saveBookmarks: function(bookmarks) {
    return save(this.STORAGE_KEY, bookmarks);
  },
  
  toggleBookmark: function(itemId) {
    let bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(itemId);
    
    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(itemId);
    }
    
    this.saveBookmarks(bookmarks);
    return bookmarks;
  },
  
  isBookmarked: function(itemId) {
    return this.getBookmarks().includes(itemId);
  },
  
  clearBookmarks: function() {
    return remove(this.STORAGE_KEY);
  },
  
  getBookmarkCount: function() {
    return this.getBookmarks().length;
  }
};

// ==================== FILTER SYSTEM ====================
const FilterSystem = {
  STORAGE_KEY: 'ntt_filter',
  
  saveFilterPreference: function(wilayah) {
    return save(this.STORAGE_KEY, wilayah);
  },
  
  getFilterPreference: function() {
    const data = load(this.STORAGE_KEY);
    return data || 'all';
  },
  
  clearFilter: function() {
    return remove(this.STORAGE_KEY);
  }
};

// ==================== SEARCH HISTORY ====================
const SearchHistory = {
  STORAGE_KEY: 'ntt_search_history',
  MAX_ITEMS: 10,
  
  addSearch: function(query) {
    if (!query || query.trim() === '') return;
    
    let history = load(this.STORAGE_KEY) || [];
    
    history = history.filter(item => item !== query);
    
    history.unshift(query);
    
    if (history.length > this.MAX_ITEMS) {
      history = history.slice(0, this.MAX_ITEMS);
    }
    
    save(this.STORAGE_KEY, history);
  },
  
  getHistory: function() {
    return load(this.STORAGE_KEY) || [];
  },
  
  clearHistory: function() {
    return remove(this.STORAGE_KEY);
  },
  
  removeItem: function(query) {
    let history = this.getHistory();
    history = history.filter(item => item !== query);
    save(this.STORAGE_KEY, history);
  }
};

// ==================== VISIT TRACKER ====================
const VisitTracker = {
  STORAGE_KEY: 'ntt_visits',
  MAX_VISITS: 10,
  
  trackVisit: function() {
    let visits = load(this.STORAGE_KEY) || [];
    
    const newVisit = {
      url: window.location.pathname,
      page: document.title,
      time: new Date().toISOString()
    };
    
    visits.unshift(newVisit);
    
    if (visits.length > this.MAX_VISITS) {
      visits = visits.slice(0, this.MAX_VISITS);
    }
    
    save(this.STORAGE_KEY, visits);
  },
  
  getVisits: function() {
    return load(this.STORAGE_KEY) || [];
  },
  
  clearVisits: function() {
    return remove(this.STORAGE_KEY);
  }
};

// Track current visit on page load
document.addEventListener('DOMContentLoaded', () => {
  VisitTracker.trackVisit();
});

// ==================== DEBUG HELPERS ====================
window.NTTStorage = {
  showData: function() {
    console.group('NTT Storage Data');
    console.log('Bookmarks:', BookmarkSystem.getBookmarks());
    console.log('Filter:', FilterSystem.getFilterPreference());
    console.log('Search History:', SearchHistory.getHistory());
    console.log('Visits:', VisitTracker.getVisits());
    console.groupEnd();
  },
  
  clearAll: function() {
    if (confirm('Hapus semua data localStorage?')) {
      BookmarkSystem.clearBookmarks();
      FilterSystem.clearFilter();
      SearchHistory.clearHistory();
      VisitTracker.clearVisits();
      console.log('All data cleared');
      location.reload();
    }
  }
};

window.showData = window.NTTStorage.showData;
window.clearData = window.NTTStorage.clearAll;

window.BookmarkSystem = BookmarkSystem;
window.FilterSystem = FilterSystem;
window.SearchHistory = SearchHistory;
window.VisitTracker = VisitTracker;

console.log('localStorage.js loaded');