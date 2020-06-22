<template>
    <v-card class="single-card">
        <v-card-title>QR-code generator</v-card-title>
        <v-card-text>
            <v-row justify="center" align="center">
                <v-col cols="12" lg="6" sm="12">
                    <v-text-field
                            outlined
                            v-model="value"
                            label="Data"
                            :rules="rules.value"
                    />
                    <v-slider v-model="size" min="100" max="1920" label="Size (preview will not change): " thumb-label/>
                    <v-select
                            outlined
                            v-model="level"
                            :items="levels"
                            label="Error resistance"
                    />
                    <v-row>
                        <v-col cols="12" md="6" sm="12">
                            <ColorInput v-model="fgcolor" label="Foreground color"/>
                        </v-col>
                        <v-col cols="12" md="6" sm="12">
                            <ColorInput v-model="bgcolor" label="Background color"/>
                        </v-col>
                    </v-row>

                </v-col>

                <v-col cols="12" lg="6" sm="12" class="text-center">
                    <qrcode-vue
                            :value="input"
                            :size="size"
                            :level="level"
                            :background="bgcolor"
                            :foreground="fgcolor"
                            render-as="svg"
                            class-name="qrcode-wrapper"
                    />
                </v-col>
            </v-row>

            <div class="text-center mt-3 mb-sm-2">
                <v-btn @click="download('png')" class="mr-1" color="primary">download as png</v-btn>
                <v-btn @click="download('svg')" class="ml-1" color="primary">download as svg</v-btn>
            </div>
        </v-card-text>
    </v-card>

</template>

<script>
    import QrcodeVue from 'qrcode.vue'
    import colors from "color-name";
    import ColorInput from "../../components/ColorInput";
    import {downloadBase64File} from "../../utils/helpers";

    export default {
        name: "QRCodeGenerator",
        data: () => ({
            value: 'https://it-tools.tech',
            size: 300,
            level: 'M',
            bgcolor: '#ffffff',
            fgcolor: '#000000',
            levels: [
                {text: 'Low', value: 'L'},
                {text: 'Medium', value: 'M'},
                {text: 'Quartile', value: 'Q'},
                {text: 'High', value: 'H'}
            ],
            rules: {
                value: [
                    v => v.length > 0 || 'Value is needed'
                ],
                color: [
                    v => {
                        v = v.trim()
                        const isFFFFFF = /^#(?:[0-9a-fA-F]{6})$/.test(v);
                        const isFFF = /^#(?:[0-9a-fA-F]{3})$/.test(v);
                        const isRGB = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(v);
                        const isHSL = /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/.test(v);
                        const isKeyword = v in colors;
                        const isTransparent = v === 'transparent';

                        return isFFFFFF || isFFF || isKeyword || isTransparent || isRGB || isHSL || 'Incorrect color.'
                    }
                ]
            }
        }),
        methods: {
            download(type) {
                const svgEl = this.$el.querySelector('.qrcode-wrapper svg');
                const svgString = new XMLSerializer().serializeToString(svgEl);
                const svgUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

                if (type === 'png') {
                    const canvas = document.createElement("canvas");
                    canvas.width = this.size;
                    canvas.height = this.size;
                    const ctx = canvas.getContext("2d");

                    const image = new Image();
                    image.onload = function () {
                        ctx.drawImage(image, 0, 0);
                        const result = canvas.toDataURL();

                        downloadBase64File(result, 'qr-code');
                    };
                    image.src = svgUrl;
                } else {
                    downloadBase64File(svgUrl, 'qr-code');
                }
            }
        },
        computed: {
            input() {
                return this.value

            }
        },
        components: {
            QrcodeVue,
            ColorInput
        }
    }
</script>

<style scoped lang="less">
    ::v-deep .qrcode-wrapper {
        & > * {
            width: 300px !important;
            height: 300px !important;
        }
    }
</style>