/**
 * Header Component
 * Responsive header for desktop and mobile
 * Supports multilanguage (English/French)
 */

class Header {
  constructor(language = 'en') {
    this.language = language;
    this.translations = this.loadTranslations();
    this.isMobileMenuOpen = false;
  }

  loadTranslations() {
    // Translations will be loaded from locales
    return {
      en: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        pricing: 'Pricing',
        blog: 'Blog',
        insights: 'Insights',
        resources: 'Resources',
        company: 'Company',
        portfolio: 'Portfolio',
        successStories: 'Success Stories',
        caseStudies: 'Case Studies',
        contact: 'Contact',
        menu: 'Menu',
        close: 'Close'
      },
      fr: {
        home: 'Accueil',
        about: 'À propos',
        services: 'Services',
        pricing: 'Tarification',
        blog: 'Blog',
        insights: 'Aperçus',
        resources: 'Ressources',
        company: 'Entreprise',
        portfolio: 'Portfolio',
        successStories: 'Histoires de succès',
        caseStudies: 'Études de cas',
        contact: 'Contact',
        menu: 'Menu',
        close: 'Fermer'
      }
    };
  }

  render() {
    const t = this.translations[this.language];
    
    return `
      <header class="header" role="banner">
        <div class="header-container">
          <div class="header-logo">
            <a href="/${this.language}/" aria-label="${t.home}" class="logo-link">
              <img src="/assets/images/Logo20.png" alt="Digital Relevance" class="logo-img" />
              <span class="logo-text">Digital Relevance</span>
            </a>
          </div>
          
          <nav class="header-nav" role="navigation" aria-label="Main navigation">
            <button 
              class="mobile-menu-toggle" 
              aria-label="${t.menu}"
              aria-expanded="false"
              id="mobile-menu-btn"
            >
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
            
            <ul class="nav-menu" id="nav-menu">
              <li><a href="/${this.language}/" class="nav-link">${t.home}</a></li>
              <li><a href="/${this.language}/services" class="nav-link">${t.services}</a></li>
              <li><a href="/${this.language}/pricing" class="nav-link">${t.pricing}</a></li>
              <li class="nav-dropdown">
                <a href="#" class="nav-link dropdown-toggle" id="resources-toggle">${t.resources} <span class="dropdown-arrow">▼</span></a>
                <ul class="dropdown-menu" id="resources-dropdown">
                  <li><a href="/${this.language}/blog" class="dropdown-link">${t.blog}</a></li>
                  <li><a href="/${this.language}/insights" class="dropdown-link">${t.insights}</a></li>
                </ul>
              </li>
              <li class="nav-dropdown">
                <a href="#" class="nav-link dropdown-toggle" id="company-toggle">${t.company} <span class="dropdown-arrow">▼</span></a>
                <ul class="dropdown-menu" id="company-dropdown">
                  <li><a href="/${this.language}/about" class="dropdown-link">${t.about}</a></li>
                  <li><a href="/${this.language}/portfolio" class="dropdown-link">${t.portfolio}</a></li>
                </ul>
              </li>
              <li><a href="/${this.language}/case-studies" class="nav-link">${t.caseStudies}</a></li>
              <li><a href="/${this.language}/success-stories" class="nav-link">${t.successStories}</a></li>
              <li><a href="/${this.language}/contact" class="btn btn-nav">${t.contact}</a></li>
              <li class="currency-switcher" id="currency-switcher">
                <span class="currency-label">USD</span>
                <div class="currency-dropdown" id="currency-dropdown">
                  <button class="currency-option" data-currency="CAD">CAD</button>
                  <button class="currency-option active" data-currency="USD">USD</button>
                </div>
              </li>
              <li class="language-switcher">
                <a href="/en${window.location.pathname.replace(/^\/(en|fr)/, '')}" class="lang-link ${this.language === 'en' ? 'active' : ''}">EN</a>
                <span class="lang-separator">|</span>
                <a href="/fr${window.location.pathname.replace(/^\/(en|fr)/, '')}" class="lang-link ${this.language === 'fr' ? 'active' : ''}">FR</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }

  init() {
    const headerElement = document.getElementById('header');
    if (headerElement) {
      headerElement.innerHTML = this.render();
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', this.isMobileMenuOpen);
      });
    }

    // Currency switcher
    this.attachCurrencyListeners();
    
    // Dropdown menus
    this.attachDropdownListeners();

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMobileMenuOpen && 
          !navMenu.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        this.isMobileMenuOpen = false;
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  attachCurrencyListeners() {
    const currencySwitcher = document.getElementById('currency-switcher');
    const currencyDropdown = document.getElementById('currency-dropdown');
    const currencyLabel = currencySwitcher?.querySelector('.currency-label');
    const currencyOptions = currencyDropdown?.querySelectorAll('.currency-option');

    if (!currencySwitcher || !currencyDropdown || !window.currencyDetector) return;

    // Toggle dropdown
    currencyLabel?.addEventListener('click', (e) => {
      e.stopPropagation();
      currencyDropdown.classList.toggle('active');
    });

    // Handle currency selection
    currencyOptions?.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const currency = option.getAttribute('data-currency');
        window.currencyDetector.setCurrency(currency);
        currencyDropdown.classList.remove('active');
        this.updateCurrencyDisplay();
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!currencySwitcher.contains(e.target)) {
        currencyDropdown.classList.remove('active');
      }
    });

    // Update display when currency changes
    window.currencyDetector.onCurrencyChange(() => {
      this.updateCurrencyDisplay();
    });
  }

  updateCurrencyDisplay() {
    const currencyLabel = document.querySelector('.currency-label');
    const currencyOptions = document.querySelectorAll('.currency-option');
    const currentCurrency = window.currencyDetector?.getCurrency();

    if (currencyLabel && currentCurrency) {
      currencyLabel.textContent = currentCurrency;
    }

    currencyOptions?.forEach(option => {
      const currency = option.getAttribute('data-currency');
      if (currency === currentCurrency) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  attachDropdownListeners() {
    const resourcesToggle = document.getElementById('resources-toggle');
    const resourcesDropdown = document.getElementById('resources-dropdown');
    const companyToggle = document.getElementById('company-toggle');
    const companyDropdown = document.getElementById('company-dropdown');

    // Resources dropdown
    if (resourcesToggle && resourcesDropdown) {
      resourcesToggle.addEventListener('click', (e) => {
        e.preventDefault();
        resourcesDropdown.classList.toggle('active');
        companyDropdown?.classList.remove('active');
      });
    }

    // Company dropdown
    if (companyToggle && companyDropdown) {
      companyToggle.addEventListener('click', (e) => {
        e.preventDefault();
        companyDropdown.classList.toggle('active');
        resourcesDropdown?.classList.remove('active');
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        resourcesDropdown?.classList.remove('active');
        companyDropdown?.classList.remove('active');
      }
    });
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Header;
}

// Make available globally
window.Header = Header;

