interface PerformanceMetrics {
  method: string;
  url: string;
  duration: number;
  statusCode: number;
  timestamp: string;
  memoryUsage?: NodeJS.MemoryUsage;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep only last 1000 requests

  record(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow requests
    if (metric.duration > 2000) { // 2 seconds
      console.warn(`[SLOW REQUEST] ${metric.method} ${metric.url} - ${metric.duration}ms - ${metric.statusCode}`);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getStats(): {
    totalRequests: number;
    averageResponseTime: number;
    slowRequests: number;
    errorRate: number;
    memoryUsage: NodeJS.MemoryUsage;
  } {
    const totalRequests = this.metrics.length;
    const averageResponseTime = this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests || 0;
    const slowRequests = this.metrics.filter(m => m.duration > 2000).length;
    const errorRate = this.metrics.filter(m => m.statusCode >= 400).length / totalRequests || 0;
    const memoryUsage = process.memoryUsage();

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowRequests,
      errorRate: Math.round(errorRate * 100) / 100,
      memoryUsage
    };
  }

  getSlowRequests(threshold: number = 2000): PerformanceMetrics[] {
    return this.metrics.filter(m => m.duration > threshold);
  }

  clear(): void {
    this.metrics = [];
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Performance stats
export const getPerformanceStats = () => {
  return performanceMonitor.getStats();
};

// Get slow requests
export const getSlowRequests = (threshold?: number) => {
  return performanceMonitor.getSlowRequests(threshold);
};

// Clear performance data
export const clearPerformanceData = () => {
  performanceMonitor.clear();
};

// Record performance metric
export const recordPerformanceMetric = (metric: PerformanceMetrics) => {
  performanceMonitor.record(metric);
};

export default performanceMonitor;

