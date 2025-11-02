"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheStats = exports.invalidateCache = exports.cacheConfigs = exports.createCacheMiddleware = void 0;
class SimpleCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 1000;
    }
    set(key, data, ttl = 300000) {
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
    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            return null;
        }
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            keys: Array.from(this.cache.keys())
        };
    }
}
const cache = new SimpleCache();
const createCacheMiddleware = (ttl = 300000, keyGenerator) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }
        const cacheKey = keyGenerator
            ? keyGenerator(req)
            : `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log(`[CACHE HIT] ${cacheKey}`);
            res.json(cachedData);
            return;
        }
        console.log(`[CACHE MISS] ${cacheKey}`);
        const originalJson = res.json;
        res.json = function (data) {
            cache.set(cacheKey, data, ttl);
            return originalJson.call(this, data);
        };
        next();
    };
};
exports.createCacheMiddleware = createCacheMiddleware;
exports.cacheConfigs = {
    blogArticles: (0, exports.createCacheMiddleware)(600000, (req) => {
        const { page = 1, limit = 10, category, featured } = req.query;
        return `blog:articles:${page}:${limit}:${category || 'all'}:${featured || 'all'}`;
    }),
    projects: (0, exports.createCacheMiddleware)(900000, (req) => {
        const { page = 1, limit = 10, category, featured } = req.query;
        return `projects:${page}:${limit}:${category || 'all'}:${featured || 'all'}`;
    }),
    testimonials: (0, exports.createCacheMiddleware)(1800000, (req) => {
        const { featured } = req.query;
        return `testimonials:${featured || 'all'}`;
    }),
    categories: (0, exports.createCacheMiddleware)(3600000, () => 'categories:all'),
    jobs: (0, exports.createCacheMiddleware)(1200000, (req) => {
        const { page = 1, limit = 10, department, location } = req.query;
        return `jobs:${page}:${limit}:${department || 'all'}:${location || 'all'}`;
    }),
    contactMessages: (req, res, next) => next(),
};
exports.invalidateCache = {
    blog: () => {
        const stats = cache.getStats();
        stats.keys.forEach(key => {
            if (key.startsWith('blog:')) {
                cache.delete(key);
            }
        });
        console.log('[CACHE] Invalidated blog cache');
    },
    projects: () => {
        const stats = cache.getStats();
        stats.keys.forEach(key => {
            if (key.startsWith('projects:')) {
                cache.delete(key);
            }
        });
        console.log('[CACHE] Invalidated projects cache');
    },
    all: () => {
        cache.clear();
        console.log('[CACHE] Cleared all cache');
    },
    pattern: (pattern) => {
        const stats = cache.getStats();
        stats.keys.forEach(key => {
            if (key.includes(pattern)) {
                cache.delete(key);
            }
        });
        console.log(`[CACHE] Invalidated cache with pattern: ${pattern}`);
    }
};
const getCacheStats = () => {
    return cache.getStats();
};
exports.getCacheStats = getCacheStats;
exports.default = cache;
//# sourceMappingURL=cache.js.map