/**
 * Footer Component
 * Responsive footer for desktop and mobile
 * Supports multilanguage (English/French)
 */

class Footer {
  constructor(language = 'en') {
    this.language = language;
    this.translations = this.loadTranslations();
  }

  loadTranslations() {
    return {
      en: {
        followUs: 'Follow Us',
        quickLinks: 'Quick Links',
        services: 'Services',
        resources: 'Resources',
        company: 'Company',
        insights: 'Insights',
        portfolio: 'Portfolio',
        legal: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        copyright: 'All rights reserved.',
        home: 'Home',
        about: 'About',
        pricing: 'Pricing',
        blog: 'Blog',
        successStories: 'Success Stories',
        caseStudies: 'Case Studies',
        contact: 'Contact',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        description: 'Expert SEO, AEO, and GEO services to enhance your digital presence and drive measurable results in the AI-driven era.',
        linkedIn: 'LinkedIn'
      },
      fr: {
        followUs: 'Suivez-nous',
        quickLinks: 'Liens rapides',
        services: 'Services',
        resources: 'Ressources',
        company: 'Entreprise',
        insights: 'Aperçus',
        portfolio: 'Portfolio',
        legal: 'Légal',
        privacy: 'Politique de confidentialité',
        terms: 'Conditions d\'utilisation',
        copyright: 'Tous droits réservés.',
        home: 'Accueil',
        about: 'À propos',
        pricing: 'Tarification',
        blog: 'Blog',
        successStories: 'Histoires de succès',
        caseStudies: 'Études de cas',
        contact: 'Contact',
        phone: 'Téléphone',
        email: 'Courriel',
        address: 'Adresse',
        description: 'Services experts SEO, AEO et GEO pour améliorer votre présence numérique et générer des résultats mesurables à l\'ère de l\'IA.',
        linkedIn: 'LinkedIn'
      }
    };
  }

  render() {
    const t = this.translations[this.language];
    const currentYear = new Date().getFullYear();
    
    return `
      <footer class="footer" role="contentinfo">
        <div class="footer-container">
          <div class="footer-grid">
            <div class="footer-section">
              <div class="footer-logo">
                <img src="/assets/images/Logo20.png" alt="Digital Relevance" class="footer-logo-img" />
                <span class="footer-logo-text">Digital Relevance</span>
              </div>
              <p class="footer-description">${t.description}</p>
              <div class="footer-linkedin">
                <a href="https://www.linkedin.com/company/infra-dev-consulting" target="_blank" rel="noopener noreferrer" class="footer-linkedin-link" aria-label="LinkedIn">
                  <img src="/assets/images/linkedin-icon-vector-png-linkedin.png" alt="LinkedIn" class="footer-linkedin-icon" />
                </a>
              </div>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">${t.services}</h3>
              <ul class="footer-links">
                <li><a href="/${this.language}/pricing.html">${t.pricing}</a></li>
                <li><a href="/${this.language}/what-is-seo.html">What is SEO?</a></li>
                <li><a href="/${this.language}/what-is-aeo.html">What is AEO?</a></li>
                <li><a href="/${this.language}/what-is-geo.html">What is GEO?</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">${t.resources}</h3>
              <ul class="footer-links">
                <li><a href="/${this.language}/blog.html">${t.blog}</a></li>
                <li><a href="/${this.language}/insights.html">${t.insights}</a></li>
                <li><a href="/${this.language}/case-studies.html">${t.caseStudies}</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">${t.company}</h3>
              <ul class="footer-links">
                <li><a href="/${this.language}/about.html">${t.about}</a></li>
                <li><a href="/${this.language}/portfolio.html">${t.portfolio}</a></li>
                <li><a href="/${this.language}/success-stories.html">${t.successStories}</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">${t.contact}</h3>
              <ul class="footer-contact">
                <li><a href="tel:514-437-1864">${t.phone}: 514-437-1864</a></li>
                <li><a href="mailto:marc@infradevconsulting.com">${t.email}: marc@infradevconsulting.com</a></li>
                <li>${t.address}:<br>4-186 Pl. Sutton<br>Beaconsfield, QC H9W 5S3</li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <p class="footer-copyright">
                © ${currentYear} Digital Relevance. ${t.copyright}
              </p>
              <div class="footer-legal">
                <a href="/${this.language}/privacy.html">${t.privacy}</a>
                <span class="footer-separator">|</span>
                <a href="/${this.language}/terms.html">${t.terms}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  init() {
    const footerElement = document.getElementById('footer');
    if (footerElement) {
      footerElement.innerHTML = this.render();
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Footer;
}

// Make available globally
window.Footer = Footer;

