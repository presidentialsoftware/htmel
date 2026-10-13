/**
 * Configuration options for the component.
 */
export interface ComponentConfig {
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
export declare function applyStyles(cssText: string, config: ComponentConfig): void;
export declare function loadAndApplyStyles(url: string, config: ComponentConfig): Promise<void>;
/**
 * Defines a component with the specified configuration.
 *
 * @param config - The configuration for the component.
 */
export declare function Component(config: ComponentConfig): (constructor: {
    new (...args: any[]): HTMLElement;
}) => void;
export default Component;
