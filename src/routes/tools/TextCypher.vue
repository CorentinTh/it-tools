<template>
    <v-card class="single-card">
        <v-card-title>Cypher text</v-card-title>
        <v-card-text>
            <v-row justify="center" align="center">
                <v-col cols="12" lg="8" md="12">
                    <v-textarea
                            outlined
                            v-model="key"
                            label="Encryption key"
                            rows="1"
                            @input="encrypt"
                    ></v-textarea>
                </v-col>
                <v-col cols="12" lg="4" md="12">
                    <v-select
                            :items="Object.keys(algorithms)"
                            label="Algorithm"
                            outlined
                            v-model="algorithm"
                            @change="encrypt"
                    ></v-select>
                </v-col>
            </v-row>

            <v-textarea
                    outlined
                    v-model="decrypted"
                    label="Clear text"
                    @input="encrypt"
            ></v-textarea>

            <v-textarea
                    outlined
                    v-model="encrypted"
                    label="Cyphered text"
                    @input="decrypt"
            ></v-textarea>
            <div class="text-center">
                <v-btn depressed @click="copy()">Copy result</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import Vue from 'vue'
    import {copyToClipboard} from "../../utils/helpers";

    export default {
        name: "TextCypher",
        data() {
            return {
                decrypted: 'Lorem ipsum dolor sit amet.',
                key: 'sup3r s3cr3t k3y',
                encrypted: '',
                algorithm: 'AES',
                algorithms: {
                    'AES': Vue.CryptoJS.AES,
                    'TripleDES': Vue.CryptoJS.TripleDES,
                    'Rabbit': Vue.CryptoJS.Rabbit,
                    'RabbitLegacy': Vue.CryptoJS.RabbitLegacy,
                    'RC4': Vue.CryptoJS.RC4
                }
            };
        },
        mounted() {
            this.encrypt();
        },
        methods: {
            copy(text) {
                copyToClipboard(text)
                this.$toast.success('Copied to clipboard.')
            },
            encrypt() {
                try {
                    this.encrypted = this.algorithms[this.algorithm].encrypt(this.decrypted.trim(), this.key).toString()
                } catch (ignored) {
                    // ignored
                }
            },
            decrypt() {
                try {
                    this.decrypted = this.algorithms[this.algorithm].decrypt(this.encrypted.trim(), this.key).toString(Vue.CryptoJS.enc.Utf8)
                } catch (ignored) {
                    // ignored
                }
            }
        }
    }
</script>

<style lang="less">

</style>