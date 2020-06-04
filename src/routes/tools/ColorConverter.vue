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
                            v-model="rgba"
                    />
                </v-col>
                <v-col cols="12" sm="6" align="center">
                    <v-form v-model="valid" ref="form">
                        <v-text-field
                                outlined
                                label="hex"
                                v-model="_hex"
                                :rules="rules.hex"
                                dense
                        />
                        <v-text-field
                                outlined
                                label="hexa"
                                :rules="rules.hexa"
                                v-model="_hexa"
                                dense
                        />
                        <v-text-field
                                outlined
                                label="rgb"
                                v-model="_rgb"
                                :rules="rules.rgb"
                                dense
                        />
                        <v-text-field
                                outlined
                                label="rgba"
                                v-model="_rgba"
                                :rules="rules.rgba"
                                dense
                        />
                        <v-text-field
                                outlined
                                label="hsl"
                                v-model="_hsl"
                                dense
                        />

                    </v-form>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    const required = v => !!v || 'A value is required'
    const intToHex = (int) => Math.floor(int).toString(16).toUpperCase().padStart(2, '0');
    const hexToInt = (hex) => parseInt(hex, 16);
    const rgbToHSL = ({r, g, b}) => {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {h: h * 360, s: s * 100, l: l * 100};
    }
    export default {
        name: "ColorConverter",
        data: () => ({
            rgba: {
                "r": 76,
                "g": 175,
                "b": 80,
                "a": 1
            },
            console: console,
            valid: true,
            rules: {
                hexa: [
                    required,
                    v => /^#(?:[0-9a-fA-F]{8})$/.test(v) || 'Format should be like #112233aa'
                ],
                hex: [
                    required,
                    v => /^#([0-9a-fA-F]{3}){1,2}$/.test(v) || 'Format should be like #112233'
                ],
                rgb: [
                    required,
                    v => /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(v) || 'Format should be like rgb(255, 0, 0)'
                ],
                rgba: [
                    required,
                    v => /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(?:\.\d+)?)\)$/.test(v) || 'Format should be like rgb(255, 0, 0, 1)'
                ]
            }
        }),
        computed: {
            _hex: {
                get() {
                    return `#${intToHex(this.rgba.r)}${intToHex(this.rgba.g)}${intToHex(this.rgba.b)}`
                },
                set(value) {
                    if (this.$refs.form.validate()) {
                        value = value.replace(/#/, '');
                        value = value.length === 3 ? value.split('').map(v => v + v) : value.match(/.{2}/g);
                        console.log(value);
                        this.rgba = {
                            r: hexToInt(value[0]),
                            g: hexToInt(value[1]),
                            b: hexToInt(value[2]),
                            a: '1'
                        }
                    }
                }
            },
            _hexa: {
                get() {
                    return `#${intToHex(this.rgba.r)}${intToHex(this.rgba.g)}${intToHex(this.rgba.b)}${intToHex((this.rgba.a ?? 0) * 255)}`
                },
                set(value) {
                    if (this.$refs.form.validate()) {
                        value = value.replace(/#/, '');
                        value = value.match(/.{2}/g);

                        this.rgba = {
                            r: hexToInt(value[0]),
                            g: hexToInt(value[1]),
                            b: hexToInt(value[2]),
                            a: hexToInt(value[3]) / 255,
                        }
                    }
                }
            },
            _rgb: {
                get() {
                    return `rgb(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b})`
                },
                set(value) {
                    if (this.$refs.form.validate()) {
                        const [, r, g, b] = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

                        this.rgba = {r, g, b, a: 1}
                    }
                }
            },
            _rgba: {
                get() {
                    return `rgba(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b}, ${parseFloat((this.rgba.a ?? 0).toFixed(2))})`
                },
                set(value) {
                    if (this.$refs.form.validate()) {
                        const [, r, g, b, a] = value.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(?:\.\d+)?)\)$/);

                        this.rgba = {r, g, b, a: parseFloat(a)}
                    }
                }
            },
            _hsl: {
                get() {
                    const {h, s, l} = rgbToHSL(this.rgba)

                    return `hsl(${Math.floor(h)}, ${Math.floor(s )}%, ${Math.floor(l)}%)`
                },
                set(value) {
                    if (this.$refs.form.validate()) {
                        const [, r, g, b, a] = value.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(?:\.\d+)?)\)$/);

                        this.rgba = {r, g, b, a: parseFloat(a)}
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>