<template>
    <v-row justify="center" align="center">
        <v-col cols="12" lg="4" md="6" sm="12">
            <v-card>
                <v-card-title>URL Encode</v-card-title>
                <v-card-text>
                    <v-textarea
                            outlined
                            label="String to encode"
                            v-model="encodeInput"
                    />
                    <v-textarea
                            readonly
                            outlined
                            label="URL encoded string"
                            v-model="encodeOutput"
                    />

                <div class="text-center">
                    <v-btn @click="copyText(encodeOutput)" depressed>Copy result</v-btn>
                </div>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="12" lg="4" md="6" sm="12">
            <v-card>
                <v-card-title>URL Decode</v-card-title>
                <v-card-text>
                    <v-textarea
                            outlined
                            label="String to decode"
                            v-model="decodeInput"
                    />
                    <v-textarea
                            readonly
                            outlined
                            label="URL decoded string"
                            v-model="decodeOutput"
                    />

                <div class="text-center">
                    <v-btn @click="copyText(decodeOutput)" depressed>Copy result</v-btn>
                </div>
                </v-card-text>
            </v-card>
        </v-col>


    </v-row>
</template>

<script>
    import {copyToClipboard} from "../../utils/helpers";

    export default {
        name: "UrlEncoder",
        data(){
            return {
                encodeInput: 'Hello world :)',
                decodeInput: 'Hello%20world%20%3A)',
                copyText(text){
                    copyToClipboard(text)
                    this.$toast.success('Copied to clipboard.')
                }
            }
        },
        computed:{
            encodeOutput(){
                return encodeURIComponent(this.encodeInput)
            },
            decodeOutput(){
                return decodeURIComponent(this.encodeInput)
            },
        }
    }
</script>

<style scoped>

</style>