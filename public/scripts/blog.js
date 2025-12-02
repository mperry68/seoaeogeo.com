/**
 * Blog Manager
 * Loads and displays blog posts dynamically from JSON data
 */

class BlogManager {
  constructor() {
    this.blogs = [];
    this.currentLanguage = 'en';
    this.postsPerPage = 6;
    this.currentPage = 1;
  }

  /**
   * Initialize blog manager
   */
  async init() {
    // Detect language from URL path
    this.currentLanguage = window.location.pathname.startsWith('/fr/') ? 'fr' : 'en';
    
    // Get current page from URL
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(urlParams.get('page')) || 1;

    // Load blog data
    await this.loadBlogs();
    
    // Render blogs
    this.renderBlogs();
  }

  /**
   * Load blog data from JSON file
   */
  async loadBlogs() {
    try {
      const response = await fetch('/data/blogs.json');
      if (!response.ok) {
        throw new Error('Failed to load blog data');
      }
      const data = await response.json();
      // Filter only published blogs and sort by date (newest first)
      this.blogs = data.blogs
        .filter(blog => blog.published)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error loading blogs:', error);
      this.blogs = [];
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    if (this.currentLanguage === 'fr') {
      return date.toLocaleDateString('fr-CA', options);
    }
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Get paginated blogs
   */
  getPaginatedBlogs() {
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    return this.blogs.slice(startIndex, endIndex);
  }

  /**
   * Get total number of pages
   */
  getTotalPages() {
    return Math.ceil(this.blogs.length / this.postsPerPage);
  }

  /**
   * Render blog image
   */
  renderBlogImage(blog) {
    if (blog.image.type === 'gradient') {
      return `
        <div class="blog-image" style="width: 100%; height: 200px; background: linear-gradient(${blog.image.gradient}); border-radius: 8px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
          ${blog.image.emoji || '📝'}
        </div>
      `;
    } else if (blog.image.type === 'url') {
      return `
        <div class="blog-image" style="width: 100%; height: 200px; overflow: hidden; border-radius: 8px; margin-bottom: 1.5rem;">
          <img src="${blog.image.url}" alt="${blog.title[this.currentLanguage]}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
      `;
    }
    return '';
  }

  /**
   * Render a single blog card
   */
  renderBlogCard(blog) {
    const lang = this.currentLanguage;
    // Always link to English blog posts, but show localized title/excerpt
    const blogUrl = `/en/blog/${blog.slug}.html`;
    
    return `
      <article class="card blog-card">
        ${this.renderBlogImage(blog)}
        <div class="blog-meta" style="color: var(--text-light); font-size: 0.875rem; margin-bottom: 0.75rem;">
          ${this.formatDate(blog.date)}
        </div>
        <h3 style="margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600;">${blog.title[lang]}</h3>
        <p style="color: var(--text-light); margin-bottom: 1.5rem; line-height: 1.6;">${blog.excerpt[lang]}</p>
        <a href="${blogUrl}" class="btn btn-secondary">${lang === 'fr' ? 'Lire la suite' : 'Read More'}</a>
      </article>
    `;
  }

  /**
   * Render pagination
   */
  renderPagination() {
    const totalPages = this.getTotalPages();
    if (totalPages <= 1) return '';

    const lang = this.currentLanguage;
    const prevDisabled = this.currentPage === 1;
    const nextDisabled = this.currentPage === totalPages;
    // Keep pagination on current language page
    const baseUrl = `/${lang}/blog.html`;
    
    const prevUrl = prevDisabled ? '#' : `${baseUrl}?page=${this.currentPage - 1}`;
    const nextUrl = nextDisabled ? '#' : `${baseUrl}?page=${this.currentPage + 1}`;

    return `
      <div class="blog-pagination" style="text-align: center; margin-top: 3rem;">
        <div style="display: inline-flex; gap: 0.5rem; align-items: center;">
          ${prevDisabled 
            ? `<button class="btn btn-secondary" disabled>${lang === 'fr' ? 'Précédent' : 'Previous'}</button>`
            : `<a href="${prevUrl}" class="btn btn-secondary">${lang === 'fr' ? 'Précédent' : 'Previous'}</a>`
          }
          <span style="padding: 0 1rem; color: var(--text-light);">
            ${lang === 'fr' ? `Page ${this.currentPage} sur ${totalPages}` : `Page ${this.currentPage} of ${totalPages}`}
          </span>
          ${nextDisabled
            ? `<button class="btn btn-secondary" disabled>${lang === 'fr' ? 'Suivant' : 'Next'}</button>`
            : `<a href="${nextUrl}" class="btn btn-secondary">${lang === 'fr' ? 'Suivant' : 'Next'}</a>`
          }
        </div>
      </div>
    `;
  }

  /**
   * Render all blogs
   */
  renderBlogs() {
    const container = document.getElementById('blog-posts-container');
    if (!container) {
      console.error('Blog posts container not found');
      return;
    }

    const paginatedBlogs = this.getPaginatedBlogs();
    
    if (paginatedBlogs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
          <p style="color: var(--text-light); font-size: 1.125rem;">
            ${this.currentLanguage === 'fr' 
              ? 'Aucun article de blog disponible pour le moment.' 
              : 'No blog posts available at the moment.'}
          </p>
        </div>
      `;
      return;
    }

    const blogsHTML = paginatedBlogs.map(blog => this.renderBlogCard(blog)).join('');
    container.innerHTML = blogsHTML;

    // Render pagination
    const paginationContainer = document.getElementById('blog-pagination');
    if (paginationContainer) {
      paginationContainer.innerHTML = this.renderPagination();
    }
  }
}

// Initialize blog manager when DOM is ready
function initBlog() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const blogManager = new BlogManager();
      blogManager.init();
      window.blogManager = blogManager;
    });
  } else {
    const blogManager = new BlogManager();
    blogManager.init();
    window.blogManager = blogManager;
  }
}

// Auto-initialize
initBlog();

