<template>
    <v-card>
        <v-card-title>Hash text</v-card-title>
        <v-card-text>
            <v-textarea
                    outlined
                    v-model="inputText"
                    label="Text to hash"
            ></v-textarea>

            <v-select
                    :items="Object.keys(algorithms)"
                    label="Algorithm"
                    outlined
                    v-model="algorithm"
            ></v-select>

            <v-textarea
                    outlined
                    readonly
                    v-model="hashed"
                    label="Hashed text"
            ></v-textarea>
            <div class="text-center">
                <v-btn depressed @click="copyHash()">Copy hash</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import Vue from 'vue'
    import {copyToClipboard} from "../utils/helpers";

    export default {
        name: "Hash",
        data() {
            return {
                inputText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
                algorithm: 'SHA256',
                algorithms:{
                    'MD5': Vue.CryptoJS.MD5,
                    'SHA1': Vue.CryptoJS.SHA1,
                    'SHA256': Vue.CryptoJS.SHA256,
                    'SHA224': Vue.CryptoJS.SHA224,
                    'SHA512': Vue.CryptoJS.SHA512,
                    'SHA384': Vue.CryptoJS.SHA384,
                    'SHA3': Vue.CryptoJS.SHA3,
                    'RIPEMD160': Vue.CryptoJS.RIPEMD160
                },
                copyHash(){
                    copyToClipboard(this.hashed)
                    this.$toast.success('Copied to clipboard.')
                }
            }
        },
        computed: {
            hashed() {
                if(!this.algorithms[this.algorithm]){
                    this.$toast.error('Invalid algorithm.')
                    return '';
                }else{
                    return this.algorithms[this.algorithm](this.inputText).toString();
                }
            }
        }
    }
</script>

<style>

</style>

