<template>
    <v-row justify="center" align="center">
        <v-col cols="12" xl="5" lg="6" md="12">
            <v-card>
                <v-card-text>
                    <v-textarea v-model="markdown" auto-grow outlined label="Markdown editor"/>
                    <div class="text-center">
                        <v-btn @click="copy(markdown)">copy markdown</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" xl="5" lg="6" md="12">
            <v-card>
                <v-card-text >
                    <div class="preview" v-html="html"></div>
                    <div class="text-center">
                        <v-divider />
                        <br>
                        <v-btn @click="copy(html)">copy html</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    // import {debounce} from "../../utils/helpers";
    import marked from 'marked'
    import DOMPurify from 'dompurify';
    import {copyToClipboard} from "../../utils/helpers";

    export default {
        name: "MarkdownEditor",
        data: () => ({
            markdown: '# Hello, World!\nLorem ipsum **dolor** sit *amet*, consectetur adipisicing elit. A aspernatur commodi consequuntur distinctio dolore doloribus eaque earum est ipsum nobis numquam pariatur perspiciatis quasi quis, sed, sunt tempore tenetur, veniam!\n',
        }),
        methods: {
            copy(text){
                copyToClipboard(text)
                this.$toast.success('Copied to clipboard.')
            }
        },
        computed: {
            html() {
                return DOMPurify.sanitize(marked(this.markdown))
            }
        }
    }
</script>

<style scoped lang="less">
    ::v-deep {
        .preview {
            padding: 20px;

            h1{
                margin-bottom: 15px;
            }
            pre {
                width: 100%;

                code {
                    width: 100% !important;
                    padding: 10px;
                }
            }
        }
    }
</style>
