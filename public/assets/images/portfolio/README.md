# Portfolio Website Screenshots

**DEDICATED FOLDER FOR PORTFOLIO IMAGES ONLY**

This folder (`public/assets/portfolio/`) is exclusively for portfolio website preview images. These images are used only on the `/portfolio` page and should not be used elsewhere on the site.

## 📍 Location

**Full Path:** `public/assets/portfolio/`

This is a dedicated folder separate from other website assets to keep portfolio images organized and clearly identified.

## 📸 Required Images

Add your website screenshots here with these **exact filenames** (case-sensitive):

1. **stiinstitute-preview.png** - Screenshot of STI Institute website
2. **massotherapiewest-preview.png** - Screenshot of Massotherapie West website
3. **prime-grcsecuritystaff-preview.png** - Screenshot of Prime GRC Security Staff website
4. **mangospa-preview.png** - Screenshot of Mango Spa website
5. **garderiesaintbruno-preview.png** - Screenshot of Garderie Saint Bruno website

## 📋 Image Guidelines

- **Format:** PNG or JPG
- **Recommended size:** 800x600px or 1200x900px
- **Aspect ratio:** 4:3 or 16:9
- **File size:** Optimized for web (under 500KB each recommended)
- **Content:** Full website homepage screenshot or key page
- **Naming:** Use exact filenames listed above (case-sensitive)

## 🔗 How It Works

The portfolio page (`src/pages/portfolio.astro`) automatically loads images from this folder using the paths:
- `/assets/portfolio/stiinstitute-preview.png`
- `/assets/portfolio/massotherapiewest-preview.png`
- etc.

## ⚠️ Important Notes

- **This folder is portfolio-only** - Images here are not used on other pages
- **Exact filenames required** - The portfolio page looks for these specific filenames
- **Fallback:** If an image is missing, the portfolio will show a logo placeholder
- **Keep organized** - Only portfolio website screenshots should be in this folder

