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
            description: 'Ongoing social media management to keep your accounts active, engaging, and aligned with your business goals. Includes 2 posts per month.',
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
            description: 'Gestion continue des médias sociaux pour garder vos comptes actifs, engageants et alignés avec vos objectifs commerciaux. Comprend 2 publications par mois.',
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
      
      // Initialize FAQ accordion
      setTimeout(() => this.initFAQ(), 100);
      
      // Initialize subscribe modal
      this.initSubscribeModal();
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

  initSubscribeModal() {
    const modal = document.getElementById('subscribe-modal');
    const closeBtn = document.querySelector('.subscribe-modal-close');
    const cancelBtn = document.getElementById('subscribe-cancel');
    const overlay = document.querySelector('.subscribe-modal-overlay');
    const form = document.getElementById('subscribe-form');

    // Close modal handlers
    const closeModal = () => {
      this.closeSubscribeModal();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Form submission using EmailJS
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('subscribe-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = this.language === 'fr' ? 'Envoi...' : 'Sending...';

        try {
          // Ensure EmailJS is ready
          await ensureEmailJSReady();

          // Collect form data
          const formData = new FormData(form);
          const emailData = {};
          
          // Convert FormData to object for EmailJS (exclude hidden FormSubmit fields)
          for (const [key, value] of formData.entries()) {
            // Skip FormSubmit-specific hidden fields
            if (!key.startsWith('_')) {
              emailData[key] = value;
            }
          }

          // Add timestamp and page URL for context
          emailData.timestamp = new Date().toISOString();
          emailData.page_url = window.location.href;
          
          // Add subject for the notification email
          emailData.subject = `New Subscription Request: ${emailData.plan || 'No Plan Selected'}`;

          // Send notification email to business owner
          await sendEmail(emailData, EMAILJS_CONFIG.templateId);
          
          // Send auto-reply email to customer (if template is configured)
          if (EMAILJS_CONFIG.autoReplyTemplateId) {
            try {
              await sendEmail(emailData, EMAILJS_CONFIG.autoReplyTemplateId);
            } catch (autoReplyError) {
              // Auto-reply failure doesn't fail the form submission
            }
          }

          // Show success message
          this.showSubscribeSuccess();
          setTimeout(() => {
            this.closeSubscribeModal();
          }, 3000);
          
        } catch (error) {
          console.error('[Subscribe] Form submission failed:', error);
          
          // Show error message
          const errorMsg = this.language === 'fr' 
            ? `Désolé, une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer plus tard.`
            : `Sorry, there was an error sending your message. Please try again later.`;
          
          this.showSubscribeError(errorMsg);
          
          // Re-enable submit button
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
    }

    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
      setTimeout(() => {
        this.showSubscribeSuccess();
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 100);
    }

    // Delegate Subscribe button clicks (since buttons are dynamically created)
    document.addEventListener('click', (e) => {
      const subscribeBtn = e.target.closest('.btn-primary[data-subscribe]');
      if (subscribeBtn) {
        e.preventDefault();
        const planName = subscribeBtn.getAttribute('data-plan') || subscribeBtn.textContent.trim();
        this.openSubscribeModal(planName);
      }
    });
  }

  openSubscribeModal(planName) {
    const modal = document.getElementById('subscribe-modal');
    const planInput = document.getElementById('subscribe-plan');
    const form = document.getElementById('subscribe-form');
    const successDiv = modal?.querySelector('.subscribe-success');
    
    if (!modal) return;

    // Remove success message if present
    if (successDiv) {
      successDiv.remove();
    }

    // Show form again
    if (form) {
      form.style.display = 'block';
      const submitBtn = document.getElementById('subscribe-submit');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = this.language === 'fr' ? 'Envoyer' : 'Send';
      }
    }

    // Set plan name
    if (planInput) {
      planInput.value = planName;
    }

    // Set form subject with plan info
    const subjectInput = document.getElementById('form-subject');
    if (subjectInput) {
      const subject = this.language === 'fr' 
        ? `Nouvelle demande d'abonnement: ${planName} - Digital Relevance`
        : `New Subscription Request: ${planName} - Digital Relevance`;
      subjectInput.value = subject;
    }

    // Reset form
    if (form) {
      form.reset();
      if (planInput) planInput.value = planName; // Restore plan name after reset
    }

    // Update modal text based on language
    const titleEl = document.getElementById('subscribe-modal-title');
    const subtitleEl = document.getElementById('subscribe-modal-subtitle');
    const cancelBtn = document.getElementById('subscribe-cancel');
    const submitBtn = document.getElementById('subscribe-submit');
    const nameLabel = document.querySelector('label[for="subscribe-name"]');
    const emailLabel = document.querySelector('label[for="subscribe-email"]');
    const phoneLabel = document.querySelector('label[for="subscribe-phone"]');
    const planLabel = document.querySelector('label[for="subscribe-plan"]');
    const messageLabel = document.querySelector('label[for="subscribe-message"]');

    if (this.language === 'fr') {
      if (titleEl) titleEl.textContent = 'Commencer';
      if (subtitleEl) subtitleEl.textContent = 'Remplissez le formulaire ci-dessous et nous vous contacterons sous peu.';
      if (cancelBtn) cancelBtn.textContent = 'Annuler';
      if (submitBtn) submitBtn.textContent = 'Envoyer';
      if (nameLabel) nameLabel.textContent = 'Nom *';
      if (emailLabel) emailLabel.textContent = 'Courriel *';
      if (phoneLabel) phoneLabel.textContent = 'Téléphone';
      if (planLabel) planLabel.textContent = 'Forfait sélectionné';
      if (messageLabel) messageLabel.textContent = 'Message (optionnel)';
    } else {
      if (titleEl) titleEl.textContent = 'Get Started';
      if (subtitleEl) subtitleEl.textContent = 'Fill out the form below and we\'ll reach out to you shortly.';
      if (cancelBtn) cancelBtn.textContent = 'Cancel';
      if (submitBtn) submitBtn.textContent = 'Send';
      if (nameLabel) nameLabel.textContent = 'Name *';
      if (emailLabel) emailLabel.textContent = 'Email *';
      if (phoneLabel) phoneLabel.textContent = 'Phone';
      if (planLabel) planLabel.textContent = 'Selected Plan';
      if (messageLabel) messageLabel.textContent = 'Message (Optional)';
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus on first input
    setTimeout(() => {
      const firstInput = document.getElementById('subscribe-name');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  showSubscribeSuccess() {
    const modal = document.getElementById('subscribe-modal');
    const form = document.getElementById('subscribe-form');
    
    if (!modal || !form) return;

    // Hide form and show success message
    form.style.display = 'none';
    
    // Remove any existing error messages
    const existingError = modal.querySelector('.subscribe-error');
    if (existingError) {
      existingError.remove();
    }
    
    const successHTML = `
      <div class="subscribe-success">
        <div class="subscribe-success-icon">✓</div>
        <h3>${this.language === 'fr' ? 'Message envoyé!' : 'Message Sent!'}</h3>
        <p>${this.language === 'fr' 
          ? 'Merci pour votre intérêt! Nous vous contacterons sous peu.<br><br><strong>Note importante:</strong> Si vous ne recevez pas de confirmation par courriel, vérifiez votre dossier spam. FormSubmit nécessite une confirmation initiale de votre adresse courriel.' 
          : 'Thank you for your interest! We\'ll reach out to you shortly.<br><br><strong>Important Note:</strong> If you don\'t receive a confirmation email, check your spam folder. FormSubmit requires initial email confirmation.'}</p>
        <button type="button" class="btn btn-primary" id="subscribe-close-btn">
          ${this.language === 'fr' ? 'Fermer' : 'Close'}
        </button>
      </div>
    `;
    
    const content = modal.querySelector('.subscribe-modal-content');
    if (content) {
      const existingSuccess = content.querySelector('.subscribe-success');
      if (existingSuccess) {
        existingSuccess.remove();
      }
      content.insertAdjacentHTML('beforeend', successHTML);
      
      // Add click handler to close button
      const closeBtn = document.getElementById('subscribe-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closeSubscribeModal();
        });
      }
    }
  }

  showSubscribeError(errorMessage) {
    const modal = document.getElementById('subscribe-modal');
    const form = document.getElementById('subscribe-form');
    
    if (!modal || !form) return;

    // Hide form and show error message
    form.style.display = 'none';
    
    // Remove any existing success messages
    const existingSuccess = modal.querySelector('.subscribe-success');
    if (existingSuccess) {
      existingSuccess.remove();
    }
    
    // Show error message
    const errorHTML = `
      <div class="subscribe-error">
        <div class="subscribe-error-icon">⚠</div>
        <h3>${this.language === 'fr' ? 'Erreur' : 'Error'}</h3>
        <p>${errorMessage}</p>
        <button type="button" class="btn btn-primary" id="subscribe-error-close">
          ${this.language === 'fr' ? 'Fermer' : 'Close'}
        </button>
      </div>
    `;
    
    const content = modal.querySelector('.subscribe-modal-content');
    if (content) {
      const existingError = content.querySelector('.subscribe-error');
      if (existingError) {
        existingError.remove();
      }
      content.insertAdjacentHTML('beforeend', errorHTML);
      
      // Add click handler to close error button
      const closeBtn = document.getElementById('subscribe-error-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closeSubscribeModal();
        });
      }
    }
  }

  closeSubscribeModal() {
    const modal = document.getElementById('subscribe-modal');
    const form = document.getElementById('subscribe-form');
    
    if (!modal) return;

    // Remove modal active class
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    if (form) {
      form.style.display = 'block';
      form.reset();
      
      // Remove success/error messages
      const successDiv = modal.querySelector('.subscribe-success');
      const errorDiv = modal.querySelector('.subscribe-error');
      if (successDiv) successDiv.remove();
      if (errorDiv) errorDiv.remove();
      
      // Reset submit button
      const submitBtn = document.getElementById('subscribe-submit');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = this.language === 'fr' ? 'Envoyer' : 'Send';
      }
    }
  }

  switchToolkit(toolkit) {
    this.currentToolkit = toolkit;
    
    // Update active state in sidebar
    const sidebarLinks = document.querySelectorAll('.pricing-sidebar-menu a');
    sidebarLinks.forEach(link => {
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
    const toggleButtons = document.querySelectorAll('.pricing-toggle-btn');
    toggleButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-cycle') === cycle) {
        btn.classList.add('active');
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
    if (titleElement) {
      const newTitle = titles[this.language]?.[toolkit] || (this.language === 'fr' ? 'Forfaits' : 'Pricing Plans');
      titleElement.textContent = newTitle;
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
    await this.renderPlans(toolkit);
    this.renderServiceDetails(toolkit);
    this.renderComparison(toolkit);
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
    const plansContainer = document.getElementById('pricing-plans');
    if (!plansContainer) {
      return;
    }

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
            <div class="pricing-plan-price-amount" style="font-size: 1.75rem;" data-toolkit="social-one-time" data-cycle="one-time">${this.t('loading')}</div>
            <div class="pricing-plan-price-period">${this.t('social.oneTime.period')}</div>
          </div>
          <ul class="pricing-plan-features">
            <li>${this.language === 'fr' ? 'Optimisation de profil sur toutes les plateformes' : 'Profile optimization across all platforms'}</li>
            <li>${this.language === 'fr' ? 'Développement de stratégie de contenu' : 'Content strategy development'}</li>
            <li>${this.language === 'fr' ? 'Audit de cohérence de marque' : 'Brand consistency audit'}</li>
          </ul>
          <div class="pricing-plan-cta">
            <a href="${this.language === 'fr' ? '/fr' : '/en'}/what-is-seo.html" class="btn btn-secondary">${this.t('buttons.learnMore')}</a>
            <button type="button" class="btn btn-primary" data-subscribe data-plan="${this.t('social.oneTime.title')}">${this.t('buttons.getStarted')}</button>
          </div>
        </div>

        <!-- Social Management Tile -->
        <div class="pricing-plan-card popular">
          <div class="pricing-plan-header">
            <h3 class="pricing-plan-title">${this.t('social.management.title')}</h3>
            <p class="pricing-plan-description">${this.t('social.management.description')}</p>
          </div>
          <div class="pricing-plan-price">
            <div class="pricing-plan-price-amount" style="font-size: 1.75rem;" data-toolkit="social-management" data-cycle="monthly">${this.t('loading')}</div>
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
            <button type="button" class="btn btn-primary" data-subscribe data-plan="${this.t('social.management.title')}">${this.t('buttons.subscribe')}</button>
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
            <button type="button" class="btn btn-primary" data-subscribe data-plan="${this.t('freeWebsite.title')}">${this.t('buttons.contactUs')}</button>
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
            <button type="button" class="btn btn-primary" data-subscribe data-plan="${currentToolkit.title}">${this.t('buttons.subscribe')}</button>
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
            <button type="button" class="btn btn-primary" data-subscribe data-plan="${this.t('bundle.title')}">${this.t('buttons.subscribe')}</button>
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
    }
  }

  async updatePrices() {
    const priceElements = document.querySelectorAll('.pricing-plan-price-amount[data-toolkit]');
    
    if (!this.pricingManager) {
      return;
    }

    // Set billing cycle on pricing manager
    this.pricingManager.setBillingCycle(this.billingCycle);

    for (const element of priceElements) {
      const toolkit = element.getAttribute('data-toolkit');
      const cycle = element.getAttribute('data-cycle');
      
      if (toolkit && cycle) {
        try {
          // Get price directly from toolkit data
          const price = await this.pricingManager.getFormattedPrice(toolkit, cycle);
          
          if (price && price !== 'N/A') {
            // Get currency for label - check data-currency attribute or use detector
            let currency = 'CAD'; // Default fallback
            if (element.hasAttribute('data-currency')) {
              currency = element.getAttribute('data-currency');
            } else if (this.currencyDetector) {
              currency = this.currencyDetector.getCurrency();
            }
            const currencyLabel = currency === 'CAD' ? 'CAD' : 'USD';
            
            // Add currency label after price
            element.innerHTML = `${price} <span class="pricing-currency-label">${currencyLabel}</span>`;
            element.setAttribute('data-currency', currency);
          } else {
            element.textContent = 'Contact Sales';
          }
        } catch (error) {
          console.error('[PricingPage] Error updating price for', toolkit, ':', error);
          element.textContent = 'Contact Sales';
        }
      }
    }
  }

  renderServiceDetails(toolkit) {
    const detailsContainer = document.getElementById('pricing-service-details');
    if (!detailsContainer) {
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
    const comparisonContainer = document.getElementById('pricing-comparison');
    if (!comparisonContainer) {
      return;
    }

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

  try {
    const pricingPage = new PricingPage();
    pricingPage.init().catch(error => {
      console.error('[PricingPage] Error initializing pricing page:', error);
    });
    window.pricingPage = pricingPage;
  } catch (error) {
    console.error('[PricingPage] Fatal error creating PricingPage:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initPricingPage();
  });
} else {
  // If DOM is already loaded, wait a bit for scripts to load
  setTimeout(initPricingPage, 100);
}

