// src/state.ts
const stateMap = new WeakMap();
export function State(target, key) {
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
export default State;
