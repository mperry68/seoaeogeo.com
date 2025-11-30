/**
 * Main JavaScript
 * Initializes header and footer components, currency detection, and price display
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize currency detector first
  if (window.CurrencyDetector) {
    window.currencyDetector = new window.CurrencyDetector();
    // Wait for currency detection to complete
    await window.currencyDetector.detect();
  }

  // Detect current language from URL
  const pathMatch = window.location.pathname.match(/^\/(en|fr)/);
  const currentLang = pathMatch ? pathMatch[1] : 'en';

  // Initialize Header
  if (document.getElementById('header') && window.Header) {
    const header = new window.Header(currentLang);
    header.init();
  }

  // Initialize Footer
  if (document.getElementById('footer') && window.Footer) {
    const footer = new window.Footer(currentLang);
    footer.init();
  }

  // Initialize Price Display
  if (window.PriceDisplay && window.currencyDetector) {
    const priceDisplay = new window.PriceDisplay(window.currencyDetector);
    priceDisplay.init();
    window.priceDisplay = priceDisplay;
  }
});

