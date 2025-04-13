import "./plurimath-opal.js";
Opal.require("plurimath");
window.Plurimath = class Plurimath {
    constructor(data, format) {
        this.data = Opal.Plurimath.Math.$parse(data, format);
    }
    toAsciimath() {
        return this.data.$to_asciimath();
    }
    toLatex() {
        return this.data.$to_latex();
    }
    toMathml() {
        return this.data.$to_mathml();
    }
    toHtml() {
        return this.data.$to_html();
    }
    toOmml() {
        return this.data.$to_omml();
    }
    toDisplay(lang) {
        return this.data.$to_display(lang);
    }
}