<template>
    <v-card class="single-card">
        <v-card-title>BIP39 passphrase generator</v-card-title>
        <v-card-text>
            <v-select
                    outlined
                    label="Language"
                    @change="languageChanged"
                    :items="languageList"
                    v-model="language"
            />
            <v-text-field
                    outlined
                    v-model="entropy"
                    label="Entropy"
                    append-icon="fa-clipboard"
                    @click:append="copy(entropy)"
                    :rules="rules.entropy"
                    ref="entropy"
            />
            <v-text-field
                    outlined
                    v-model="passphrase"
                    label="Passphrase"
                    append-icon="fa-clipboard"
                    @click:append="copy(passphrase)"
                    :rules="rules.passphrase"
                    ref="passphrase"
            />
            <div class="text-center">
                <v-btn @click="refresh">refresh</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import * as bip39 from "bip39";
    import {copyable} from "../../mixins/copyable.mixin";

    const shuffle = (str) => str.split('').sort(() => 0.5 - Math.random()).join('');

    const getRandomBuffer = () => {
        return Buffer.from(shuffle('0123456789abcdef'.repeat(16)).substring(0, 32), 'hex');
    }

    export default {
        name: 'BIP39Generator',
        mixins: [copyable],
        data: () => ({
            buffer: getRandomBuffer(),
            languageList: Object.keys(bip39.wordlists).filter(k => !k.match(/[A-Z]{2}/)).map(k => ({text: k.split('_').map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(' '), value:k})),
            language: 'english',
            rules: {
                passphrase: [
                    v => (!!v && bip39.validateMnemonic(v)) || 'Invalid mnemonic.'
                ],
                entropy: [
                    v => (!!v && !!v.match(/[0-9a-fA-F]{32}/)) || 'Invalid entropy.'
                ]
            }
        }),
        methods:{
            refresh(){
                this.buffer = getRandomBuffer();
            },
            languageChanged(){
                bip39.setDefaultWordlist(this.language);
                this.passphrase = bip39.entropyToMnemonic(this.buffer)
            }
        },
        computed: {
            entropy: {
                get() {
                    return this.buffer.toString('hex')
                },
                set(value) {
                    if(this.$refs.entropy.validate()) {
                        this.buffer = Buffer.from(value, 'hex')
                    }
                }
            },
            passphrase: {
                get() {
                    return bip39.entropyToMnemonic(this.buffer)
                },
                set(value) {
                    if(this.$refs.passphrase.validate()){
                        this.buffer = Buffer.from(bip39.mnemonicToEntropy(value), 'hex')
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>