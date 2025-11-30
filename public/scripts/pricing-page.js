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
    console.log('[PricingPage] Starting initialization...');
    try {
      // Wait for currency detector and pricing manager
      console.log('[PricingPage] Checking for currencyDetector:', typeof window.currencyDetector);
      if (window.currencyDetector) {
        this.currencyDetector = window.currencyDetector;
        console.log('[PricingPage] Currency detector found:', this.currencyDetector);
      } else {
        console.warn('[PricingPage] Currency detector not found');
      }

      console.log('[PricingPage] Checking for PricingManager:', typeof window.PricingManager);
      if (window.PricingManager) {
        console.log('[PricingPage] Creating PricingManager instance...');
        this.pricingManager = new PricingManager();
        if (this.currencyDetector) {
          this.pricingManager.setCurrencyDetector(this.currencyDetector);
          console.log('[PricingPage] Currency detector set on PricingManager');
        }
        console.log('[PricingPage] Loading pricing data...');
        await this.pricingManager.loadPricingData();
        console.log('[PricingPage] Pricing data loaded successfully');
      } else {
        console.warn('[PricingPage] PricingManager not found');
      }

      console.log('[PricingPage] Attaching event listeners...');
      this.attachEventListeners();
      console.log('[PricingPage] Loading toolkit content:', this.currentToolkit);
      this.loadToolkitContent(this.currentToolkit);
      console.log('[PricingPage] Initialization complete');
    } catch (error) {
      console.error('[PricingPage] Error in init:', error);
      console.error('[PricingPage] Error stack:', error.stack);
      // Still render the page even if pricing data fails to load
      this.attachEventListeners();
      this.loadToolkitContent(this.currentToolkit);
    }
  }

  attachEventListeners() {
    console.log('[PricingPage] Attaching event listeners...');
    // Sidebar menu clicks
    const sidebarLinks = document.querySelectorAll('.pricing-sidebar-menu a');
    console.log('[PricingPage] Found sidebar links:', sidebarLinks.length);
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const toolkit = link.getAttribute('data-toolkit');
        console.log('[PricingPage] Sidebar link clicked:', toolkit);
        this.switchToolkit(toolkit);
      });
    });

    // Billing cycle toggle
    const toggleButtons = document.querySelectorAll('.pricing-toggle-btn');
    console.log('[PricingPage] Found toggle buttons:', toggleButtons.length);
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cycle = btn.getAttribute('data-cycle');
        console.log('[PricingPage] Billing cycle toggle clicked:', cycle);
        this.setBillingCycle(cycle);
      });
    });
    console.log('[PricingPage] Event listeners attached');
  }

  switchToolkit(toolkit) {
    console.log('[PricingPage] Switching toolkit to:', toolkit);
    this.currentToolkit = toolkit;
    
    // Update active state in sidebar
    const sidebarLinks = document.querySelectorAll('.pricing-sidebar-menu a');
    console.log('[PricingPage] Updating sidebar active states, found links:', sidebarLinks.length);
    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-toolkit') === toolkit) {
        link.classList.add('active');
        console.log('[PricingPage] Set active on:', toolkit);
      }
    });

    this.loadToolkitContent(toolkit);
  }

  setBillingCycle(cycle) {
    console.log('[PricingPage] Setting billing cycle to:', cycle);
    this.billingCycle = cycle;
    
    // Update toggle buttons
    const toggleButtons = document.querySelectorAll('.pricing-toggle-btn');
    console.log('[PricingPage] Updating toggle buttons, found:', toggleButtons.length);
    toggleButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-cycle') === cycle) {
        btn.classList.add('active');
        console.log('[PricingPage] Set active on billing cycle:', cycle);
      }
    });

    this.loadToolkitContent(this.currentToolkit);
  }

  async loadToolkitContent(toolkit) {
    console.log('[PricingPage] Loading toolkit content for:', toolkit);
    // Update page title
    const titles = {
      'seo-classic': 'SEO Classic Plans',
      'ai-visibility': 'AI Visibility Plans',
      'local': 'Local Plans',
      'social': 'Social Plans'
    };
    
    const titleElement = document.getElementById('pricing-title');
    console.log('[PricingPage] Title element found:', !!titleElement);
    if (titleElement) {
      const newTitle = titles[toolkit] || 'Pricing Plans';
      titleElement.textContent = newTitle;
      console.log('[PricingPage] Updated title to:', newTitle);
    } else {
      console.error('[PricingPage] Title element not found!');
    }

    // For now, load placeholder content
    // You'll provide the actual pricing data structure
    console.log('[PricingPage] Rendering plans...');
    this.renderPlans(toolkit);
    console.log('[PricingPage] Rendering comparison...');
    this.renderComparison(toolkit);
    console.log('[PricingPage] Toolkit content loaded');
  }

  async renderPlans(toolkit) {
    console.log('[PricingPage] Rendering plans for toolkit:', toolkit);
    const plansContainer = document.getElementById('pricing-plans');
    if (!plansContainer) {
      console.error('[PricingPage] Plans container not found!');
      return;
    }
    console.log('[PricingPage] Plans container found, rendering...');

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
    console.log('[PricingPage] Updating prices...');
    const priceElements = document.querySelectorAll('.pricing-plan-price-amount[data-plan]');
    console.log('[PricingPage] Found price elements:', priceElements.length);
    
    if (!this.pricingManager) {
      console.warn('[PricingPage] PricingManager not available, skipping price updates');
      return;
    }

    for (const element of priceElements) {
      const planId = element.getAttribute('data-plan');
      const cycle = element.getAttribute('data-cycle');
      console.log('[PricingPage] Updating price for plan:', planId, 'cycle:', cycle);
      
      if (planId && cycle) {
        try {
          // This will be updated when you provide the actual pricing structure
          // For now, it's a placeholder
          const price = await this.pricingManager.getFormattedPrice('plan', planId);
          console.log('[PricingPage] Got price for', planId, ':', price);
          if (price && price !== 'N/A') {
            element.textContent = price;
            console.log('[PricingPage] Updated price element');
          } else {
            console.warn('[PricingPage] Invalid price returned:', price);
          }
        } catch (error) {
          console.error('[PricingPage] Error updating price for', planId, ':', error);
        }
      } else {
        console.warn('[PricingPage] Missing planId or cycle:', { planId, cycle });
      }
    }
    console.log('[PricingPage] Price updates complete');
  }

  renderComparison(toolkit) {
    console.log('[PricingPage] Rendering comparison for toolkit:', toolkit);
    const comparisonContainer = document.getElementById('pricing-comparison');
    if (!comparisonContainer) {
      console.error('[PricingPage] Comparison container not found!');
      return;
    }
    console.log('[PricingPage] Comparison container found, rendering...');

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
  console.log('[PricingPage] initPricingPage called');
  console.log('[PricingPage] Document ready state:', document.readyState);
  console.log('[PricingPage] Checking dependencies...');
  console.log('[PricingPage] window.currencyDetector:', typeof window.currencyDetector);
  console.log('[PricingPage] window.PricingManager:', typeof window.PricingManager);
  
  // Wait for currency detector and other dependencies
  if (typeof window.currencyDetector === 'undefined' || typeof window.PricingManager === 'undefined') {
    console.log('[PricingPage] Dependencies not ready, retrying in 100ms...');
    setTimeout(initPricingPage, 100);
    return;
  }

  console.log('[PricingPage] All dependencies ready, creating PricingPage instance...');
  try {
    const pricingPage = new PricingPage();
    console.log('[PricingPage] Instance created, calling init...');
    pricingPage.init().catch(error => {
      console.error('[PricingPage] Error initializing pricing page:', error);
      console.error('[PricingPage] Error stack:', error.stack);
    });
    window.pricingPage = pricingPage;
    console.log('[PricingPage] PricingPage initialized and stored in window.pricingPage');
  } catch (error) {
    console.error('[PricingPage] Fatal error creating PricingPage:', error);
    console.error('[PricingPage] Error stack:', error.stack);
  }
}

console.log('[PricingPage] Script loaded, checking document state...');
if (document.readyState === 'loading') {
  console.log('[PricingPage] Document still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[PricingPage] DOMContentLoaded fired');
    initPricingPage();
  });
} else {
  console.log('[PricingPage] Document already loaded, initializing immediately...');
  // If DOM is already loaded, wait a bit for scripts to load
  setTimeout(initPricingPage, 100);
}

