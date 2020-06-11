<template>
    <v-card class="single-card">
        <v-card-title>Uuid v4 generator</v-card-title>

        <v-card-text>
            <v-text-field
                    outlined
                    v-model.number="quantity"
                    ref="quantity"
                    type="number"
                    label="Quantity"
                    dense
                    class="quantity"
                    :rules="rules.quantity"
            />
            <v-textarea outlined v-model="token" class="centered-input" :rows="quantity <= 10 ? quantity : 10"
                        readonly/>

            <div class="text-center">
                <v-btn @click="refreshBool = !refreshBool" depressed class="mr-4">Refresh</v-btn>
                <v-btn @click="copyToken()" depressed>Copy uuid{{ quantity > 1 ? 's' : ''}}</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import {copyToClipboard, isInt} from "../../utils/helpers";

    const noop = () => {
    };

    const generateUuid = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

    export default {
        name: "UuidGenerator",
        data: () => ({
            refreshBool: true,
            quantity: 1,
            rules: {
                quantity: [
                    v => !!v || 'Quantity is required',
                    v => (v > 0 && v <= 50 ) || 'Quantity should be > 0 and <= 50',
                    v => isInt(v) || 'Quantity should be an integer'
                ]
            },
            isMounted:false
        }),
        mounted() {
            this.isMounted = true;
        },
        methods: {
            copyToken() {
                copyToClipboard(this.token);
                this.$toast.success('Copied to clipboard.')
            }
        },
        computed: {
            token() {
                if (this.isMounted && this.$refs.quantity.validate()) {
                    if (this.refreshBool) noop(); // To force recomputation

                    return Array.from({length: this.quantity}, generateUuid).join('\n');
                } else {
                    return '';
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .quantity {
        width: 100px;
        margin: auto;
        text-align: center;

        ::v-deep input {
            text-align: center;
        }
    }

    ::v-deep .centered-input textarea {
        text-align: center;
        margin-top: 13px !important;
        font-family: Consolas, monospace;
    }
</style>