<template>
    <v-card class="single-card">
        <v-card-title>Color picker/converter</v-card-title>

        <v-card-text>
            <v-row no-gutters align="center" align-content="center" justify="center">
                <v-col cols="12" sm="6" align="center">
                    <v-color-picker
                            flat
                            canvas-height="300"
                            hide-inputs
                            mode="rgba"
                            v-model="rgbPicker"
                            @input="(v) => updateColors(v, 'picker')"
                    />
                </v-col>
                <v-col cols="12" sm="6" align="center">
                    <v-text-field
                            outlined
                            ref="hex"
                            label="hex"
                            :value="hex"
                            @input="(v) => updateColors(v, 'hex')"
                            :rules="rules.hex"
                            dense
                    />
                    <v-text-field
                            outlined
                            label="rgb"
                            ref="rgb"
                            :value="rgb"
                            @input="(v) => updateColors(v, 'rgb')"
                            :rules="rules.rgb"
                            dense
                    />
                    <v-text-field
                            outlined
                            label="hsl"
                            ref="hsl"
                            :value="hsl"
                            :rules="rules.hsl"
                            @input="(v) => updateColors(v, 'hsl')"
                            dense
                    />
                    <v-combobox
                            :value="keyword"
                            outlined
                            label="css keyword"
                            ref="keyword"
                            :items="colorsName"
                            :rules="rules.keyword"
                            @change="(v) => updateColors(v, 'keyword')"
                            no-data-text="This is not an authorized color name."
                            dense
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    import convert from "color-convert";
    import colors from "color-name";

    const required = v => !!v || 'A value is required'

    export default {
        name: "ColorConverter",
        data: () => ({
            rgbPicker: {
                "r": 76,
                "g": 175,
                "b": 80
            },
            colorsName: Object.keys(colors).sort(),
            valid: true,
            rules: {
                hex: [
                    required,
                    v => /^#(?:[0-9a-fA-F]{6})$/.test(v) || 'Format should be like #112233'
                ],
                rgb: [
                    required,
                    v => /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(v) || 'Format should be like rgb(255, 0, 0)'
                ],
                hsl: [
                    required,
                    v => /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/.test(v) || 'Format should be like hsl(360, 100%, 50%)'
                ],
                keywords: [
                    required,
                    v => !!colors[v] || 'Value should be from the list'
                ]
            },
            hex: '#4CAF50',
            rgb: undefined,
            hsl: undefined,
            keyword: undefined,
        }),
        mounted() {
            this.updateColors(this.hex, 'hex');
        },
        methods: {
            setHSL(r, g, b) {
                const [h, s, l] = convert.rgb.hsl(r, g, b)
                this.hsl = `hsl(${Math.floor(h)}, ${Math.floor(s)}%, ${Math.floor(l)}%)`;
            },
            setRGB(r, g, b) {
                this.rgb = `rgb(${r}, ${g}, ${b})`;
            },
            setHEX(r, g, b) {
                const result = convert.rgb.hex(r, g, b);
                this.hex = `#${result}`
            },
            setKeyword(r, g, b) {
                this.keyword = convert.rgb.keyword(r, g, b);
            },
            updateColors(value, fromType) {
                if (fromType === 'picker' || this.$refs[fromType].validate()) {
                    if (fromType === 'rgb') {
                        const [r, g, b] = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(v => parseInt(v));
                        this.rgbPicker = {r, g, b}

                        this.setHEX(r, g, b);
                        this.setHSL(r, g, b);
                        this.setKeyword(r, g, b);
                    } else if (fromType === 'hex') {
                        const [r, g, b] = convert.hex.rgb(value.replace(/#/g, ''));
                        this.rgbPicker = {r, g, b}

                        this.setRGB(r, g, b);
                        this.setHSL(r, g, b);
                        this.setKeyword(r, g, b);
                    } else if (fromType === 'hsl') {
                        const [h, s, l] = value.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/).slice(1).map(v => parseInt(v));
                        const [r, g, b] = convert.hsl.rgb(h, s, l)
                        this.rgbPicker = {r, g, b}

                        this.setRGB(r, g, b);
                        this.setHEX(r, g, b);
                        this.setKeyword(r, g, b);
                    } else if (fromType === 'keyword') {
                        try {
                            const [r, g, b] = convert.keyword.rgb(value);
                            this.rgbPicker = {r, g, b}

                            this.setRGB(r, g, b);
                            this.setHEX(r, g, b);
                            this.setHSL(r, g, b);
                        } catch (ignored) {
                            // ignored
                        }
                    } else if (fromType === 'picker') {
                        const {r, g, b} = value;

                        this.setRGB(r, g, b);
                        this.setHEX(r, g, b);
                        this.setHSL(r, g, b);
                        this.setKeyword(r, g, b);
                    }
                }
            }
        },
        // computed: {
        //     _hex: {
        //         get() {
        //             const result = convert.rgb.hex(this.rgb.r, this.rgb.g, this.rgb.b)
        //             return `#${result}`
        //         },
        //         set(value) {
        //             if (this.$refs.hex.validate()) {
        //                 const [r, g, b] = convert.hex.rgb(value.replace(/#/g, ''))
        //                 this.rgb = {r, g, b}
        //             }
        //         }
        //     },
        //     _rgb: {
        //         get() {
        //             return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`
        //         },
        //         set(value) {
        //             if (this.$refs.rgb.validate()) {
        //                 const [r, g, b] = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(v => parseInt(v));
        //                 this.rgb = {r, g, b}
        //             }
        //         }
        //     },
        //     _hsl: {
        //         get() {
        //             const [h, s, l] = convert.rgb.hsl(this.rgb.r, this.rgb.g, this.rgb.b)
        //             return `hsl(${Math.floor(h)}, ${Math.floor(s)}%, ${Math.floor(l)}%)`
        //         },
        //         set(value) {
        //             if (this.$refs.hsl.validate()) {
        //                 const [h, s, l] = value.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/).slice(1).map(v => parseInt(v));
        //                 const [r, g, b] = convert.hsl.rgb(h, s, l)
        //
        //                 this.rgb = {r, g, b}
        //             }
        //         }
        //     },
        //     _keyword: {
        //         get() {
        //             return convert.rgb.keyword(this.rgb.r, this.rgb.g, this.rgb.b)
        //         },
        //         set(value) {
        //             if (this.$refs.keyword.validate()) {
        //                 try {
        //                     const [r, g, b] = convert.keyword.rgb(value)
        //                     this.rgb = {r, g, b}
        //                 } catch (ignored) {
        //                     // ignored
        //                 }
        //             }
        //         }
        //     }
        // }
    }
</script>

<style scoped lang="less">
    ::v-deep .v-input__icon {
        height: 18px !important;
    }
</style>