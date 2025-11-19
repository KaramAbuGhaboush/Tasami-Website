// Centralized configuration for API URLs
// This ensures no hardcoded localhost:3002 references

const getApiBaseUrl = (): string => {
  // Check for NEXT_PUBLIC_API_URL first (available at build time in Next.js)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For development, construct from environment variables
  // Note: NEXT_PUBLIC_API_URL should be set in .env.local for development
  const protocol = process.env.NEXT_PUBLIC_API_PROTOCOL || 'http';
  const hostname = process.env.NEXT_PUBLIC_API_HOSTNAME || 'localhost';
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const host = process.env.NEXT_PUBLIC_API_HOST || (port ? `${hostname}:${port}` : hostname);
  
  // Only use /api suffix if not already included
  const baseUrl = `${protocol}://${host}`;
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

// For client-side runtime, get from window or construct dynamically
const getClientApiBaseUrl = (): string => {
  // Check window for runtime config (set by Next.js from NEXT_PUBLIC_ vars)
  if (typeof window !== 'undefined') {
    // Next.js exposes NEXT_PUBLIC_ vars via __NEXT_DATA__
    const nextData = (window as any).__NEXT_DATA__;
    if (nextData?.env?.NEXT_PUBLIC_API_URL) {
      return nextData.env.NEXT_PUBLIC_API_URL;
    }
    
    // Try to get from window object (can be set manually)
    if ((window as any).API_BASE_URL) {
      return (window as any).API_BASE_URL;
    }
    
    // Construct from window location for same-origin requests
    if (typeof window.location !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
      const hostname = window.location.hostname;
      
      // Try to get port from window config or use current port + 2 (common pattern)
      const currentPort = window.location.port;
      const apiPort = (window as any).API_PORT || (currentPort ? String(parseInt(currentPort) + 2) : null);
      
      // If we're on localhost and have an API port, use it
      if ((hostname === 'localhost' || hostname === '127.0.0.1') && apiPort) {
        return `${protocol}://${hostname}:${apiPort}/api`;
      }
      
      // For production, assume API is on same domain
      return `${protocol}://${hostname}/api`;
    }
  }
  
  // Server-side fallback
  return getApiBaseUrl();
};

// Export the appropriate URL based on environment
export const API_BASE_URL = typeof window === 'undefined' 
  ? getApiBaseUrl() 
  : getClientApiBaseUrl();

