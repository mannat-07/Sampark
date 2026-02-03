// API URL configuration
// In production (when served from same origin), use relative path
// In development, use localhost
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
