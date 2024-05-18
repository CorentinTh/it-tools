declare module 'jsonar-mod' {
    export function arrify(json: any, options?: { prettify?: boolean}): string
    export function parse(php: string): object
}