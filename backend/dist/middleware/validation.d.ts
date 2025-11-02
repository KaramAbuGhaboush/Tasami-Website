import { Request, Response, NextFunction } from 'express';
export declare const sanitizeHtml: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateEmail: () => import("express-validator").ValidationChain;
export declare const validatePassword: () => import("express-validator").ValidationChain;
export declare const validateObjectId: (paramName: string) => import("express-validator").ValidationChain;
export declare const validatePagination: () => import("express-validator").ValidationChain[];
export declare const validateContactForm: () => import("express-validator").ValidationChain[];
export declare const validateBlogArticle: () => import("express-validator").ValidationChain[];
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const createRateLimit: (windowMs: number, max: number, message: string) => {
    windowMs: number;
    max: number;
    message: string;
    standardHeaders: boolean;
    legacyHeaders: boolean;
};
export declare const validateFileUpload: (allowedTypes: string[], maxSize: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=validation.d.ts.map