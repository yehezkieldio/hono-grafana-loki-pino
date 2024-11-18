import type { Context, Next } from "hono";
import { logger } from "../logger";
import { httpRequestDuration, httpRequestTotal } from "../metrics";

export async function loggingMiddleware(c: Context, next: Next) {
    const start = Date.now();
    const { method, url } = c.req;

    try {
        await next();

        const responseTime = Date.now() - start;
        const status = c.res.status;

        console.log("Logging middleware");

        // Log request details
        logger.info({
            method,
            url,
            status,
            responseTime,
        });

        // Record metrics
        httpRequestDuration.labels(method, url, status.toString()).observe(responseTime / 1000);

        httpRequestTotal.labels(method, url, status.toString()).inc();
    } catch (error) {
        if (error instanceof Error) {
            logger.error({
                method,
                url,
                error: error.message,
            });
        }

        throw error;
    }
}
