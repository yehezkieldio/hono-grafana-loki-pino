import pino from "pino";
import pinoLoki from "pino-loki";

const transport = pinoLoki({
    host: "http://localhost:3100",
    batching: true,
    interval: 5,
    labels: { application: "hono-api" },
});

export const logger = pino(
    {
        level: "info",
    },
    transport,
);
