// src/jsx.ts
export function JSX(tag, props, ...children) {
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
export default JSX;
