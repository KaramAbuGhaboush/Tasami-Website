import { Request, Response, NextFunction } from 'express';
export declare const securityMonitoring: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const trackFailedLogin: (ip: string) => void;
export declare const clearFailedAttempts: (ip: string) => void;
//# sourceMappingURL=security.d.ts.map