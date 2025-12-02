# Blog Post Template Guide

## Placeholders to Replace

When creating a new blog post from `blog-post-template.html`, replace these placeholders:

### Required Placeholders

- `[BLOG_SLUG]` - The URL-friendly slug (e.g., "my-new-blog")
- `[BLOG_TITLE_EN]` - English title (from JSON `title.en`)
- `[BLOG_EXCERPT_EN]` - English excerpt (from JSON `excerpt.en`)
- `[BLOG_DATE]` - Date in YYYY-MM-DD format (e.g., "2024-01-20")
- `[BLOG_DATE_FORMATTED]` - Formatted date (e.g., "January 20, 2024")
- `[BLOG_CATEGORY]` - Category name (e.g., "SEO", "AEO", "GEO")
- `[BLOG_TAGS]` - Comma-separated tags for meta keywords (e.g., "SEO, Strategy, Tips")
- `[BLOG_TAGS_HTML]` - HTML for tags (see example below)
- `[BLOG_IMAGE_IF_URL]` - Leave empty if using gradient, or add image HTML if using URL type

### Example Tag HTML

Replace `[BLOG_TAGS_HTML]` with:
```html
<span class="blog-tag">SEO</span>
<span class="blog-tag">Strategy</span>
<span class="blog-tag">Tips</span>
```

### Example Image HTML (if using URL type)

Replace `[BLOG_IMAGE_IF_URL]` with:
```html
<img src="/path/to/image.jpg" alt="Blog post image" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 2rem;" />
```

### Notes

- All blog posts are in English only
- French titles/excerpts are only used on the listing page
- Always save blog posts to `/public/en/blog/`
- The template is already set to English (`lang="en"`)

