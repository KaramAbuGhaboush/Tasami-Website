/**
 * Rate limiting utility
 * Simple in-memory rate limiter for API routes
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  /**
   * Check if request should be rate limited
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @param limit - Maximum number of requests
   * @param windowMs - Time window in milliseconds
   * @returns true if allowed, false if rate limited
   */
  check(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.store.get(identifier)

    if (!entry || now > entry.resetAt) {
      // Create new entry or reset expired entry
      this.store.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      })
      return true
    }

    if (entry.count >= limit) {
      return false
    }

    entry.count++
    return true
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string, limit: number): number {
    const entry = this.store.get(identifier)
    if (!entry || Date.now() > entry.resetAt) {
      return limit
    }
    return Math.max(0, limit - entry.count)
  }

  /**
   * Get reset time for identifier
   */
  getResetTime(identifier: string): number | null {
    const entry = this.store.get(identifier)
    if (!entry || Date.now() > entry.resetAt) {
      return null
    }
    return entry.resetAt
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Destroy rate limiter (cleanup interval)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.clear()
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Rate limit middleware for Next.js API routes
 */
export function createRateLimit(options: {
  limit: number
  windowMs: number
  identifier?: (request: Request) => string
}) {
  const { limit, windowMs, identifier } = options

  return async (request: Request): Promise<{ allowed: boolean; remaining: number; resetTime: number | null }> => {
    const id = identifier 
      ? identifier(request)
      : request.headers.get('x-forwarded-for')?.split(',')[0] || 
        request.headers.get('x-real-ip') || 
        'unknown'

    const allowed = rateLimiter.check(id, limit, windowMs)
    const remaining = rateLimiter.getRemaining(id, limit)
    const resetTime = rateLimiter.getResetTime(id)

    return { allowed, remaining, resetTime }
  }
}

