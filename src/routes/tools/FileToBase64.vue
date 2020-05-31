<template>
    <v-row justify="center" align="center">
        <v-col cols="12" lg="4" md="6" sm="12">
            <v-card>
                <v-card-title>File to Base64</v-card-title>
                <v-card-text>
                    <FileUploader v-model="file"/>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" lg="4" md="6" sm="12" v-if="base64 || loading">
            <v-card>
                <v-card-title>Result</v-card-title>
                <v-card-text>
                    <v-textarea
                            label="File in base 64"
                            outlined
                            readonly
                            v-model="base64"
                            hide-details
                            :loading="loading"
                    />
                    <div class="text-center mt-4">
                        <v-btn @click="copyBase64()" depressed>Copy base64</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

</template>

<script>
    import FileUploader from '../../components/FileUploader'
    import {copyToClipboard} from "../../utils/helpers";

    export default {
        name: "FileToBase64",
        components: {FileUploader},
        data() {
            return {
                file: undefined,
                loading: false,
                base64: '',
                copyBase64() {
                    copyToClipboard(this.base64)
                    this.$toast.success('Copied to clipboard.')
                }
            }
        },
        methods:{
            handleBase64(base64){
                this.base64 = base64;
                this.loading = false;
            }
        },
        watch: {
            file() {
                this.loading = true;
                this.base64 = '';
                const reader = new FileReader();
                reader.onload = () => this.handleBase64(reader.result);
                reader.onerror = () => this.handleBase64('[An error as occurred]');
                reader.readAsDataURL(this.file);
            }
        }
    }
</script>

<style scoped>

</style>