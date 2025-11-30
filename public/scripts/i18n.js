/**
 * Internationalization (i18n) Helper
 * Manages language switching and translation loading
 */

class I18n {
  constructor() {
    this.currentLanguage = this.detectLanguage();
    this.translations = {};
    this.loadTranslations();
  }

  detectLanguage() {
    // Check URL path for language code
    const pathMatch = window.location.pathname.match(/^\/(en|fr)/);
    if (pathMatch) {
      return pathMatch[1];
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('fr')) {
      return 'fr';
    }

    // Default to English
    return 'en';
  }

  async loadTranslations() {
    try {
      const response = await fetch(`/locales/${this.currentLanguage}.json`);
      if (response.ok) {
        this.translations = await response.json();
        this.updatePageLanguage();
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to English
      if (this.currentLanguage !== 'en') {
        this.currentLanguage = 'en';
        this.loadTranslations();
      }
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  }

  setLanguage(lang) {
    if (['en', 'fr'].includes(lang)) {
      this.currentLanguage = lang;
      const currentPath = window.location.pathname.replace(/^\/(en|fr)/, '');
      window.location.href = `/${lang}${currentPath}`;
    }
  }

  updatePageLanguage() {
    document.documentElement.lang = this.currentLanguage;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// Initialize i18n
const i18n = new I18n();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}

