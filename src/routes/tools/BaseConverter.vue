<template>
    <v-card class="single-card">
        <v-card-title>Base converter</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="4">
                    <v-text-field
                            label="Input base"
                            outlined
                            type="number"
                            v-model="inputBase"
                            hide-details="auto"
                            :rules="baseRules"
                    />
                </v-col>
                <v-col cols="12" sm="8">
                    <v-text-field
                            ref="inputField"
                            label="Input number"
                            outlined
                            v-model="inputNumber"
                            hide-details="auto"
                    />
                </v-col>
            </v-row>
            <br>
            <v-divider/>
            <br>
            <v-row>
                <v-col cols="12" sm="4">
                    <v-text-field
                            label="Output base"
                            outlined
                            type="number"
                            v-model="outputBase"
                            :rules="baseRules"
                    />
                </v-col>
                <v-col cols="12" sm="8">
                    <v-text-field
                            label="Output number"
                            outlined
                            v-model="outputNumber"
                            readonly
                            append-icon="fa-clipboard"
                            @click:append="copy"
                    />
                </v-col>
            </v-row>


        </v-card-text>
    </v-card>
</template>

<script>
    import {copyToClipboard} from "../../utils/helpers";

    const convertBase = (value, fromBase, toBase) => {
        const range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
        const fromRange = range.slice(0, fromBase);
        const toRange = range.slice(0, toBase);

        let decValue = value.split('').reverse().reduce((carry, digit, index) => {
            if (fromRange.indexOf(digit) === -1) throw new Error('Invalid digit `' + digit + '` for base ' + fromBase + '.');
            return carry += fromRange.indexOf(digit) * (Math.pow(fromBase, index));
        }, 0);

        let newValue = '';
        while (decValue > 0) {
            newValue = toRange[decValue % toBase] + newValue;
            decValue = (decValue - (decValue % toBase)) / toBase;
        }
        return newValue || '0';
    }

    export default {
        name: "BaseConverter",
        data() {
            return {
                inputError:'',
                inputNumber: '42',
                inputBase: 10,
                outputBase: 16,
                baseRules: [
                    v => !!v || 'Required',
                    v => v > 1 || 'Base should be > 1',
                    v => v <= 64 || 'Base should be <= 64',
                ],
            }
        },
        methods: {
            copy() {
                copyToClipboard(this.outputNumber);
                this.$toast.success('Copied to clipboard.')
            }
        },
        computed: {
            outputNumber() {
                try{
                    return convertBase(this.inputNumber, this.inputBase, this.outputBase)
                }catch (e) {
                    return e.message;
                }
            }
        }
    }
</script>

<style scoped>

</style>