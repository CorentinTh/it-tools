<template>
    <v-row justify="center" align="center">
        <v-col cols="12" lg="4" md="6" sm="12">
            <v-card>
                <v-card-title>File to Base64</v-card-title>
                <v-card-text>
                    <FileUploader v-model="imageFile"/>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" lg="4" md="6" sm="12" v-if="base64">
            <v-card>
                <v-card-title>Result</v-card-title>
                <v-card-text>
                    <v-img :src="base64" class="mb-4" v-if="isImage"/>
                    <v-textarea
                            label="File in base 64"
                            outlined
                            readonly
                            v-model="base64"
                            hide-details
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
    import {copyToClipboard, fileIsImage} from "../../utils/helpers";

    export default {
        name: "FileToBase64",
        components: {FileUploader},
        data() {
            return {
                imageFile: undefined,
                base64: '',
                isImage: false,
                copyBase64(){
                    copyToClipboard(this.base64)
                    this.$toast.success('Copied to clipboard.')
                }
            }
        },
        watch: {
            imageFile() {
                this.isImage = fileIsImage(this.imageFile);

                const reader = new FileReader();
                reader.readAsDataURL(this.imageFile);
                reader.onload = () => {
                    this.base64 = reader.result;
                }
                reader.onerror = () => {
                    this.base64 = '[An error as occurred]';
                }
            }
        }
    }
</script>

<style scoped>

</style>