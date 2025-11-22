/**
 * Cache utility for API responses
 * Implements in-memory caching with TTL support
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private maxSize: number = 1000 // Maximum number of entries

  /**
   * Get cached value
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set cached value with TTL in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    const expiresAt = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { data, expiresAt })
  }

  /**
   * Delete cached value
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Generate cache key from parameters
   */
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|')
    return `${prefix}:${sortedParams}`
  }
}

// Export singleton instance
export const memoryCache = new MemoryCache()

/**
 * Cache decorator for async functions
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyPrefix: string,
  ttlSeconds: number = 60
): T {
  return (async (...args: Parameters<T>) => {
    const cacheKey = MemoryCache.generateKey(keyPrefix, { args })
    const cached = memoryCache.get<ReturnType<T>>(cacheKey)
    
    if (cached !== null) {
      return cached
    }

    const result = await fn(...args)
    memoryCache.set(cacheKey, result, ttlSeconds)
    
    return result
  }) as T
}

