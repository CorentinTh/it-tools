declare module 'image-to-ascii-art' {
    interface ConfigInterface {
        // the integer of pixels drawn on the canvas.
        // it sets bigger,the generated ascii art will be more detailed.
        // it has two type to set:
        //    1. (0, 1] decimal.result is that this number multiplied by the number of pixels in the original image
        //    2. An integer greater than 1.
        drawWidth?: number;
        drawHeight?: number;
        // the integer that pick one for every how many pixels.
        // it must be an integer greater than 0.
        pickDensityHorizontal?: number;
        pickDensityVertical?: number;
        // set the char of every grey range.
        greyRangeChar?: GreyRangeChar[];
        // if a grey value can't match one of the 'greyRangeChar' config,use this char.
        defaultGreyChar?: string;
    }

    class ImageToAsciiArt {
        constructor({ canvas, config = {} }: { canvas?: HTMLCanvasElement; config?: ConfigInterface } = {})
        public convert(image: string | HTMLImageElement): Promise<string>
        public destroy(): void
    }
}