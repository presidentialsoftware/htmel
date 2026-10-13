export declare function Props(attributes: string[]): <T extends {
    new (...args: any[]): {};
}>(constructor: T) => void;
export declare function Prop(target: any, key: string): void;
export default Prop;
