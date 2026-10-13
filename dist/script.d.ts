/**
 * Configuration options for the component.
 */
interface ComponentConfig {
    /**
     * The HTML tag for the component.
     */
    tag: string;
    /**
     * The URL to the component's CSS file (optional).
     */
    styleUrl?: string;
    /**
     * Indicates whether to use shadow DOM (optional).
     */
    shadow?: boolean;
    /**
     * An array of observed attributes (optional).
     */
    observedAttributes?: string[];
}
/**
 * Defines a component with the specified configuration.
 *
 * @param config - The configuration for the component.
 */
declare function Component(config: ComponentConfig): (constructor: {
    new (...args: any[]): HTMLElement;
}) => void;

declare function Props(attributes: string[]): <T extends {
    new (...args: any[]): {};
}>(constructor: T) => void;
declare function Prop(target: any, key: string): void;

declare function State(target: any, key: string): void;

declare function JSX(tag: string, props: object, ...children: any[]): HTMLElement;

declare function WebServer(config: any): (target: any) => void;
declare function Route(method: any, path: any): (target: any, propertyKey: any, descriptor: any) => void;
declare function Middleware(middlewareFunc: any): (target: any, propertyKey: any) => void;
declare function ParseBody(): (target: any, propertyKey: any, descriptor: any) => any;

declare function useState(initialValue: any): ((newValue: any) => void)[];

export { Component, JSX, Middleware, ParseBody, Prop, Props, Route, State, WebServer, useState };
