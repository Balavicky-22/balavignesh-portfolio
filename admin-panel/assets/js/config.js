/**
 * Global Configuration for Balavignesh B Admin Panel
 * Handles dynamic API routing between Local Development and Production
 */
(function(window) {
  'use strict';

  // 1. Check for manual override in localStorage
  const storedApi = localStorage.getItem('portfolio_api_base');
  
  // 2. Production Render Backend Default URL
  const PRODUCTION_API_URL = 'https://balavignesh-portfolio-api.onrender.com';

  // 3. Resolve API base URL dynamically
  function resolveApiBase() {
    if (window.__PORTFOLIO_API_URL__) {
      return window.__PORTFOLIO_API_URL__.replace(/\/+$/, '');
    }
    if (storedApi && storedApi.trim() !== '') {
      return storedApi.trim().replace(/\/+$/, '');
    }
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '' || window.location.protocol === 'file:') {
      return 'http://localhost:8000';
    }
    return PRODUCTION_API_URL.replace(/\/+$/, '');
  }

  // 4. Resolve Public Portfolio Website URL dynamically
  function resolvePortfolioUrl() {
    if (window.location.protocol === 'file:') {
      return '../public-portfolio/index.html';
    }
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return 'https://balavignesh.vercel.app';
  }

  const API_BASE = resolveApiBase();
  const PORTFOLIO_URL = resolvePortfolioUrl();

  window.PORTFOLIO_CONFIG = {
    API_BASE: API_BASE,
    PRODUCTION_API_URL: PRODUCTION_API_URL,
    PORTFOLIO_URL: PORTFOLIO_URL,
    setApiBase: function(newUrl) {
      if (newUrl) {
        localStorage.setItem('portfolio_api_base', newUrl.trim());
      } else {
        localStorage.removeItem('portfolio_api_base');
      }
      window.location.reload();
    },
    resetApiBase: function() {
      localStorage.removeItem('portfolio_api_base');
      window.location.reload();
    },
    // Helper to format media/image URLs consistently whether local or production
    formatMediaUrl: function(url) {
      if (!url) return '';
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
      }
      const cleanUrl = url.replace(/^\/+/, '');
      // If path is local relative assets (assets/images/...)
      if (cleanUrl.startsWith('assets/')) {
        return `${API_BASE}/${cleanUrl}`;
      }
      // If path is an upload (/uploads/...), prepend the active API_BASE
      return `${API_BASE}/${cleanUrl}`;
    }
  };

  // Automatically update all "View Site" and "Back to Portfolio" links
  function updateViewSiteLinks() {
    const targetUrl = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.PORTFOLIO_URL) || PORTFOLIO_URL;
    document.querySelectorAll('a.view-site, a[href*="public-portfolio"]').forEach(link => {
      link.href = targetUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateViewSiteLinks);
  } else {
    updateViewSiteLinks();
  }

  // Export legacy global constant for backwards compatibility
  window.API_BASE = API_BASE;
  window.PORTFOLIO_URL = PORTFOLIO_URL;
})(window);
