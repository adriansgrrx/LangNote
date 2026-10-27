import ratelimit from "../src/config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
        const { success } = await ratelimit.limit(clientIp);

        if (!success) {
            return res.status(429).json({
                message: "Too many requests. Please try again later."
            });
        } 
        next();
    } catch (error) {
        // Fail-open: log warning and allow request to proceed if Redis service is unreachable
        console.warn("Rate limit service warning (failing open):", error.message);
        next();
    }
};

export default rateLimiter;