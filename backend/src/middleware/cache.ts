import { Request, Response, NextFunction } from 'express';

// Simple in-memory cache
interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 1000; // Maximum number of cached items

  set(key: string, data: any, ttl: number = 300000): void { // Default 5 minutes
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Global cache instance
const cache = new SimpleCache();

// Cache middleware factory
export const createCacheMiddleware = (ttl: number = 300000, keyGenerator?: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator 
      ? keyGenerator(req) 
      : `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;

    // Check if data exists in cache
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      console.log(`[CACHE HIT] ${cacheKey}`);
      res.json(cachedData);
      return;
    }

    console.log(`[CACHE MISS] ${cacheKey}`);

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache response
    res.json = function(data: any) {
      // Cache the response
      cache.set(cacheKey, data, ttl);
      
      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

// Predefined cache configurations for different endpoints
export const cacheConfigs = {
  // Blog articles - cache for 10 minutes
  blogArticles: createCacheMiddleware(600000, (req) => {
    const { page = 1, limit = 10, category, featured } = req.query;
    return `blog:articles:${page}:${limit}:${category || 'all'}:${featured || 'all'}`;
  }),

  // Projects - cache for 15 minutes
  projects: createCacheMiddleware(900000, (req) => {
    const { page = 1, limit = 10, category, featured } = req.query;
    return `projects:${page}:${limit}:${category || 'all'}:${featured || 'all'}`;
  }),

  // Testimonials - cache for 30 minutes
  testimonials: createCacheMiddleware(1800000, (req) => {
    const { featured } = req.query;
    return `testimonials:${featured || 'all'}`;
  }),

  // Categories - cache for 1 hour
  categories: createCacheMiddleware(3600000, () => 'categories:all'),

  // Jobs - cache for 20 minutes
  jobs: createCacheMiddleware(1200000, (req) => {
    const { page = 1, limit = 10, department, location } = req.query;
    return `jobs:${page}:${limit}:${department || 'all'}:${location || 'all'}`;
  }),

  // Contact messages - no caching (always fresh)
  contactMessages: (req: Request, res: Response, next: NextFunction) => next(),
};

// Cache invalidation utilities
export const invalidateCache = {
  // Invalidate all blog-related cache
  blog: () => {
    const stats = cache.getStats();
    stats.keys.forEach(key => {
      if (key.startsWith('blog:')) {
        cache.delete(key);
      }
    });
    console.log('[CACHE] Invalidated blog cache');
  },

  // Invalidate all project-related cache
  projects: () => {
    const stats = cache.getStats();
    stats.keys.forEach(key => {
      if (key.startsWith('projects:')) {
        cache.delete(key);
      }
    });
    console.log('[CACHE] Invalidated projects cache');
  },

  // Invalidate all cache
  all: () => {
    cache.clear();
    console.log('[CACHE] Cleared all cache');
  },

  // Invalidate specific pattern
  pattern: (pattern: string) => {
    const stats = cache.getStats();
    stats.keys.forEach(key => {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    });
    console.log(`[CACHE] Invalidated cache with pattern: ${pattern}`);
  }
};

// Cache statistics endpoint
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;
