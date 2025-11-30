/**
 * Currency Detection and Formatting Utility
 * Detects user's location and displays appropriate currency (CAD/USD)
 * Uses multiple fallback methods for reliable detection
 */

class CurrencyDetector {
  constructor() {
    this.currentCurrency = 'USD'; // Default to USD
    this.detectedCountry = null;
    this.isDetecting = false;
    this.callbacks = [];
  }

  /**
   * Detect currency using multiple methods:
   * 1. IP Geolocation API (Cloudflare or free service)
   * 2. Browser timezone
   * 3. Browser locale
   * 4. LocalStorage preference
   */
  async detect() {
    if (this.isDetecting) {
      return this.waitForDetection();
    }

    this.isDetecting = true;

    // Check localStorage first (user preference)
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency && ['CAD', 'USD'].includes(savedCurrency)) {
      this.currentCurrency = savedCurrency;
      this.isDetecting = false;
      this.notifyCallbacks();
      return this.currentCurrency;
    }

    try {
      // Method 1: Try Cloudflare's geolocation (if available)
      const cfCountry = this.getCloudflareCountry();
      if (cfCountry) {
        this.detectedCountry = cfCountry;
        this.currentCurrency = this.countryToCurrency(cfCountry);
        this.saveCurrency();
        this.isDetecting = false;
        this.notifyCallbacks();
        return this.currentCurrency;
      }

      // Method 2: Try IP geolocation API (free service)
      const ipCountry = await this.detectViaIP();
      if (ipCountry) {
        this.detectedCountry = ipCountry;
        this.currentCurrency = this.countryToCurrency(ipCountry);
        this.saveCurrency();
        this.isDetecting = false;
        this.notifyCallbacks();
        return this.currentCurrency;
      }
    } catch (error) {
      console.warn('IP geolocation failed, using fallback methods:', error);
    }

    // Method 3: Use timezone as fallback
    const timezoneCountry = this.detectViaTimezone();
    if (timezoneCountry) {
      this.detectedCountry = timezoneCountry;
      this.currentCurrency = this.countryToCurrency(timezoneCountry);
      this.saveCurrency();
      this.isDetecting = false;
      this.notifyCallbacks();
      return this.currentCurrency;
    }

    // Method 4: Use browser locale as last resort
    const localeCountry = this.detectViaLocale();
    if (localeCountry) {
      this.detectedCountry = localeCountry;
      this.currentCurrency = this.countryToCurrency(localeCountry);
      this.saveCurrency();
    }

    this.isDetecting = false;
    this.notifyCallbacks();
    return this.currentCurrency;
  }

  /**
   * Get country from Cloudflare headers (if available)
   * Cloudflare Pages automatically adds CF-IPCountry header
   */
  getCloudflareCountry() {
    // This would work server-side or via Cloudflare Workers
    // For client-side, we'll use other methods
    return null;
  }

  /**
   * Detect country via IP geolocation using a free API
   */
  async detectViaIP() {
    try {
      // Using ipapi.co (free tier: 1000 requests/day)
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.country_code; // Returns ISO 3166-1 alpha-2 code (e.g., 'CA', 'US')
      }
    } catch (error) {
      console.warn('IP geolocation API failed:', error);
    }

    // Fallback: Try another free service
    try {
      const response = await fetch('https://api.country.is/', {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        return data.country; // Returns ISO 3166-1 alpha-2 code
      }
    } catch (error) {
      console.warn('Fallback IP geolocation API failed:', error);
    }

    return null;
  }

  /**
   * Detect country via timezone
   */
  detectViaTimezone() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Canadian timezones
    const canadianTimezones = [
      'America/Toronto',
      'America/Vancouver',
      'America/Edmonton',
      'America/Winnipeg',
      'America/Halifax',
      'America/St_Johns',
      'America/Regina',
      'America/Yellowknife',
      'America/Whitehorse',
      'America/Dawson',
      'America/Inuvik',
      'America/Iqaluit',
      'America/Moncton',
      'America/Glace_Bay',
      'America/Goose_Bay',
      'America/Blanc-Sablon',
      'America/Montreal',
      'America/Thunder_Bay',
      'America/Nipigon',
      'America/Rainy_River',
      'America/Atikokan',
      'America/Cambridge_Bay',
      'America/Creston'
    ];

    if (canadianTimezones.includes(timezone)) {
      return 'CA';
    }

    // US timezones (default to USD)
    const usTimezones = [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Phoenix',
      'America/Anchorage',
      'America/Detroit',
      'America/Indianapolis',
      'America/Louisville',
      'America/Menominee',
      'America/Metlakatla',
      'America/Nome',
      'America/Sitka',
      'America/Yakutat',
      'Pacific/Honolulu'
    ];

    if (usTimezones.includes(timezone)) {
      return 'US';
    }

    return null;
  }

  /**
   * Detect country via browser locale
   */
  detectViaLocale() {
    const locale = navigator.language || navigator.userLanguage;
    
    // Check for Canadian locale
    if (locale.includes('en-CA') || locale.includes('fr-CA')) {
      return 'CA';
    }

    // Check for US locale
    if (locale.includes('en-US')) {
      return 'US';
    }

    // Check for generic English (default to US)
    if (locale.startsWith('en')) {
      return 'US';
    }

    return null;
  }

  /**
   * Convert country code to currency
   */
  countryToCurrency(countryCode) {
    const currencyMap = {
      'CA': 'CAD',
      'US': 'USD'
    };

    // Default to USD for unknown countries
    return currencyMap[countryCode] || 'USD';
  }

  /**
   * Get current currency
   */
  getCurrency() {
    return this.currentCurrency;
  }

  /**
   * Set currency manually (user preference)
   */
  setCurrency(currency) {
    if (['CAD', 'USD'].includes(currency)) {
      this.currentCurrency = currency;
      localStorage.setItem('preferredCurrency', currency);
      this.notifyCallbacks();
    }
  }

  /**
   * Save detected currency to localStorage
   */
  saveCurrency() {
    localStorage.setItem('detectedCurrency', this.currentCurrency);
    localStorage.setItem('detectedCountry', this.detectedCountry || '');
  }

  /**
   * Format price with currency symbol
   */
  formatPrice(amount, options = {}) {
    const currency = options.currency || this.currentCurrency;
    const locale = currency === 'CAD' ? 'en-CA' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: options.minDecimals !== undefined ? options.minDecimals : 2,
      maximumFractionDigits: options.maxDecimals !== undefined ? options.maxDecimals : 2
    }).format(amount);
  }

  /**
   * Register callback for currency changes
   */
  onCurrencyChange(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Notify all callbacks of currency change
   */
  notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.currentCurrency, this.detectedCountry);
      } catch (error) {
        console.error('Error in currency change callback:', error);
      }
    });
  }

  /**
   * Wait for detection to complete
   */
  waitForDetection() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.isDetecting) {
          clearInterval(checkInterval);
          resolve(this.currentCurrency);
        }
      }, 100);
    });
  }
}

// Initialize currency detector
const currencyDetector = new CurrencyDetector();

// Auto-detect on load
if (typeof window !== 'undefined') {
  currencyDetector.detect();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CurrencyDetector;
}

