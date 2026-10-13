import http from 'http';

function applyStyles(cssText, config) {
    var _a, _b;
    if (config.shadow) {
        const style = document.createElement("style");
        style.textContent = cssText;
        (_b = (_a = document === null || document === void 0 ? void 0 : document.querySelector(`.${config.tag}`)) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(style);
    }
    else {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.appendChild(style);
    }
}
async function loadAndApplyStyles(url, config) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const cssText = await response.text();
            applyStyles(cssText, config);
        }
        else {
            console.error(`Failed to load CSS file: ${url}`);
        }
    }
    catch (error) {
        console.error(`Error loading CSS file: ${url}`, error);
    }
}
/**
 * Defines a component with the specified configuration.
 *
 * @param config - The configuration for the component.
 */
function Component(config) {
    // Return a class decorator
    return (constructor) => {
        class CustomElement extends constructor {
            constructor() {
                super();
                this.renderComponent();
            }
            render() {
                throw new Error("You must implement render in your component class.");
            }
            renderComponent() {
                var _a, _b;
                const shadowRoot = config.shadow
                    ? this.attachShadow({ mode: "open" })
                    : undefined;
                if (shadowRoot && typeof constructor.prototype.render === "function") {
                    const jsxElement = (_b = (_a = constructor === null || constructor === void 0 ? void 0 : constructor.prototype) === null || _a === void 0 ? void 0 : _a.render(this)) !== null && _b !== void 0 ? _b : this.render();
                    if (jsxElement) {
                        shadowRoot.appendChild(jsxElement);
                    }
                    else {
                        throw new Error("The JSX provided by render must be an instance of HTMLElement.");
                    }
                }
            }
        }
        if (config.styleUrl) {
            // Load and apply styles from the external CSS file
            loadAndApplyStyles(config.styleUrl, config);
        }
        customElements.define(config.tag, CustomElement);
    };
}

// src/prop.ts
function Props(attributes) {
    return function (constructor) {
    };
}
function Prop(target, key) {
    let privateValue;
    const getter = function () {
        return privateValue;
    };
    const setter = function (newVal) {
        privateValue = newVal;
    };
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}

// src/state.ts
const stateMap = new WeakMap();
function State(target, key) {
    const config = {
        get() {
            if (!stateMap.has(this)) {
                stateMap.set(this, {});
            }
            return stateMap.get(this)[key];
        },
        set(newVal) {
            if (!stateMap.has(this)) {
                stateMap.set(this, {});
            }
            stateMap.get(this)[key] = newVal;
        },
        enumerable: true,
        configurable: true,
    };
    Object.defineProperty(target, key, config);
}

// src/jsx.ts
function JSX(tag, props, ...children) {
    const element = document.createElement(tag);
    for (const prop in props) {
        if (prop === "onclick" && typeof props[prop] === "function") {
            // If the prop is 'onclick' and a function, add an event listener
            element.addEventListener("click", props[prop]);
        }
        else {
            // Set other props as usual
            element[prop] = props[prop];
        }
    }
    for (const child of children) {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        }
        else {
            element.appendChild(child);
        }
    }
    return element;
}

// src/server.ts
function WebServer(config) {
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
function Route(method, path) {
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
function Middleware(middlewareFunc) {
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
function ParseBody() {
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

function useState(initialValue) {
    let value = initialValue;
    const stateHandlers = [];
    const setState = (newValue) => {
        value = newValue;
        stateHandlers.forEach((handler) => handler(value)); // trigger updates
    };
    const getState = () => value;
    const subscribe = (handler) => {
        stateHandlers.push(handler);
    };
    return [getState, setState, subscribe];
}

export { Component, JSX, Middleware, ParseBody, Prop, Props, Route, State, WebServer, useState };
