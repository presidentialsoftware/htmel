// src/server.ts
import http from "http";
export function WebServer(config) {
    return function (target) {
        const server = http.createServer((req, res) => {
            const { method, url } = req;
            const routeKey = `${method} ${url}`;
            if (target.routes[routeKey]) {
                const { handler, middlewares } = target.routes[routeKey];
                // Apply middlewares if any
                middlewares.forEach((middleware) => middleware(req, res));
                // Call the route handler
                handler(req, res);
            }
            else {
                res.statusCode = 404;
                res.end("Not Found");
            }
        });
        server.listen(config.port, () => {
            console.log(`Server running at http://localhost:${config.port}/`);
        });
        target.server = server;
    };
}
export function Route(method, path) {
    return function (target, propertyKey, descriptor) {
        if (!target.constructor.routes) {
            target.constructor.routes = {};
        }
        const routeKey = `${method.toUpperCase()} ${path}`;
        target.constructor.routes[routeKey] = {
            handler: descriptor.value,
            middlewares: [],
        };
        // Store the method and path directly in the handler for later use
        target.constructor.routes[routeKey].method = method.toUpperCase();
        target.constructor.routes[routeKey].path = path;
    };
}
export function Middleware(middlewareFunc) {
    return function (target, propertyKey) {
        const routes = target.constructor.routes;
        // Find the route where the middleware should be applied
        for (const routeKey in routes) {
            if (routes[routeKey].handler.name === propertyKey) {
                routes[routeKey].middlewares.push(middlewareFunc);
            }
        }
    };
}
export function ParseBody() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (req, res) {
            let body = "";
            // Collect data chunks
            req.on("data", (chunk) => {
                body += chunk;
            });
            // When all data is received, process it and call the original method
            req.on("end", () => {
                req.body = body; // Attach the parsed body to the request object
                originalMethod.call(this, req, res); // Call the original method with the new req.body
            });
        };
        return descriptor;
    };
}
