class Plurimath {
    constructor(data: string, format: string);
    toAsciimath(): string;
    toLatex(): string;
    toMathml(): string;
    toHtml(): string;
    toOmml(): string;
    toDisplay(lang: string): string;
}

declare global {
    interface Window {
        Plurimath: Plurimath
    }
  }