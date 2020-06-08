<template>
    <v-card class="single-card">
        <v-card-title>Uuid v4 generator</v-card-title>

        <v-card-text>
            <v-text-field outlined v-model="quantity" type="number" label="Quantity" dense class="quantity"/>
            <v-textarea outlined v-model="token" class="centered-input" :rows="quantity <= 10 ? quantity : 10" readonly/>

            <div class="text-center">
                <v-btn @click="refreshBool = !refreshBool" depressed class="mr-4">Refresh</v-btn>
                <v-btn @click="copyToken()" depressed>Copy uuid{{ quantity > 1 ? 's' : ''}}</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import {copyToClipboard} from "../../utils/helpers";

    const noop = () => {
    };

    const generateUuid = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

    export default {
        name: "UuidGenerator",
        data: () => ({
            refreshBool: true,
            quantity: 1
        }),
        methods: {
            copyToken() {
                copyToClipboard(this.token);
                this.$toast.success('Copied to clipboard.')
            }
        },
        computed: {
            token() {
                if (this.refreshBool) noop(); // To force recomputation

                return Array.from({length: this.quantity}, generateUuid).join('\n');
            }
        }
    }
</script>

<style scoped lang="less">
    .quantity{
        width: 100px;
        margin: auto;
        text-align: center;

        ::v-deep input{
            text-align: center;
        }
    }

    ::v-deep .centered-input textarea {
        text-align: center;
        margin-top: 13px !important;
        font-family: Consolas, monospace;
    }
</style>