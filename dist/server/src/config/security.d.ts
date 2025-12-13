/**
 * Security Configuration
 * Centralized security settings for the application
 */
/**
 * Helmet security headers configuration
 */
export declare const helmetConfig: {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: string[];
            styleSrc: string[];
            scriptSrc: string[];
            imgSrc: string[];
            connectSrc: string[];
            fontSrc: string[];
            objectSrc: string[];
            mediaSrc: string[];
            frameSrc: string[];
        };
    };
    crossOriginEmbedderPolicy: boolean;
    crossOriginResourcePolicy: {
        policy: "cross-origin";
    };
    hsts: {
        maxAge: number;
        includeSubDomains: boolean;
        preload: boolean;
    };
};
/**
 * CORS configuration
 */
export declare const corsConfig: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    maxAge: number;
};
//# sourceMappingURL=security.d.ts.map