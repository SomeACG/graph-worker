import type { MiddlewareHandler } from "hono";

export default (options: {
    cacheName: string;
    wait?: boolean;
    cacheControl?: string;
}): MiddlewareHandler => {
    if (options.wait === undefined) {
        options.wait = false;
    }

    const addHeader = (response: Response) => {
        if (options.cacheControl)
            response.headers.set("Cache-Control", options.cacheControl);
    };

    return async (context, next) => {
        
        const key = context.req.url;
        const cache = await caches.open(options.cacheName);
        const response = await cache.match(key);

        if (!response) {
            await next();
            if (!context.res.ok) {
                return;
            }
            addHeader(context.res);
        } else {
            console.log('Cache matched, status:', response.status);
            return new Response(response.body, response);
        }
    };
};
