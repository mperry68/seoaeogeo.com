# Blog Posts Directory

This directory contains individual blog post HTML files.

## How to Add a New Blog Post

### Step 1: Add Blog Metadata to `/public/data/blogs.json`

Add a new entry to the `blogs` array:

```json
{
  "id": "your-blog-slug",
  "slug": "your-blog-slug",
  "title": {
    "en": "Your English Title",
    "fr": "Votre titre français"
  },
  "excerpt": {
    "en": "A brief description of your blog post in English.",
    "fr": "Une brève description de votre article de blog en français."
  },
  "date": "2024-01-20",
  "author": "Digital Relevance Team",
  "category": "SEO",
  "tags": ["SEO", "Strategy", "Tips"],
  "image": {
    "type": "gradient",
    "gradient": "135deg, #667eea 0%, #764ba2 100%",
    "emoji": "📈"
  },
  "published": true,
  "featured": false
}
```

**Image Options:**
- **Gradient**: Use `"type": "gradient"` with a gradient string and emoji
- **URL**: Use `"type": "url"` with `"url": "/path/to/image.jpg"`

### Step 2: Create the Blog Post HTML File

1. Copy the template: `/public/templates/blog-post-template.html`
2. Save it as: `/public/en/blog/your-blog-slug.html`
3. Replace all placeholders:
   - `[LANGUAGE]` → `en` (or `fr` for French)
   - `[BLOG_TITLE]` → Your blog title
   - `[BLOG_EXCERPT]` → Your excerpt
   - `[BLOG_SLUG]` → Your slug
   - `[BLOG_DATE]` → Date in YYYY-MM-DD format
   - `[BLOG_DATE_FORMATTED]` → Formatted date (e.g., "January 20, 2024")
   - `[BLOG_CATEGORY]` → Your category
   - `[BLOG_TAGS]` → Comma-separated tags
   - `[BLOG_TAGS_HTML]` → HTML for tags (see example below)
   - `[BACK_TO_BLOG_TEXT]` → "Back to Blog" or "Retour au blog"
   - `[BLOG_IMAGE_IF_URL]` → Leave empty if using gradient, or add image HTML if using URL

**Example Tags HTML:**
```html
<span class="blog-tag">SEO</span>
<span class="blog-tag">Strategy</span>
<span class="blog-tag">Tips</span>
```

### Step 3: Write Your Content

In the blog post HTML file, replace the placeholder content in the `<div class="blog-content">` section with your actual blog post content.

Use standard HTML:
- `<p>` for paragraphs
- `<h2>`, `<h3>`, `<h4>` for headings
- `<ul>`, `<ol>`, `<li>` for lists
- `<strong>`, `<em>` for emphasis
- `<a>` for links
- `<img>` for images
- `<blockquote>` for quotes
- `<code>` and `<pre>` for code

### Step 4: Test

1. Open `/en/blog.html` to see your blog post in the listing
2. Click on your blog post to view the full article
3. Verify all links and images work correctly
4. Check `/fr/blog.html` - it will show French titles/excerpts but link to English posts

## Notes

- **Blog posts are English only**: All blog posts are created in `/public/en/blog/`
- **French listing**: The French blog page (`/fr/blog.html`) will display French titles and excerpts from the JSON, but all blog posts link to the English versions
- **No French blog folders needed**: You don't need to create French versions of blog posts

## Tips

- Keep slugs URL-friendly (lowercase, hyphens instead of spaces)
- Use consistent date format (YYYY-MM-DD)
- Write compelling excerpts (150-200 characters)
- Choose appropriate categories and tags
- Always provide both English and French titles/excerpts in the JSON for proper display on both language pages

