<template>
    <v-card class="single-card">
        <v-card-title>Base64 string converter</v-card-title>
        <v-card-text>
            <v-textarea
                    outlined
                    v-model="clear"
                    label="Clear text"
            ></v-textarea>

            <v-textarea
                    outlined
                    v-model="base64"
                    label="Base64 text"
                    :rules="rules.base64"
                    ref="base64"
            ></v-textarea>
            <div class="text-center">
                <v-btn class="mr-1" depressed @click="copy(clear)">Copy clear</v-btn>
                <v-btn class="ml-1" depressed @click="copy(base64)">Copy base64</v-btn>
            </div>
        </v-card-text>
    </v-card>

</template>

<script>
    import {copyable} from "../../mixins/copyable.mixin";

    export default {
        name: "StringToBase64",
        mixins: [copyable],
        data() {
            return {
                clear: 'Lorem ipsum dolor sit amet.',
                rules:{
                    base64: [
                        v => {
                            try{
                                return btoa(atob(v)) === v || 'Input is not base64.'
                            }catch (e) {
                                return 'Input is not base64.'
                            }
                        }
                    ]
                }
            }
        },
        computed: {
            base64: {
                get(){
                    return btoa(this.clear)
                },
                set(value){
                    if(this.$refs.base64.validate()){
                        this.clear = atob(value)
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>