# Security Improvements Roadmap

## Current Status

### ✅ Implemented
- **Cross-Origin-Opener-Policy (COOP)**: Added `same-origin-allow-popups` to isolate top-level window
- **Trusted Types**: Added in report-only mode to monitor DOM-based XSS violations
- **Cloudflare Insights**: Added to CSP allowlist

### ⚠️ Known Issues (From Security Audit)

#### 1. CSP XSS Protection
**Current Issue:**
- Uses `unsafe-inline` which allows execution of unsafe in-page scripts
- Uses host allowlists which can be bypassed

**Recommended Solution:**
- Replace `unsafe-inline` with CSP nonces or hashes
- Use `strict-dynamic` with nonces for better security
- Remove all inline event handlers (onmouseover, onmouseout, etc.)

**Required Changes:**
1. Refactor all inline event handlers to use `addEventListener` in external JS files
2. Implement CSP nonce generation for Google Analytics scripts
3. Update all HTML pages to use nonces for inline scripts
4. Test thoroughly to ensure Google Analytics still works

**Files with Inline Event Handlers:**
- `public/en/what-is-aeo.html` - onmouseover/onmouseout handlers
- `public/en/what-is-geo.html` - onmouseover/onmouseout handlers
- `public/en/what-is-seo.html` - onmouseover/onmouseout handlers (likely)

#### 2. Trusted Types
**Current Status:** Report-only mode (monitoring violations)

**Next Steps:**
1. Monitor Trusted Types violations in browser console
2. Fix any violations found
3. Once stable, switch from report-only to enforced mode

**To Enforce:**
Change `Content-Security-Policy-Report-Only` to `Content-Security-Policy` and add:
```
require-trusted-types-for 'script';
```

## Implementation Priority

### Phase 1: Quick Wins (Done)
- ✅ Add COOP header
- ✅ Add Trusted Types in report-only
- ✅ Fix Cloudflare Insights CSP

### Phase 2: CSP Hardening (Recommended)
1. Remove inline event handlers
   - Move all `onmouseover`, `onmouseout`, `onclick` handlers to external JS
   - Use `addEventListener` in `/scripts/main.js` or component files

2. Implement CSP Nonces
   - Generate nonces server-side (or use static nonces for static site)
   - Update Google Analytics implementation to use nonces
   - Update all inline `<script>` tags to include nonces

3. Update CSP Directive
   - Remove `unsafe-inline` and `unsafe-eval`
   - Add `nonce-{value}` to script-src
   - Consider adding `strict-dynamic` if using nonces

### Phase 3: Trusted Types Enforcement
1. Monitor report-only violations for 1-2 weeks
2. Fix any violations
3. Switch to enforced mode

## Example: Refactoring Inline Handlers

**Before:**
```html
<div onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
```

**After:**
```html
<div class="hover-lift" data-hover="true">
```

```javascript
// In external JS file
document.querySelectorAll('[data-hover="true"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'translateY(-4px)';
    el.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translateY(0)';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
  });
});
```

## Example: CSP with Nonces

**Before:**
```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
```

**After:**
```
script-src 'self' 'nonce-{random-nonce}' 'strict-dynamic' https://www.googletagmanager.com
```

**HTML:**
```html
<script nonce="{random-nonce}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-3SE9GNXD80');
</script>
```

## Testing Checklist

After implementing CSP improvements:
- [ ] Google Analytics loads and tracks correctly
- [ ] All interactive elements work (hover effects, buttons, etc.)
- [ ] No CSP violations in browser console
- [ ] Trusted Types report-only shows no violations
- [ ] All pages load without errors
- [ ] Mobile functionality works correctly

## Resources

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN: Trusted Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types)
- [MDN: Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)
- [Google: CSP Nonces](https://developer.chrome.com/docs/lighthouse/best-practices/csp-xss/)

