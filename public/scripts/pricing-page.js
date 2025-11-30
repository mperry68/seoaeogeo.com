/**
 * Pricing Page Controller
 * Handles pricing page interactions and dynamic content loading
 */

class PricingPage {
  constructor() {
    this.currentToolkit = 'seo-classic';
    this.billingCycle = 'yearly';
    this.pricingManager = null;
    this.currencyDetector = null;
  }

  async init() {
    try {
      // Wait for currency detector and pricing manager
      if (window.currencyDetector) {
        this.currencyDetector = window.currencyDetector;
      }

      if (window.PricingManager) {
        this.pricingManager = new PricingManager();
        if (this.currencyDetector) {
          this.pricingManager.setCurrencyDetector(this.currencyDetector);
        }
        await this.pricingManager.loadPricingData();
      }

      this.attachEventListeners();
      this.loadToolkitContent(this.currentToolkit);
    } catch (error) {
      console.error('Error in pricing page init:', error);
      // Still render the page even if pricing data fails to load
      this.attachEventListeners();
      this.loadToolkitContent(this.currentToolkit);
    }
  }

  attachEventListeners() {
    // Sidebar menu clicks
    const sidebarLinks = document.querySelectorAll('.pricing-sidebar-menu a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const toolkit = link.getAttribute('data-toolkit');
        this.switchToolkit(toolkit);
      });
    });

    // Billing cycle toggle
    const toggleButtons = document.querySelectorAll('.pricing-toggle-btn');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cycle = btn.getAttribute('data-cycle');
        this.setBillingCycle(cycle);
      });
    });
  }

  switchToolkit(toolkit) {
    this.currentToolkit = toolkit;
    
    // Update active state in sidebar
    document.querySelectorAll('.pricing-sidebar-menu a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-toolkit') === toolkit) {
        link.classList.add('active');
      }
    });

    this.loadToolkitContent(toolkit);
  }

  setBillingCycle(cycle) {
    this.billingCycle = cycle;
    
    // Update toggle buttons
    document.querySelectorAll('.pricing-toggle-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-cycle') === cycle) {
        btn.classList.add('active');
      }
    });

    this.loadToolkitContent(this.currentToolkit);
  }

  async loadToolkitContent(toolkit) {
    // Update page title
    const titles = {
      'seo-classic': 'SEO Classic Plans',
      'ai-visibility': 'AI Visibility Plans',
      'local': 'Local Plans',
      'social': 'Social Plans'
    };
    
    const titleElement = document.getElementById('pricing-title');
    if (titleElement) {
      titleElement.textContent = titles[toolkit] || 'Pricing Plans';
    }

    // For now, load placeholder content
    // You'll provide the actual pricing data structure
    this.renderPlans(toolkit);
    this.renderComparison(toolkit);
  }

  async renderPlans(toolkit) {
    const plansContainer = document.getElementById('pricing-plans');
    if (!plansContainer) return;

    // Placeholder - you'll provide actual plan data
    plansContainer.innerHTML = `
      <div class="pricing-plan-card">
        <div class="pricing-plan-header">
          <h3 class="pricing-plan-title">Base</h3>
          <p class="pricing-plan-description">For small businesses</p>
        </div>
        <div class="pricing-plan-price">
          <div class="pricing-plan-price-amount" data-plan="base" data-cycle="${this.billingCycle}">Loading...</div>
          <div class="pricing-plan-price-period">billed ${this.billingCycle === 'yearly' ? 'annually' : 'monthly'}</div>
        </div>
        <ul class="pricing-plan-features">
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
        <div class="pricing-plan-cta">
          <a href="/en/contact" class="btn">Subscribe</a>
        </div>
      </div>
      <div class="pricing-plan-card popular">
        <div class="pricing-plan-header">
          <h3 class="pricing-plan-title">Pro</h3>
          <p class="pricing-plan-description">For growing businesses</p>
        </div>
        <div class="pricing-plan-price">
          <div class="pricing-plan-price-amount" data-plan="pro" data-cycle="${this.billingCycle}">Loading...</div>
          <div class="pricing-plan-price-period">billed ${this.billingCycle === 'yearly' ? 'annually' : 'monthly'}</div>
        </div>
        <ul class="pricing-plan-features">
          <li>All Base features plus:</li>
          <li>Feature 4</li>
          <li>Feature 5</li>
          <li>Feature 6</li>
        </ul>
        <div class="pricing-plan-cta">
          <a href="/en/contact" class="btn">Subscribe</a>
        </div>
      </div>
      <div class="pricing-plan-card">
        <div class="pricing-plan-header">
          <h3 class="pricing-plan-title">Business</h3>
          <p class="pricing-plan-description">For large businesses</p>
        </div>
        <div class="pricing-plan-price">
          <div class="pricing-plan-price-amount">Let's talk</div>
        </div>
        <ul class="pricing-plan-features">
          <li>All Pro features plus:</li>
          <li>Custom pricing and billing cycle</li>
          <li>Customizable limits</li>
          <li>Priority customer support</li>
        </ul>
        <div class="pricing-plan-cta">
          <a href="/en/contact" class="btn">Contact Sales</a>
        </div>
      </div>
    `;

    // Update prices if pricing manager is available
    if (this.pricingManager) {
      await this.updatePrices();
    }
  }

  async updatePrices() {
    const priceElements = document.querySelectorAll('.pricing-plan-price-amount[data-plan]');
    
    for (const element of priceElements) {
      const planId = element.getAttribute('data-plan');
      const cycle = element.getAttribute('data-cycle');
      
      if (planId && cycle) {
        // This will be updated when you provide the actual pricing structure
        // For now, it's a placeholder
        const price = await this.pricingManager.getFormattedPrice('plan', planId);
        if (price && price !== 'N/A') {
          element.textContent = price;
        }
      }
    }
  }

  renderComparison(toolkit) {
    const comparisonContainer = document.getElementById('pricing-comparison');
    if (!comparisonContainer) return;

    // Placeholder comparison table
    comparisonContainer.innerHTML = `
      <table class="pricing-comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Base</th>
            <th>Pro</th>
            <th>Business</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Feature Category 1</td>
            <td><span class="checkmark">✓</span></td>
            <td><span class="checkmark">✓</span></td>
            <td><span class="checkmark">✓</span></td>
          </tr>
          <tr>
            <td>Feature Category 2</td>
            <td><span class="checkmark">✓</span></td>
            <td><span class="checkmark">✓</span></td>
            <td><span class="checkmark">✓</span></td>
          </tr>
        </tbody>
      </table>
    `;
  }
}

// Initialize when DOM is ready and all scripts are loaded
function initPricingPage() {
  // Wait for currency detector and other dependencies
  if (typeof window.currencyDetector === 'undefined' || typeof window.PricingManager === 'undefined') {
    setTimeout(initPricingPage, 100);
    return;
  }

  const pricingPage = new PricingPage();
  pricingPage.init().catch(error => {
    console.error('Error initializing pricing page:', error);
  });
  window.pricingPage = pricingPage;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPricingPage);
} else {
  // If DOM is already loaded, wait a bit for scripts to load
  setTimeout(initPricingPage, 100);
}

