import { Request, Response, NextFunction } from 'express';
interface PerformanceMetrics {
    method: string;
    url: string;
    duration: number;
    statusCode: number;
    timestamp: string;
    memoryUsage?: NodeJS.MemoryUsage;
}
declare class PerformanceMonitor {
    private metrics;
    private maxMetrics;
    record(metric: PerformanceMetrics): void;
    getMetrics(): PerformanceMetrics[];
    getStats(): {
        totalRequests: number;
        averageResponseTime: number;
        slowRequests: number;
        errorRate: number;
        memoryUsage: NodeJS.MemoryUsage;
    };
    getSlowRequests(threshold?: number): PerformanceMetrics[];
    clear(): void;
}
declare const performanceMonitor: PerformanceMonitor;
export declare const performanceMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const getPerformanceStats: () => {
    totalRequests: number;
    averageResponseTime: number;
    slowRequests: number;
    errorRate: number;
    memoryUsage: NodeJS.MemoryUsage;
};
export declare const getSlowRequests: (threshold?: number) => PerformanceMetrics[];
export declare const clearPerformanceData: () => void;
export default performanceMonitor;
//# sourceMappingURL=performance.d.ts.map