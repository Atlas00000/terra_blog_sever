import { Request, Response } from 'express';
export declare class HealthController {
    /**
     * Basic health check
     * GET /health
     */
    basic(req: Request, res: Response): Promise<void>;
    /**
     * Liveness probe
     * GET /health/live
     */
    live(req: Request, res: Response): Promise<void>;
    /**
     * Readiness probe
     * GET /health/ready
     */
    ready(req: Request, res: Response): Promise<void>;
    /**
     * Detailed health check
     * GET /health/detailed
     */
    detailed(req: Request, res: Response): Promise<void>;
}
export declare const healthController: HealthController;
//# sourceMappingURL=health.controller.d.ts.map