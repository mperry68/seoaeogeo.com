/**
 * Script to add lazy loading to images below the fold
 * Run with: node scripts/add-lazy-loading.js
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Images that should NOT be lazy loaded (above the fold)
const aboveFoldImages = [
  'Logo20.png',
  'Logo20-full.png',
  'discover.png'
];

function shouldLazyLoad(imgTag, filePath) {
  // Skip if already has loading attribute
  if (imgTag.includes('loading=')) {
    return false;
  }
  
  // Skip if has fetchpriority="high" (above fold)
  if (imgTag.includes('fetchpriority="high"')) {
    return false;
  }
  
  // Skip logo and above-fold images
  for (const img of aboveFoldImages) {
    if (imgTag.includes(img)) {
      return false;
    }
  }
  
  // All other images should be lazy loaded
  return true;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Match all img tags
  const imgRegex = /<img([^>]*)>/gi;
  
  content = content.replace(imgRegex, (match, attributes) => {
    if (shouldLazyLoad(match, filePath)) {
      // Add loading="lazy" if not present
      if (!attributes.includes('loading=')) {
        modified = true;
        return `<img${attributes} loading="lazy">`;
      }
    }
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.relative(publicDir, filePath)}`);
    return true;
  }
  
  return false;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other non-HTML directories
      if (file !== 'node_modules' && file !== '.git') {
        count += processDirectory(filePath);
      }
    } else if (file.endsWith('.html')) {
      if (processFile(filePath)) {
        count++;
      }
    }
  }
  
  return count;
}

// Process all HTML files
console.log('Adding lazy loading to images below the fold...\n');
const count = processDirectory(publicDir);
console.log(`\n✅ Processed ${count} files`);

