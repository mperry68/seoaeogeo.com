/**
 * Price Display Component
 * Displays prices with automatic currency detection (CAD/USD)
 */

class PriceDisplay {
  constructor(currencyDetector) {
    this.currencyDetector = currencyDetector || window.currencyDetector;
    this.prices = new Map(); // Store price elements
  }

  /**
   * Initialize price display for all elements with data-price attribute
   */
  init() {
    // Find all elements with data-price attribute
    const priceElements = document.querySelectorAll('[data-price]');
    
    priceElements.forEach(element => {
      const price = parseFloat(element.getAttribute('data-price'));
      if (!isNaN(price)) {
        this.prices.set(element, price);
        this.updatePriceElement(element, price);
      }
    });

    // Listen for currency changes
    if (this.currencyDetector) {
      this.currencyDetector.onCurrencyChange((currency) => {
        this.updateAllPrices();
      });
    }
  }

  /**
   * Update a single price element
   */
  updatePriceElement(element, price) {
    if (!this.currencyDetector) return;

    const currency = this.currencyDetector.getCurrency();
    const formattedPrice = this.currencyDetector.formatPrice(price);
    
    // Update the element's text content
    element.textContent = formattedPrice;
    
    // Update data attribute for styling purposes
    element.setAttribute('data-currency', currency);
  }

  /**
   * Update all price elements
   */
  updateAllPrices() {
    this.prices.forEach((price, element) => {
      this.updatePriceElement(element, price);
    });
  }

  /**
   * Add a new price element dynamically
   */
  addPrice(element, price) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (element) {
      this.prices.set(element, price);
      this.updatePriceElement(element, price);
    }
  }

  /**
   * Render a price element (for use in templates)
   */
  render(price, options = {}) {
    if (!this.currencyDetector) {
      return this.currencyDetector.formatPrice(price, options);
    }

    const currency = this.currencyDetector.getCurrency();
    const formattedPrice = this.currencyDetector.formatPrice(price, options);
    const className = options.className || 'price';
    const currencyClass = `price-${currency.toLowerCase()}`;

    return `
      <span class="${className} ${currencyClass}" data-price="${price}" data-currency="${currency}">
        ${formattedPrice}
      </span>
    `;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PriceDisplay;
}

