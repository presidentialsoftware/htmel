export function applyStyles(cssText, config) {
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
export async function loadAndApplyStyles(url, config) {
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
export function Component(config) {
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
                else {
                    // no shadow set
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
export default Component;
