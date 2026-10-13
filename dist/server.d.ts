export declare function WebServer(config: any): (target: any) => void;
export declare function Route(method: any, path: any): (target: any, propertyKey: any, descriptor: any) => void;
export declare function Middleware(middlewareFunc: any): (target: any, propertyKey: any) => void;
export declare function ParseBody(): (target: any, propertyKey: any, descriptor: any) => any;
