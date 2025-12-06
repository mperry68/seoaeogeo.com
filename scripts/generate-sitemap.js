/**
 * Sitemap Generator with Dynamic lastmod Dates
 * 
 * This script generates/updates sitemap.xml with dynamic lastmod dates
 * based on actual file modification times.
 * 
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const BASE_URL = 'https://digitalrelevance.io';

// Map of URL paths to file paths
const urlToFileMap = {
  '/': 'index.html',
  '/en/what-is-seo.html': 'en/what-is-seo.html',
  '/en/what-is-aeo.html': 'en/what-is-aeo.html',
  '/en/what-is-geo.html': 'en/what-is-geo.html',
  '/en/pricing.html': 'en/pricing.html',
  '/en/about.html': 'en/about.html',
  '/en/contact.html': 'en/contact.html',
  '/en/blog.html': 'en/blog.html',
  '/en/case-studies.html': 'en/case-studies.html',
  '/en/portfolio.html': 'en/portfolio.html',
  '/en/success-stories.html': 'en/success-stories.html',
  '/en/insights.html': 'en/insights.html',
  '/en/complete-seo-guide.html': 'en/complete-seo-guide.html',
  '/en/technical-seo-checklist.html': 'en/technical-seo-checklist.html',
  '/en/seo-content-template.html': 'en/seo-content-template.html',
  '/en/on-page-seo-checklist.html': 'en/on-page-seo-checklist.html',
  '/en/local-seo-checklist.html': 'en/local-seo-checklist.html',
  '/en/geo-content-checklist.html': 'en/geo-content-checklist.html',
  '/en/aeo-content-checklist.html': 'en/aeo-content-checklist.html',
  '/en/website-audit-guide.html': 'en/website-audit-guide.html',
  '/en/quality-policy.html': 'en/quality-policy.html',
  '/en/environmental-policy.html': 'en/environmental-policy.html',
  '/en/privacy.html': 'en/privacy.html',
  '/en/cookies-policy.html': 'en/cookies-policy.html',
  '/fr/': 'fr/index.html',
  '/fr/index.html': 'fr/index.html',
  '/fr/what-is-seo.html': 'fr/what-is-seo.html',
  '/fr/what-is-aeo.html': 'fr/what-is-aeo.html',
  '/fr/what-is-geo.html': 'fr/what-is-geo.html',
  '/fr/pricing.html': 'fr/pricing.html',
  '/fr/about.html': 'fr/about.html',
  '/fr/contact.html': 'fr/contact.html',
  '/fr/blog.html': 'fr/blog.html',
  '/fr/quality-policy.html': 'fr/quality-policy.html',
  '/fr/environmental-policy.html': 'fr/environmental-policy.html',
};

// Blog posts
const blogPosts = [
  'en/blog/ai-search-revolution-seo-2025.html',
  'en/blog/entity-based-seo-llms.html',
  'en/blog/chatgpt-search-optimization-businesses.html',
  'en/blog/how-to-structure-content-for-ai-search.html',
  'en/blog/what-is-aeo-complete-guide-2025.html',
  'en/blog/seo-vs-aeo-vs-geo-differences.html',
  'en/blog/how-chatgpt-chooses-sources.html',
  'en/blog/future-of-seo-2024.html',
  'en/blog/aeo-optimization.html',
  'en/blog/local-seo-strategies.html',
  'en/blog/seo-metrics.html',
  'en/blog/content-strategy.html',
  'en/blog/technical-seo.html',
];

// Case studies
const caseStudies = [
  'en/case-study-mango-spraytan.html',
  'en/case-study-local-service-business.html',
  'en/case-study-shopexpress22.html',
];

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Get file modification date in YYYY-MM-DD format
 */
function getFileModDate(filePath) {
  const fullPath = path.join(PUBLIC_DIR, filePath);
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const date = new Date(stats.mtime);
      return date.toISOString().split('T')[0];
    }
  } catch (error) {
    console.warn(`Warning: Could not get mod date for ${filePath}:`, error.message);
  }
  // Fallback to today's date if file doesn't exist
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate sitemap XML
 */
