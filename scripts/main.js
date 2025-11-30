/**
 * Main JavaScript
 * Initializes header and footer components, currency detection, and price display
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize currency detector first
  if (typeof CurrencyDetector !== 'undefined') {
    window.currencyDetector = new CurrencyDetector();
    // Wait for currency detection to complete
    await window.currencyDetector.detect();
  }

  // Detect current language from URL
  const pathMatch = window.location.pathname.match(/^\/(en|fr)/);
  const currentLang = pathMatch ? pathMatch[1] : 'en';

  // Initialize Header
  if (document.getElementById('header')) {
    const Header = window.Header || require('./components/Header.js');
    const header = new Header(currentLang);
    header.init();
  }

  // Initialize Footer
  if (document.getElementById('footer')) {
    const Footer = window.Footer || require('./components/Footer.js');
    const footer = new Footer(currentLang);
    footer.init();
  }

  // Initialize Price Display
  if (typeof PriceDisplay !== 'undefined' && window.currencyDetector) {
    const priceDisplay = new PriceDisplay(window.currencyDetector);
    priceDisplay.init();
    window.priceDisplay = priceDisplay;
  }
});

