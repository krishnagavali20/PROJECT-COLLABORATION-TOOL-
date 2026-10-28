/**
 * Helper to get the normalized API base URL.
 * Automatically handles:
 * - Missing https:// prefix from environment variables
 * - Trailing slashes
 * - Localhost vs Production (Render) detection
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  let url = (envUrl && envUrl.trim()) || '';

  if (!url) {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      url = 'http://localhost:5000';
    } else {
      url = 'https://project-collab-backend-bw0v.onrender.com';
    }
  }

  // Remove trailing slashes
  url = url.trim().replace(/\/+$/, '');

  // Add protocol if missing (e.g., when Vercel env is set to "domain.com/")
  if (!/^https?:\/\//i.test(url)) {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      url = `http://${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  return url;
}
