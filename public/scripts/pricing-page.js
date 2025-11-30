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
      'aeo-classic': 'AEO Classic Plans',
      'geo-classic': 'GEO Classic Plans',
      'free-website': 'Free Website Plans',
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

    // Render plans
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

    // Toolkit content data
    const toolkitData = {
      'seo-classic': {
        title: 'SEO Classic',
        description: 'Traditional search engine optimization to improve your visibility and rankings on Google and other search engines.',
        highlights: [
          'Comprehensive keyword research and optimization',
          'Technical SEO audits and performance improvements',
          'Monthly reporting and strategy adjustments'
        ],
        learnMoreLink: '/en/what-is-seo.html'
      },
      'aeo-classic': {
        title: 'AEO Classic',
        description: 'Answer Engine Optimization to ensure your business is recommended by AI-powered search systems and voice assistants.',
        highlights: [
          'AI-friendly content structure and optimization',
          'Authority building for AI trust signals',
          'Conversational query optimization'
        ],
        learnMoreLink: '/en/what-is-aeo.html'
      },
      'geo-classic': {
        title: 'GEO Classic',
        description: 'Geographic Engine Optimization to dominate local search results and capture high-intent local customers.',
        highlights: [
          'Google Business Profile optimization',
          'Local citation building and NAP consistency',
          'Location-specific content creation'
        ],
        learnMoreLink: '/en/what-is-geo.html'
      },
      'free-website': {
        title: 'Free Website Redesign',
        description: 'Get a professional website redesign at no cost when you subscribe to any of our optimization services. Transform your online presence while growing your search visibility.',
        highlights: [
          'Professional website redesign included',
          'Available with any optimization service subscription',
          'Modern, responsive design tailored to your brand'
        ],
        learnMoreLink: '/en/what-is-seo.html',
        note: 'Conditions apply. Contact us for more information.'
      },
      'local': {
        title: 'Local',
        description: 'Comprehensive local search optimization to capture "near me" searches and dominate your local market.',
        highlights: [
          'Local Pack optimization and ranking',
          'Review management and reputation building',
          'Mobile-first local search strategy'
        ],
        learnMoreLink: '/en/what-is-geo.html'
      },
      'social': {
        title: 'Social',
        description: 'Social media optimization and integration to amplify your SEO, AEO, and GEO efforts across platforms.',
        highlights: [
          'Social signal optimization for search',
          'Content amplification across platforms',
          'Social engagement and community building'
        ],
        learnMoreLink: '/en/what-is-seo.html'
      }
    };

    const currentToolkit = toolkitData[toolkit] || toolkitData['seo-classic'];
    const cycleText = this.billingCycle === 'yearly' ? 'annually' : 'monthly';

    // Special handling for Free Website section
    if (toolkit === 'free-website') {
      plansContainer.innerHTML = `
        <!-- Free Website Redesign Tile -->
        <div class="pricing-plan-card">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">Free Website Redesign</h3>
            <p class="pricing-plan-description">Get a professional website redesign at no cost when you subscribe to any of our optimization services. Transform your online presence while growing your search visibility.</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" style="font-size: 1.75rem;">Free with Subscription</div>
            <div class="pricing-plan-price-period">when you subscribe to any optimization service</div>
          </div>
          <ul class="pricing-plan-features">
            <li>Professional website redesign included</li>
            <li>Available with any optimization service subscription</li>
            <li>Modern, responsive design tailored to your brand</li>
          </ul>
          <p style="font-size: 0.8125rem; color: #6b7280; margin: 0.75rem 0; font-style: italic;">Conditions apply. Contact us for more information.</p>
          <div class="pricing-plan-cta">
            <a href="${currentToolkit.learnMoreLink}" class="btn btn-secondary">Learn More</a>
            <a href="/en/contact.html" class="btn btn-primary">Contact Us</a>
          </div>
        </div>

        <!-- Website Redesign Tile -->
        <div class="pricing-plan-card popular">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">Website Redesign</h3>
            <p class="pricing-plan-description">Professional website development and redesign services tailored to your business needs and goals.</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" style="font-size: 1.5rem;">Contact Us</div>
            <div class="pricing-plan-price-period">for personalized quote</div>
          </div>
          <ul class="pricing-plan-features">
            <li>Custom development solutions</li>
            <li>WordPress website design</li>
            <li>Shopify e-commerce setup</li>
            <li>E-commerce platform integration</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="/en/contact.html" class="btn btn-secondary">Get Quote</a>
            <a href="/en/contact.html" class="btn btn-primary">Contact Us</a>
          </div>
        </div>
      `;
    } else {
      // Standard toolkit tiles
      plansContainer.innerHTML = `
        <!-- Selected Toolkit Tile -->
        <div class="pricing-plan-card">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">${currentToolkit.title}</h3>
            <p class="pricing-plan-description">${currentToolkit.description}</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" data-toolkit="${toolkit}" data-cycle="${this.billingCycle}">Loading...</div>
            <div class="pricing-plan-price-period">billed ${cycleText}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>${currentToolkit.highlights[0]}</li>
            <li>${currentToolkit.highlights[1]}</li>
            <li>${currentToolkit.highlights[2]}</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="${currentToolkit.learnMoreLink}" class="btn btn-secondary">Learn More</a>
            <a href="/en/contact.html" class="btn btn-primary">Subscribe</a>
          </div>
        </div>

        <!-- Bundle Tile -->
        <div class="pricing-plan-card popular">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">Complete Bundle</h3>
            <p class="pricing-plan-description">All three optimization services combined for comprehensive digital visibility across traditional search, AI platforms, and local markets.</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" data-toolkit="bundle" data-cycle="${this.billingCycle}">Loading...</div>
            <div class="pricing-plan-price-period">billed ${cycleText}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>Full SEO, AEO, and GEO optimization</li>
            <li>Unified strategy across all search platforms</li>
            <li>Maximum visibility and conversion potential</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="/en/what-is-seo.html" class="btn btn-secondary">Learn More</a>
            <a href="/en/contact.html" class="btn btn-primary">Subscribe</a>
          </div>
        </div>
      `;
    }

    // Update prices if pricing manager is available
    if (this.pricingManager) {
      await this.updatePrices();
    }
  }

  async updatePrices() {
    console.log('[PricingPage] Updating prices...');
    const priceElements = document.querySelectorAll('.pricing-plan-price-amount[data-toolkit]');
    console.log('[PricingPage] Found price elements:', priceElements.length);
    
    if (!this.pricingManager) {
      console.warn('[PricingPage] PricingManager not available, skipping price updates');
      return;
    }

    // Set billing cycle on pricing manager
    this.pricingManager.setBillingCycle(this.billingCycle);

    for (const element of priceElements) {
      const toolkit = element.getAttribute('data-toolkit');
      const cycle = element.getAttribute('data-cycle');
      console.log('[PricingPage] Updating price for toolkit:', toolkit, 'cycle:', cycle);
      
      if (toolkit && cycle) {
        try {
          // Get price directly from toolkit data
          const price = await this.pricingManager.getFormattedPrice(toolkit, cycle);
          
          console.log('[PricingPage] Got price for', toolkit, ':', price);
          if (price && price !== 'N/A') {
            element.textContent = price;
            console.log('[PricingPage] Updated price element');
          } else {
            element.textContent = 'Contact Sales';
            console.warn('[PricingPage] Invalid price returned, using Contact Sales');
          }
        } catch (error) {
          console.error('[PricingPage] Error updating price for', toolkit, ':', error);
          element.textContent = 'Contact Sales';
        }
      } else {
        console.warn('[PricingPage] Missing toolkit or cycle:', { toolkit, cycle });
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

