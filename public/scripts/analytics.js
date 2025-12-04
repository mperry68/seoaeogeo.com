/**
 * Google Analytics 4 (GA4) Tracking
 * Measurement ID: G-3SE9GNXD80
 */

// Google tag (gtag.js)
(function() {
  // Load gtag.js asynchronously
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3SE9GNXD80';
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', 'G-3SE9GNXD80');
})();

