/**
 * Pricing Data Manager
 * Loads and manages pricing data from JSON file
 * Handles monthly/yearly billing and currency conversion
 */

class PricingManager {
  constructor() {
    this.pricingData = null;
    this.billingCycle = 'monthly'; // 'monthly' or 'yearly'
    this.currencyDetector = null;
  }

  /**
   * Load pricing data from JSON file
   */
  async loadPricingData() {
    if (this.pricingData) {
      return this.pricingData;
    }

    try {
      const response = await fetch('/data/pricing.json');
      if (!response.ok) {
        throw new Error('Failed to load pricing data');
      }
      this.pricingData = await response.json();
      return this.pricingData;
    } catch (error) {
      console.error('Error loading pricing data:', error);
      return null;
    }
  }

  /**
   * Set currency detector instance
   */
  setCurrencyDetector(currencyDetector) {
    this.currencyDetector = currencyDetector;
  }

  /**
   * Set billing cycle (monthly or yearly)
   */
  setBillingCycle(cycle) {
    if (['monthly', 'yearly'].includes(cycle)) {
      this.billingCycle = cycle;
      this.notifyBillingCycleChange();
    }
  }

  /**
   * Get billing cycle
   */
  getBillingCycle() {
    return this.billingCycle;
  }

  /**
   * Get price for a plan or service
   * @param {string} type - 'plan' or 'service'
   * @param {string} id - plan/service ID
   * @param {string} currency - 'USD' or 'CAD' (optional, uses detector if available)
   */
  async getPrice(type, id, currency = null) {
    await this.loadPricingData();
    if (!this.pricingData) return null;

    const currencyToUse = currency || (this.currencyDetector ? this.currencyDetector.getCurrency() : 'USD');
    const data = this.pricingData[type === 'plan' ? 'plans' : 'services'][id];
    
    if (!data || !data.pricing) return null;

    return data.pricing[this.billingCycle][currencyToUse];
  }

  /**
   * Get formatted price for display
   * @param {string} type - 'plan' or 'service'
   * @param {string} id - plan/service ID
   * @param {string} currency - 'USD' or 'CAD' (optional)
   */
  async getFormattedPrice(type, id, currency = null) {
    const price = await this.getPrice(type, id, currency);
    if (price === null) return 'N/A';

    const currencyToUse = currency || (this.currencyDetector ? this.currencyDetector.getCurrency() : 'USD');
    
    if (this.currencyDetector) {
      return this.currencyDetector.formatPrice(price);
    } else {
      // Fallback formatting
      const locale = currencyToUse === 'CAD' ? 'en-CA' : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyToUse,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    }
  }

  /**
   * Get all plan data
   */
  async getPlans() {
    await this.loadPricingData();
    return this.pricingData ? this.pricingData.plans : null;
  }

  /**
   * Get all service data
   */
  async getServices() {
    await this.loadPricingData();
    return this.pricingData ? this.pricingData.services : null;
  }

  /**
   * Calculate yearly savings percentage
   * @param {string} planId - plan ID
   */
  async getYearlySavings(planId) {
    await this.loadPricingData();
    if (!this.pricingData) return 0;

    const plan = this.pricingData.plans[planId];
    if (!plan || !plan.yearlyDiscount) return 0;

    return plan.yearlyDiscount;
  }

  /**
   * Callbacks for billing cycle changes
   */
  callbacks = [];

  onBillingCycleChange(callback) {
    this.callbacks.push(callback);
  }

  notifyBillingCycleChange() {
    this.callbacks.forEach(callback => {
      if (typeof callback === 'function') {
        callback(this.billingCycle);
      }
    });
  }
}

// Export globally
if (typeof window !== 'undefined') {
  window.PricingManager = PricingManager;
}

