// src/prop.ts
export function Props(attributes) {
    return function (constructor) {
        class CustomElement extends constructor {
            constructor(...args) {
                super(...args);
            }
            static get observedAttributes() {
                return attributes;
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (attributes.includes(name)) {
                    // Handle changes to the specified attributes
                    // For example, update the corresponding instance variable
                    this[name] = JSON.parse(newValue);
                }
            }
        }
    };
}
export function Prop(target, key) {
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
export default Prop;
