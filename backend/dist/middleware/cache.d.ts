import { Request, Response, NextFunction } from 'express';
declare class SimpleCache {
    private cache;
    private maxSize;
    set(key: string, data: any, ttl?: number): void;
    get(key: string): any | null;
    delete(key: string): void;
    clear(): void;
    getStats(): {
        size: number;
        maxSize: number;
        keys: string[];
    };
}
declare const cache: SimpleCache;
export declare const createCacheMiddleware: (ttl?: number, keyGenerator?: (req: Request) => string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const cacheConfigs: {
    blogArticles: (req: Request, res: Response, next: NextFunction) => void;
    projects: (req: Request, res: Response, next: NextFunction) => void;
    testimonials: (req: Request, res: Response, next: NextFunction) => void;
    categories: (req: Request, res: Response, next: NextFunction) => void;
    jobs: (req: Request, res: Response, next: NextFunction) => void;
    contactMessages: (req: Request, res: Response, next: NextFunction) => void;
};
export declare const invalidateCache: {
    blog: () => void;
    projects: () => void;
    all: () => void;
    pattern: (pattern: string) => void;
};
export declare const getCacheStats: () => {
    size: number;
    maxSize: number;
    keys: string[];
};
export default cache;
//# sourceMappingURL=cache.d.ts.map