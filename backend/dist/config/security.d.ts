export declare const securityConfig: {
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    password: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
        bcryptRounds: number;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
        authMaxRequests: number;
    };
    cors: {
        origin: string[];
        credentials: boolean;
    };
    fileUpload: {
        maxSize: number;
        allowedTypes: string[];
    };
    headers: {
        cspEnabled: boolean;
        hstsEnabled: boolean;
    };
    monitoring: {
        securityEnabled: boolean;
        performanceEnabled: boolean;
    };
    admin: {
        email: string;
        password: string;
    };
    isDevelopment: boolean;
    isProduction: boolean;
};
export declare const validateEnvironment: () => void;
//# sourceMappingURL=security.d.ts.map