<template>
    <v-card class="single-card">
        <v-card-title>Token generator</v-card-title>

        <v-card-text>
            <v-row no-gutters>
                <v-col lg="6" md="12">
                    <v-switch v-model="withLowercase" label="Lowercase (abc...)"/>
                    <v-switch v-model="withUppercase" label="Uppercase (ABC...)"/>

                </v-col>
                <v-col lg="6" md="12">
                    <v-switch v-model="withNumbers" label="Numbers (123...)"/>
                    <v-switch v-model="withSpecials" label="Specials (#]-...)"/>
                </v-col>
            </v-row>


            <v-slider :label="`Length (${length})`" v-model="length" min="1" max="256"></v-slider>

            <v-textarea outlined v-model="token"></v-textarea>

            <div class="text-center">
                <v-btn @click="refreshToken()" depressed class="mr-4">Refresh</v-btn>
                <v-btn @click="copyToken()" depressed>Copy token</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import {copyToClipboard} from "../../utils/helpers";

    const shuffle = (str) => str.split('').sort(() => 0.5 - Math.random()).join('');
    const noop = () => {
    };

    const lowercase = 'abcdefghijklmopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specials = '.,;:!?./-"\'#{([-|\\@)]=}*+';


    export default {
        name: 'TokenGenerator',
        data() {
            return {
                withNumbers: true,
                withLowercase: true,
                withUppercase: true,
                withSpecials: false,
                length: 32,
                refreshBool: true,
                refreshToken() {
                    this.refreshBool = !this.refreshBool;
                },
                copyToken() {
                    copyToClipboard(this.token);
                    this.$toast.success('Copied to clipboard.')
                }
            }
        },
        computed: {
            token() {
                if (this.refreshBool) noop(); // To force recomputation

                let result = '';

                if (this.withLowercase) result += lowercase;
                if (this.withUppercase) result += uppercase;
                if (this.withNumbers) result += numbers;
                if (this.withSpecials) result += specials;

                return shuffle(result.repeat(this.length)).substring(0, this.length);
            }
        }
    }
</script>

<style >

</style>