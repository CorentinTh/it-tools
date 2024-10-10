declare module "dom-to-image-more" {
    export function toPng(el: HTMLElement | undefined, options?: { bgcolor: string }) : Promise<string>;
}