# Website Project

A modern, responsive website with multilanguage support (English/French) designed for Cloudflare Pages deployment.

## Folder Structure

```
/
├── assets/
│   ├── images/          # Image assets
│   ├── icons/           # Icon files (SVG, PNG)
│   └── fonts/           # Web fonts
├── components/
│   ├── Header.js        # Header component (responsive)
│   ├── Footer.js        # Footer component (responsive)
│   └── PriceDisplay.js  # Price display component with currency
├── locales/
│   ├── en.json          # English translations
│   └── fr.json          # French translations
├── scripts/
│   ├── i18n.js          # Internationalization helper
│   ├── currency.js      # Currency detection and formatting
│   └── main.js          # Main JavaScript initialization
├── styles/
│   ├── main.css         # Global styles
│   ├── header.css       # Header styles
│   ├── footer.css       # Footer styles
│   └── price.css        # Price display styles
├── public/              # Public static files
│   └── index.html       # Example HTML page
├── _redirects           # Cloudflare Pages redirects
├── package.json         # Project configuration
└── README.md           # This file
```

## Features

- ✅ Responsive header and footer (mobile & desktop)
- ✅ Multilanguage support (English/French)
- ✅ Automatic currency detection (CAD/USD) based on geography
- ✅ Currency switcher in header
- ✅ Cloudflare Pages ready
- ✅ Organized asset structure
- ✅ Modern, accessible components

## Setup

1. Add your logo to `/assets/images/logo.svg`
2. Add social media icons to `/assets/icons/`
3. Customize translations in `/locales/`
4. Update content in HTML files
5. Deploy to Cloudflare Pages

## Deployment to Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build command: (leave empty or use `echo "No build needed"`)
3. Set output directory: `public`
4. Deploy!

## Language Routing

- English: `/en/` or `/en/*`
- French: `/fr/` or `/fr/*`
- Root `/` redirects to `/en/`

## Currency Detection

The website automatically detects user location and displays prices in the appropriate currency:

- **CAD (Canadian Dollars)**: Automatically shown for users in Canada
- **USD (US Dollars)**: Shown for all other users (default)

### Detection Methods (in order of priority):
1. User preference (saved in localStorage)
2. IP Geolocation API (ipapi.co or api.country.is)
3. Browser timezone detection
4. Browser locale detection

### Usage in HTML:
```html
<!-- Automatic price display -->
<span data-price="29.99" class="price"></span>

<!-- Or use JavaScript -->
<script>
  const price = currencyDetector.formatPrice(29.99);
  // Returns: "$29.99" (USD) or "$29.99" (CAD)
</script>
```

Users can manually switch currencies using the currency selector in the header.

## Customization

- Update colors in `styles/main.css` CSS variables
- Modify header/footer in `components/Header.js` and `components/Footer.js`
- Add more languages by creating new JSON files in `locales/`

