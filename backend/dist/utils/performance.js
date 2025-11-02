"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearPerformanceData = exports.getSlowRequests = exports.getPerformanceStats = exports.performanceMiddleware = void 0;
class PerformanceMonitor {
    constructor() {
        this.metrics = [];
        this.maxMetrics = 1000;
    }
    record(metric) {
        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }
        if (metric.duration > 2000) {
            console.warn(`[SLOW REQUEST] ${metric.method} ${metric.url} - ${metric.duration}ms - ${metric.statusCode}`);
        }
    }
    getMetrics() {
        return [...this.metrics];
    }
    getStats() {
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
    getSlowRequests(threshold = 2000) {
        return this.metrics.filter(m => m.duration > threshold);
    }
    clear() {
        this.metrics = [];
    }
}
const performanceMonitor = new PerformanceMonitor();
const performanceMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const endMemory = process.memoryUsage();
        performanceMonitor.record({
            method: req.method,
            url: req.url,
            duration,
            statusCode: res.statusCode,
            timestamp: new Date().toISOString(),
            memoryUsage: {
                rss: endMemory.rss - startMemory.rss,
                heapTotal: endMemory.heapTotal - startMemory.heapTotal,
                heapUsed: endMemory.heapUsed - startMemory.heapUsed,
                external: endMemory.external - startMemory.external,
                arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
            }
        });
    });
    next();
};
exports.performanceMiddleware = performanceMiddleware;
const getPerformanceStats = () => {
    return performanceMonitor.getStats();
};
exports.getPerformanceStats = getPerformanceStats;
const getSlowRequests = (threshold) => {
    return performanceMonitor.getSlowRequests(threshold);
};
exports.getSlowRequests = getSlowRequests;
const clearPerformanceData = () => {
    performanceMonitor.clear();
};
exports.clearPerformanceData = clearPerformanceData;
exports.default = performanceMonitor;
//# sourceMappingURL=performance.js.map