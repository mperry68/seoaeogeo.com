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
    // Detect language from URL path
    this.language = window.location.pathname.startsWith('/fr/') ? 'fr' : 'en';
    
    // Translation strings
    this.translations = {
      en: {
        billingPeriod: {
          monthly: 'billed monthly',
          yearly: 'with 12 month commitment'
        },
        buttons: {
          learnMore: 'Learn More',
          subscribe: 'Subscribe',
          contactUs: 'Contact Us',
          getStarted: 'Get Started',
          getQuote: 'Get Quote'
        },
        bundle: {
          title: 'Complete Bundle',
          description: 'All three optimization services combined for comprehensive digital visibility across traditional search, AI platforms, and local markets.',
          highlights: [
            'Full SEO, AEO, and GEO optimization',
            'Unified strategy across all search platforms',
            'Maximum visibility and conversion potential'
          ]
        },
        freeWebsite: {
          title: 'Free Website Redesign',
          description: 'Get a professional website redesign at no cost when you subscribe to any of our optimization services. Transform your online presence while growing your search visibility.',
          price: 'Free with Subscription',
          period: 'when you subscribe to any optimization service',
          note: 'Conditions apply. Contact us for more information.'
        },
        websiteRedesign: {
          title: 'Website Redesign',
          description: 'Professional website development and redesign services tailored to your business needs and goals.',
          price: 'Contact Us',
          period: 'for personalized quote'
        },
        social: {
          oneTime: {
            title: 'Social One-Time Optimization',
            description: 'Professional one-time optimization of your social media accounts to improve visibility, engagement, and brand consistency across all platforms.',
            period: 'per social account (one-time)'
          },
          management: {
            title: 'Social Management',
            description: 'Ongoing social media management to keep your accounts active, engaging, and aligned with your business goals. $199 includes 2 posts per month.',
            period: 'per month'
          }
        },
        loading: 'Loading...'
      },
      fr: {
        billingPeriod: {
          monthly: 'facturé mensuellement',
          yearly: 'avec engagement de 12 mois'
        },
        buttons: {
          learnMore: 'En savoir plus',
          subscribe: 'S\'abonner',
          contactUs: 'Nous contacter',
          getStarted: 'Commencer',
          getQuote: 'Obtenir un devis'
        },
        bundle: {
          title: 'Forfait complet',
          description: 'Les trois services d\'optimisation combinés pour une visibilité numérique complète sur la recherche traditionnelle, les plateformes IA et les marchés locaux.',
          highlights: [
            'Optimisation complète SEO, AEO et GEO',
            'Stratégie unifiée sur toutes les plateformes de recherche',
            'Visibilité et potentiel de conversion maximaux'
          ]
        },
        freeWebsite: {
          title: 'Refonte de site web gratuite',
          description: 'Obtenez une refonte professionnelle de site web sans frais lorsque vous vous abonnez à l\'un de nos services d\'optimisation. Transformez votre présence en ligne tout en développant votre visibilité de recherche.',
          price: 'Gratuit avec abonnement',
          period: 'lorsque vous vous abonnez à un service d\'optimisation',
          note: 'Conditions applicables. Contactez-nous pour plus d\'informations.'
        },
        websiteRedesign: {
          title: 'Refonte de site web',
          description: 'Services professionnels de développement et de refonte de sites web adaptés aux besoins et objectifs de votre entreprise.',
          price: 'Nous contacter',
          period: 'pour un devis personnalisé'
        },
        social: {
          oneTime: {
            title: 'Optimisation sociale unique',
            description: 'Optimisation unique professionnelle de vos comptes de médias sociaux pour améliorer la visibilité, l\'engagement et la cohérence de la marque sur toutes les plateformes.',
            period: 'par compte social (unique)'
          },
          management: {
            title: 'Gestion sociale',
            description: 'Gestion continue des médias sociaux pour garder vos comptes actifs, engageants et alignés avec vos objectifs commerciaux. 199 $ comprend 2 publications par mois.',
            period: 'par mois'
          }
        },
        loading: 'Chargement...'
      }
    };
  }
  
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || this.translations.en[key.split('.')[0]]?.[key.split('.')[1]] || key;
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
      
      // Initialize FAQ accordion
      setTimeout(() => this.initFAQ(), 100);
    } catch (error) {
      console.error('[PricingPage] Error in init:', error);
      console.error('[PricingPage] Error stack:', error.stack);
      // Still render the page even if pricing data fails to load
      this.attachEventListeners();
      this.loadToolkitContent(this.currentToolkit);
      
      // Initialize FAQ accordion even on error
      setTimeout(() => this.initFAQ(), 100);
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

    // Show/hide save badge based on toolkit (always show for SEO, AEO, GEO)
    const saveBadge = document.getElementById('pricing-save-badge');
    const showSaveBadge = ['seo-classic', 'aeo-classic', 'geo-classic'].includes(this.currentToolkit);
    if (saveBadge) {
      if (showSaveBadge) {
        saveBadge.style.display = 'inline-block';
      } else {
        saveBadge.style.display = 'none';
      }
    }

    this.loadToolkitContent(this.currentToolkit);
  }

  async loadToolkitContent(toolkit) {
    console.log('[PricingPage] Loading toolkit content for:', toolkit);
    // Update page title
    const titles = {
      'en': {
        'seo-classic': 'SEO Classic Plans',
        'aeo-classic': 'AEO Classic Plans',
        'geo-classic': 'GEO Classic Plans',
        'free-website': 'Free Website Plans',
        'local': 'Local Plans',
        'social': 'Social Plans'
      },
      'fr': {
        'seo-classic': 'Forfaits SEO Classic',
        'aeo-classic': 'Forfaits AEO Classic',
        'geo-classic': 'Forfaits GEO Classic',
        'free-website': 'Forfaits site web gratuit',
        'local': 'Forfaits local',
        'social': 'Forfaits social'
      }
    };
    
    const titleElement = document.getElementById('pricing-title');
    console.log('[PricingPage] Title element found:', !!titleElement);
    if (titleElement) {
      const newTitle = titles[this.language]?.[toolkit] || (this.language === 'fr' ? 'Forfaits' : 'Pricing Plans');
      titleElement.textContent = newTitle;
      console.log('[PricingPage] Updated title to:', newTitle);
    } else {
      console.error('[PricingPage] Title element not found!');
    }

    // Show/hide save badge for SEO, AEO, GEO (always show for these toolkits)
    const saveBadge = document.getElementById('pricing-save-badge');
    const showSaveBadge = ['seo-classic', 'aeo-classic', 'geo-classic'].includes(toolkit);
    if (saveBadge) {
      if (showSaveBadge) {
        saveBadge.style.display = 'inline-block';
      } else {
        saveBadge.style.display = 'none';
      }
    }

    // Render plans
    console.log('[PricingPage] Rendering plans...');
    await this.renderPlans(toolkit);
    console.log('[PricingPage] Rendering service details...');
    this.renderServiceDetails(toolkit);
    console.log('[PricingPage] Rendering comparison...');
    this.renderComparison(toolkit);
    console.log('[PricingPage] Toolkit content loaded');
  }

  initFAQ() {
    const faqQuestions = document.querySelectorAll('.pricing-faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.closest('.pricing-faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.pricing-faq-item').forEach(item => {
          item.classList.remove('active');
          item.querySelector('.pricing-faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          faqItem.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
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
    const lang = this.language;
    const toolkitData = {
      'seo-classic': {
        title: 'SEO Classic',
        description: lang === 'fr' 
          ? 'Optimisation traditionnelle pour les moteurs de recherche pour améliorer votre visibilité et vos classements sur Google et autres moteurs de recherche.'
          : 'Traditional search engine optimization to improve your visibility and rankings on Google and other search engines.',
        highlights: lang === 'fr' ? [
          'Recherche et optimisation complètes de mots-clés',
          'Audits SEO techniques et améliorations de performance',
          'Rapports mensuels et ajustements stratégiques'
        ] : [
          'Comprehensive keyword research and optimization',
          'Technical SEO audits and performance improvements',
          'Monthly reporting and strategy adjustments'
        ],
        learnMoreLink: `/${lang}/what-is-seo.html`
      },
      'aeo-classic': {
        title: 'AEO Classic',
        description: lang === 'fr'
          ? 'Optimisation des moteurs de réponse pour garantir que votre entreprise soit recommandée par les systèmes de recherche alimentés par l\'IA et les assistants vocaux.'
          : 'Answer Engine Optimization to ensure your business is recommended by AI-powered search systems and voice assistants.',
        highlights: lang === 'fr' ? [
          'Structure et optimisation de contenu adaptées à l\'IA',
          'Renforcement de l\'autorité pour les signaux de confiance IA',
          'Optimisation des requêtes conversationnelles'
        ] : [
          'AI-friendly content structure and optimization',
          'Authority building for AI trust signals',
          'Conversational query optimization'
        ],
        learnMoreLink: `/${lang}/what-is-aeo.html`
      },
      'geo-classic': {
        title: 'GEO Classic',
        description: lang === 'fr'
          ? 'Optimisation des moteurs géographiques pour dominer les résultats de recherche locaux et capturer des clients locaux à forte intention.'
          : 'Geographic Engine Optimization to dominate local search results and capture high-intent local customers.',
        highlights: lang === 'fr' ? [
          'Optimisation du profil Google Business',
          'Construction de citations locales et cohérence NAP',
          'Création de contenu spécifique à la localisation'
        ] : [
          'Google Business Profile optimization',
          'Local citation building and NAP consistency',
          'Location-specific content creation'
        ],
        learnMoreLink: `/${lang}/what-is-geo.html`
      },
      'free-website': {
        title: lang === 'fr' ? 'Refonte de site web gratuite' : 'Free Website Redesign',
        description: lang === 'fr'
          ? 'Obtenez une refonte professionnelle de site web sans frais lorsque vous vous abonnez à l\'un de nos services d\'optimisation. Transformez votre présence en ligne tout en développant votre visibilité de recherche.'
          : 'Get a professional website redesign at no cost when you subscribe to any of our optimization services. Transform your online presence while growing your search visibility.',
        highlights: lang === 'fr' ? [
          'Refonte professionnelle de site web incluse',
          'Disponible avec tout abonnement à un service d\'optimisation',
          'Design moderne et réactif adapté à votre marque'
        ] : [
          'Professional website redesign included',
          'Available with any optimization service subscription',
          'Modern, responsive design tailored to your brand'
        ],
        learnMoreLink: `/${lang}/what-is-seo.html`,
        note: lang === 'fr' ? 'Conditions applicables. Contactez-nous pour plus d\'informations.' : 'Conditions apply. Contact us for more information.'
      },
      'local': {
        title: 'Local',
        description: lang === 'fr'
          ? 'Optimisation complète de la recherche locale pour capturer les recherches "près de moi" et dominer votre marché local.'
          : 'Comprehensive local search optimization to capture "near me" searches and dominate your local market.',
        highlights: lang === 'fr' ? [
          'Optimisation et classement du Local Pack',
          'Gestion des avis et renforcement de la réputation',
          'Stratégie de recherche locale mobile-first'
        ] : [
          'Local Pack optimization and ranking',
          'Review management and reputation building',
          'Mobile-first local search strategy'
        ],
        learnMoreLink: `/${lang}/what-is-geo.html`
      },
      'social': {
        title: 'Social',
        description: lang === 'fr'
          ? 'Optimisation et intégration des médias sociaux pour amplifier vos efforts SEO, AEO et GEO sur toutes les plateformes.'
          : 'Social media optimization and integration to amplify your SEO, AEO, and GEO efforts across platforms.',
        highlights: lang === 'fr' ? [
          'Optimisation des signaux sociaux pour la recherche',
          'Amplification de contenu sur toutes les plateformes',
          'Engagement social et développement communautaire'
        ] : [
          'Social signal optimization for search',
          'Content amplification across platforms',
          'Social engagement and community building'
        ],
        learnMoreLink: `/${lang}/what-is-seo.html`
      },
      'social-one-time': {
        title: lang === 'fr' ? 'Optimisation sociale unique' : 'Social One-Time Optimization',
        description: lang === 'fr'
          ? 'Optimisation unique professionnelle de vos comptes de médias sociaux pour améliorer la visibilité, l\'engagement et la cohérence de la marque.'
          : 'Professional one-time optimization of your social media accounts to improve visibility, engagement, and brand consistency.',
        highlights: lang === 'fr' ? [
          'Optimisation de profil sur toutes les plateformes',
          'Développement de stratégie de contenu',
          'Audit de cohérence de marque'
        ] : [
          'Profile optimization across all platforms',
          'Content strategy development',
          'Brand consistency audit'
        ],
        learnMoreLink: `/${lang}/what-is-seo.html`
      },
      'social-management': {
        title: lang === 'fr' ? 'Gestion sociale' : 'Social Management',
        description: lang === 'fr'
          ? 'Gestion continue des médias sociaux pour garder vos comptes actifs, engageants et alignés avec vos objectifs commerciaux. Comprend 2 publications par mois.'
          : 'Ongoing social media management to keep your accounts active, engaging, and aligned with your business goals. Includes 2 posts per month.',
        highlights: lang === 'fr' ? [
          '2 publications par mois par compte',
          'Création et planification de contenu',
          'Surveillance et réponse à l\'engagement',
          'Suivi et rapports de performance'
        ] : [
          '2 posts per month per account',
          'Content creation and scheduling',
          'Engagement monitoring and response',
          'Performance tracking and reporting'
        ],
        learnMoreLink: `/${lang}/what-is-seo.html`
      }
    };

    const currentToolkit = toolkitData[toolkit] || toolkitData['seo-classic'];

    // Special handling for Social section
    if (toolkit === 'social') {
      plansContainer.innerHTML = `
        <!-- Social One-Time Optimization Tile -->
        <div class="pricing-plan-card">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">${this.t('social.oneTime.title')}</h3>
            <p class="pricing-plan-description">${this.t('social.oneTime.description')}</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" style="font-size: 1.75rem;">199 $ CAD</div>
            <div class="pricing-plan-price-period">${this.t('social.oneTime.period')}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>${this.language === 'fr' ? 'Optimisation de profil sur toutes les plateformes' : 'Profile optimization across all platforms'}</li>
            <li>${this.language === 'fr' ? 'Développement de stratégie de contenu' : 'Content strategy development'}</li>
            <li>${this.language === 'fr' ? 'Audit de cohérence de marque' : 'Brand consistency audit'}</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/what-is-seo.html" class="btn btn-secondary">${this.t('buttons.learnMore')}</a>
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/contact.html" class="btn btn-primary">${this.t('buttons.getStarted')}</a>
          </div>
        </div>

        <!-- Social Management Tile -->
        <div class="pricing-plan-card popular">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">${this.t('social.management.title')}</h3>
            <p class="pricing-plan-description">${this.t('social.management.description')}</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" style="font-size: 1.75rem;">199 $ CAD</div>
            <div class="pricing-plan-price-period">${this.t('social.management.period')}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>${this.language === 'fr' ? '2 publications par mois par compte' : '2 posts per month per account'}</li>
            <li>${this.language === 'fr' ? 'Création et planification de contenu' : 'Content creation and scheduling'}</li>
            <li>${this.language === 'fr' ? 'Surveillance et réponse à l\'engagement' : 'Engagement monitoring and response'}</li>
            <li>${this.language === 'fr' ? 'Suivi et rapports de performance' : 'Performance tracking and reporting'}</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/what-is-seo.html" class="btn btn-secondary">${this.t('buttons.learnMore')}</a>
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/contact.html" class="btn btn-primary">${this.t('buttons.subscribe')}</a>
          </div>
        </div>
      `;
    } else if (toolkit === 'free-website') {
      plansContainer.innerHTML = `
        <!-- Free Website Redesign Tile -->
        <div class="pricing-plan-card">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">${this.t('freeWebsite.title')}</h3>
            <p class="pricing-plan-description">${this.t('freeWebsite.description')}</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" style="font-size: 1.75rem;">${this.t('freeWebsite.price')}</div>
            <div class="pricing-plan-price-period">${this.t('freeWebsite.period')}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>${this.language === 'fr' ? 'Refonte professionnelle de site web incluse' : 'Professional website redesign included'}</li>
            <li>${this.language === 'fr' ? 'Disponible avec tout abonnement à un service d\'optimisation' : 'Available with any optimization service subscription'}</li>
            <li>${this.language === 'fr' ? 'Design moderne et réactif adapté à votre marque' : 'Modern, responsive design tailored to your brand'}</li>
          </ul>
          <p style="font-size: 0.8125rem; color: #6b7280; margin: 0.75rem 0; font-style: italic;">${this.t('freeWebsite.note')}</p>
          <div class="pricing-plan-cta">
            <a href="${currentToolkit.learnMoreLink}" class="btn btn-secondary">${this.t('buttons.learnMore')}</a>
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/contact.html" class="btn btn-primary">${this.t('buttons.contactUs')}</a>
          </div>
        </div>

        <!-- Website Redesign Tile -->
        <div class="pricing-plan-card popular">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">${this.t('websiteRedesign.title')}</h3>
            <p class="pricing-plan-description">${this.t('websiteRedesign.description')}</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" style="font-size: 1.5rem;">${this.t('websiteRedesign.price')}</div>
            <div class="pricing-plan-price-period">${this.t('websiteRedesign.period')}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>${this.language === 'fr' ? 'Solutions de développement personnalisées' : 'Custom development solutions'}</li>
            <li>${this.language === 'fr' ? 'Design de site web WordPress' : 'WordPress website design'}</li>
            <li>${this.language === 'fr' ? 'Configuration e-commerce Shopify' : 'Shopify e-commerce setup'}</li>
            <li>${this.language === 'fr' ? 'Intégration de plateforme e-commerce' : 'E-commerce platform integration'}</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/contact.html" class="btn btn-secondary">${this.t('buttons.getQuote')}</a>
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/contact.html" class="btn btn-primary">${this.t('buttons.contactUs')}</a>
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
            <div class="pricing-plan-price-amount" data-toolkit="${toolkit}" data-cycle="${this.billingCycle}">${this.t('loading')}</div>
            <div class="pricing-plan-price-period">${this.billingCycle === 'yearly' ? this.t('billingPeriod.yearly') : this.t('billingPeriod.monthly')}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>${currentToolkit.highlights[0]}</li>
            <li>${currentToolkit.highlights[1]}</li>
            <li>${currentToolkit.highlights[2]}</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="${currentToolkit.learnMoreLink}" class="btn btn-secondary">${this.t('buttons.learnMore')}</a>
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/contact.html" class="btn btn-primary">${this.t('buttons.subscribe')}</a>
          </div>
        </div>

        <!-- Bundle Tile -->
        <div class="pricing-plan-card popular">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">${this.t('bundle.title')}</h3>
            <p class="pricing-plan-description">${this.t('bundle.description')}</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" data-toolkit="bundle" data-cycle="${this.billingCycle}">${this.t('loading')}</div>
            <div class="pricing-plan-price-period">${this.billingCycle === 'yearly' ? this.t('billingPeriod.yearly') : this.t('billingPeriod.monthly')}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>${this.t('bundle.highlights.0')}</li>
            <li>${this.t('bundle.highlights.1')}</li>
            <li>${this.t('bundle.highlights.2')}</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/what-is-seo.html" class="btn btn-secondary">${this.t('buttons.learnMore')}</a>
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/contact.html" class="btn btn-primary">${this.t('buttons.subscribe')}</a>
          </div>
        </div>
      `;
    }

    // Update prices if pricing manager is available
    if (this.pricingManager) {
      // Use setTimeout to ensure DOM is fully rendered before updating prices
      setTimeout(async () => {
        await this.updatePrices();
      }, 100);
    } else {
      console.warn('[PricingPage] PricingManager not available, prices will not update');
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

  renderServiceDetails(toolkit) {
    console.log('[PricingPage] Rendering service details for toolkit:', toolkit);
    const detailsContainer = document.getElementById('pricing-service-details');
    if (!detailsContainer) {
      console.warn('[PricingPage] #pricing-service-details container not found.');
      return;
    }

    // Service details for each toolkit
    const lang = this.language;
    const serviceDetails = {
      'seo-classic': {
        title: lang === 'fr' ? 'Services SEO Classic inclus' : 'SEO Classic Services Included',
        services: lang === 'fr' ? [
          'Gérer le mot-clé principal (2%-3%)',
          'Rédacteur de contenu',
          'Améliorer le contenu pour refléter les mots-clés du site tout en maintenant le message central',
          'Réduire le texte généré par l\'IA',
          'Corriger les liens brisés et supprimer les liens de faible qualité',
          'Corriger les erreurs critiques du site',
          'Examiner la vitesse du site avec un objectif de vitesse d\'environ 2 secondes',
          'Améliorer la convivialité mobile pour plus de crédibilité',
          'Simplifier les redirections pour la transparence des robots',
          'Optimisation des images',
          'Balise meta : Titre et descriptions',
          'Plan du site et robots',
          'Deux (2) nouveaux blogs créés par mois',
          'Protocole Open Graph',
          'Ajout de Google Analytics',
          'Rapport de progrès mensuel (avec option d\'envoi au milieu du mois si demandé)'
        ] : [
          'Manage Focus Keyword (2%-3%)',
          'Content Writer',
          'Improve content to reflect the focus words of the site while maintaining the core message',
          'Reduce the AI generated text',
          'Fix broken links and remove low quality links',
          'Fix Critical site Errors',
          'Review site speed with a Speed Target of approximately 2 seconds',
          'Improve mobile friendliness for added credibility',
          'Simplify Redirections for crawler transparency',
          'Image Optimization',
          'Meta tag: Title and Descriptions',
          'Sitemap & Robot',
          'Two (2) New Blogs Created per Month',
          'Open Graph Protocol',
          'Google Analytics Addition',
          'Monthly progress report (With option to send middle of the month if requested)'
        ]
      },
      'aeo-classic': {
        title: lang === 'fr' ? 'Services AEO Classic inclus' : 'AEO Classic Services Included',
        services: lang === 'fr' ? [
          'Structure et optimisation de contenu adaptées à l\'IA',
          'Renforcement de l\'autorité pour les signaux de confiance IA',
          'Optimisation des requêtes conversationnelles',
          'Optimisation du contenu pour les plateformes IA (ChatGPT, Google AI Overview)',
          'Balisage de données structurées pour l\'analyse IA',
          'Reconnaissance d\'entités et optimisation du graphe de connaissances',
          'Optimisation de la recherche vocale',
          'Améliorations du traitement du langage naturel',
          'Formatage de contenu pour plateformes IA',
          'Suivi et rapports mensuels de visibilité IA',
          'Mises à jour de contenu pour maintenir la pertinence IA',
          'Stratégie d\'optimisation IA multi-plateformes'
        ] : [
          'AI-friendly content structure and optimization',
          'Authority building for AI trust signals',
          'Conversational query optimization',
          'Content optimization for AI platforms (ChatGPT, Google AI Overview)',
          'Structured data markup for AI parsing',
          'Entity recognition and knowledge graph optimization',
          'Voice search optimization',
          'Natural language processing enhancements',
          'AI platform content formatting',
          'Monthly AI visibility tracking and reporting',
          'Content updates to maintain AI relevance',
          'Multi-platform AI optimization strategy'
        ]
      },
      'geo-classic': {
        title: lang === 'fr' ? 'Services GEO Classic inclus' : 'GEO Classic Services Included',
        services: lang === 'fr' ? [
          'Optimisation du profil Google Business',
          'Construction de citations locales et cohérence NAP',
          'Création de contenu spécifique à la localisation',
          'Recherche et optimisation de mots-clés locaux',
          'Optimisation Google Maps',
          'Soumissions d\'annuaires locaux',
          'Gestion des avis et renforcement de la réputation',
          'Implémentation de balisage de schéma local',
          'Contenu spécifique au quartier',
          'Construction de liens locaux',
          'Stratégie de recherche locale mobile-first',
          'Suivi et rapports de classement de recherche locale'
        ] : [
          'Google Business Profile optimization',
          'Local citation building and NAP consistency',
          'Location-specific content creation',
          'Local keyword research and optimization',
          'Google Maps optimization',
          'Local directory submissions',
          'Review management and reputation building',
          'Local schema markup implementation',
          'Neighborhood-specific content',
          'Local link building',
          'Mobile-first local search strategy',
          'Local search ranking tracking and reporting'
        ]
      },
      'free-website': {
        title: lang === 'fr' ? 'Services de refonte de site web gratuite inclus' : 'Free Website Redesign Services Included',
        services: lang === 'fr' ? [
          'Consultation de refonte de site web professionnelle',
          'Implémentation de design moderne et réactif',
          'Identité visuelle cohérente avec la marque',
          'Optimisation de l\'expérience utilisateur (UX)',
          'Mise en page réactive mobile',
          'Configuration de structure SEO de base',
          'Migration et organisation du contenu',
          'Formulaire de contact et fonctionnalités de base',
          'Optimisation de la performance du site web',
          'Configuration d\'analyses de base'
        ] : [
          'Professional website redesign consultation',
          'Modern, responsive design implementation',
          'Brand-consistent visual identity',
          'User experience (UX) optimization',
          'Mobile-responsive layout',
          'Basic SEO structure setup',
          'Content migration and organization',
          'Contact form and basic functionality',
          'Website performance optimization',
          'Basic analytics setup'
        ]
      },
      'local': {
        title: lang === 'fr' ? 'Services locaux inclus' : 'Local Services Included',
        services: lang === 'fr' ? [
          'Optimisation et classement du Local Pack',
          'Gestion des avis et renforcement de la réputation',
          'Stratégie de recherche locale mobile-first',
          'Gestion du profil Google Business',
          'Construction de citations locales',
          'Cohérence NAP (Nom, Adresse, Téléphone)',
          'Optimisation de mots-clés locaux',
          'Création de contenu basée sur la localisation',
          'Construction de liens locaux',
          'Analyses et rapports de recherche locale'
        ] : [
          'Local Pack optimization and ranking',
          'Review management and reputation building',
          'Mobile-first local search strategy',
          'Google Business Profile management',
          'Local citation building',
          'NAP (Name, Address, Phone) consistency',
          'Local keyword optimization',
          'Location-based content creation',
          'Local link building',
          'Local search analytics and reporting'
        ]
      },
      'social': {
        title: lang === 'fr' ? 'Services sociaux inclus' : 'Social Services Included',
        services: lang === 'fr' ? [
          'Optimisation de profil de médias sociaux (Forfait unique)',
          'Développement de stratégie de contenu',
          'Audit de cohérence de marque',
          '2 publications par mois par compte (Forfait gestion)',
          'Création et planification de contenu',
          'Surveillance et réponse à l\'engagement',
          'Suivi et rapports de performance',
          'Optimisation des signaux sociaux pour la recherche',
          'Amplification de contenu sur toutes les plateformes',
          'Intégration d\'analyses de médias sociaux',
          'Stratégie de contenu multi-plateformes'
        ] : [
          'Social media profile optimization (One-Time plan)',
          'Content strategy development',
          'Brand consistency audit',
          '2 posts per month per account (Management plan)',
          'Content creation and scheduling',
          'Engagement monitoring and response',
          'Performance tracking and reporting',
          'Social signal optimization for search',
          'Content amplification across platforms',
          'Social media analytics integration',
          'Cross-platform content strategy'
        ]
      }
    };

    const details = serviceDetails[toolkit] || serviceDetails['seo-classic'];
    
    detailsContainer.innerHTML = `
      <table class="pricing-service-details-table">
        <thead>
          <tr>
            <th class="pricing-service-details-col-details">${this.language === 'fr' ? 'Détails' : 'Details'}</th>
            <th class="pricing-service-details-col-included">${this.language === 'fr' ? 'Inclus' : 'Included'}</th>
          </tr>
        </thead>
        <tbody>
          ${details.services.map(service => `
            <tr>
              <td class="pricing-service-details-service">${service}</td>
              <td class="pricing-service-details-checkmark">✓</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
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