function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage (English at root) -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${getFileModDate('index.html')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/index.html"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>
    <image:image>
      <image:loc>${BASE_URL}/assets/images/Logo20-full.png</image:loc>
      <image:title>${escapeXml('Digital Relevance - Expert SEO, AEO & GEO Services')}</image:title>
      <image:caption>Digital Relevance logo and branding</image:caption>
    </image:image>
  </url>
`;

  // Add main pages
  const mainPages = [
    { url: '/en/what-is-seo.html', file: 'en/what-is-seo.html', priority: '0.9', changefreq: 'monthly', hasImage: true, imageTitle: 'What is SEO? Complete Guide to Search Engine Optimization' },
    { url: '/en/what-is-aeo.html', file: 'en/what-is-aeo.html', priority: '0.9', changefreq: 'monthly', hasImage: true, imageTitle: 'What is AEO? Answer Engine Optimization Guide for AI Search' },
    { url: '/en/what-is-geo.html', file: 'en/what-is-geo.html', priority: '0.9', changefreq: 'monthly', hasImage: true, imageTitle: 'What is GEO? Geographic Engine Optimization for Local Businesses' },
    { url: '/en/pricing.html', file: 'en/pricing.html', priority: '0.9', changefreq: 'weekly' },
    { url: '/en/about.html', file: 'en/about.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/en/contact.html', file: 'en/contact.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/en/blog.html', file: 'en/blog.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/en/case-studies.html', file: 'en/case-studies.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/en/portfolio.html', file: 'en/portfolio.html', priority: '0.7', changefreq: 'monthly' },
    { url: '/en/success-stories.html', file: 'en/success-stories.html', priority: '0.7', changefreq: 'monthly' },
    { url: '/en/insights.html', file: 'en/insights.html', priority: '0.7', changefreq: 'monthly' },
  ];

  mainPages.forEach(page => {
    const lastmod = getFileModDate(page.file);
    xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;
    
    // Add hreflang if it's a bilingual page
    if (page.url.startsWith('/en/') && !page.url.includes('/blog/') && !page.url.includes('case-study')) {
      const frUrl = page.url.replace('/en/', '/fr/');
      xml += `    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
`;
    }
    
    // Add image if specified
    if (page.hasImage) {
      const escapedTitle = escapeXml(page.imageTitle);
      const escapedCaption = escapeXml(page.imageTitle.replace('?', '') + ' - Digital Relevance');
      xml += `    <image:image>
      <image:loc>${BASE_URL}/assets/images/Logo20-full.png</image:loc>
      <image:title>${escapedTitle}</image:title>
      <image:caption>${escapedCaption}</image:caption>
    </image:image>
`;
    }
    
    xml += `  </url>
`;
  });

  // Add blog posts
  blogPosts.forEach(blogFile => {
    const url = `/${blogFile}`;
    const lastmod = getFileModDate(blogFile);
    xml += `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add case studies
  caseStudies.forEach(caseFile => {
    const url = `/${caseFile}`;
    const lastmod = getFileModDate(caseFile);
    xml += `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  // Add checklist/guide pages
  const checklistPages = [
    { url: '/en/complete-seo-guide.html', file: 'en/complete-seo-guide.html' },
    { url: '/en/technical-seo-checklist.html', file: 'en/technical-seo-checklist.html' },
    { url: '/en/seo-content-template.html', file: 'en/seo-content-template.html' },
    { url: '/en/on-page-seo-checklist.html', file: 'en/on-page-seo-checklist.html' },
    { url: '/en/local-seo-checklist.html', file: 'en/local-seo-checklist.html' },
    { url: '/en/geo-content-checklist.html', file: 'en/geo-content-checklist.html' },
    { url: '/en/aeo-content-checklist.html', file: 'en/aeo-content-checklist.html' },
    { url: '/en/website-audit-guide.html', file: 'en/website-audit-guide.html' },
  ];

  checklistPages.forEach(page => {
    const lastmod = getFileModDate(page.file);
    xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}${page.url.replace('/en/', '/fr/')}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
  </url>
`;
  });

  // Add policy pages
  const policyPages = [
    { url: '/en/quality-policy.html', file: 'en/quality-policy.html' },
    { url: '/en/environmental-policy.html', file: 'en/environmental-policy.html' },
    { url: '/en/privacy.html', file: 'en/privacy.html', hasHreflang: false },
    { url: '/en/cookies-policy.html', file: 'en/cookies-policy.html', hasHreflang: false },
  ];

  policyPages.forEach(page => {
    const lastmod = getFileModDate(page.file);
    xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
`;
    // Add hreflang if French version exists
    const frFile = page.file.replace('/en/', '/fr/');
    if (fs.existsSync(path.join(PUBLIC_DIR, frFile))) {
      xml += `    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}${page.url.replace('/en/', '/fr/')}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
`;
    } else if (page.hasHreflang === false) {
      // For pages without French versions, add self-referencing hreflang and x-default
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.url}"/>
`;
    }
    xml += `  </url>
`;
  });

  // Add French pages
  const frenchPages = [
    { url: '/fr/', file: 'fr/index.html', priority: '0.9', changefreq: 'weekly' },
    { url: '/fr/index.html', file: 'fr/index.html', priority: '0.9', changefreq: 'weekly' },
    { url: '/fr/what-is-seo.html', file: 'fr/what-is-seo.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/fr/what-is-aeo.html', file: 'fr/what-is-aeo.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/fr/what-is-geo.html', file: 'fr/what-is-geo.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/fr/pricing.html', file: 'fr/pricing.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/fr/about.html', file: 'fr/about.html', priority: '0.7', changefreq: 'monthly' },
    { url: '/fr/contact.html', file: 'fr/contact.html', priority: '0.7', changefreq: 'monthly' },
    { url: '/fr/blog.html', file: 'fr/blog.html', priority: '0.7', changefreq: 'weekly' },
  ];

  frenchPages.forEach(page => {
    const lastmod = getFileModDate(page.file);
    xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;
    
    // Add hreflang
    if (page.url.startsWith('/fr/')) {
      const enUrl = page.url.replace('/fr/', '/en/').replace('/fr/', '/');
      if (enUrl === '/') {
        xml += `    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>
`;
      } else {
        xml += `    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${enUrl}"/>
`;
      }
    }
    
    xml += `  </url>
`;
  });

  // Add French policy pages
  const frenchPolicyPages = [
    { url: '/fr/quality-policy.html', file: 'fr/quality-policy.html' },
    { url: '/fr/environmental-policy.html', file: 'fr/environmental-policy.html' },
  ];

  frenchPolicyPages.forEach(page => {
    if (fs.existsSync(path.join(PUBLIC_DIR, page.file))) {
      const lastmod = getFileModDate(page.file);
      xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url.replace('/fr/', '/en/')}"/>
  </url>
`;
    }
  });

  xml += `</urlset>
`;

  return xml;
}

// Main execution
try {
  console.log('Generating sitemap with dynamic lastmod dates...');
  const sitemapXml = generateSitemap();
  fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf8');
  console.log(`✅ Sitemap generated successfully: ${SITEMAP_PATH}`);
  console.log(`   All lastmod dates are based on actual file modification times.`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}

