/**
 * Global Configuration for Balavignesh B Portfolio System
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

  const API_BASE = resolveApiBase();

  window.PORTFOLIO_CONFIG = {
    API_BASE: API_BASE,
    PRODUCTION_API_URL: PRODUCTION_API_URL,
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
        return cleanUrl;
      }
      // If path is an upload (/uploads/...), prepend the active API_BASE
      return `${API_BASE}/${cleanUrl}`;
    }
  };

  // Export legacy global constant for backwards compatibility
  window.API_BASE = API_BASE;
})(window);
