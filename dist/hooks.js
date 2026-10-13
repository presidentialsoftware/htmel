export function useState(initialValue) {
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
