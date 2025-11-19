// Centralized configuration for backend URLs
// This ensures no hardcoded localhost:3002 references

export const getBackendUrl = (): string => {
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  
  // Construct from PORT environment variable
  const port = process.env.PORT || '3002';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.HOST || 'localhost';
  
  return `${protocol}://${host}:${port}`;
};

export const BACKEND_URL = getBackendUrl();

