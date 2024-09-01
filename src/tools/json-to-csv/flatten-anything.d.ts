declare module "flatten-anything" {
    export function flatten(objectOrArray: {
        [key in string]: any;
    }, untilDepth?: number): {
        [key in string]: any;
    };
}