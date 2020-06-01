<template>
    <v-card class="single-card">
        <v-card-title>Uuid v4 generator</v-card-title>

        <v-card-text>
            <v-text-field outlined v-model="token" class="centered-input"/>

            <div class="text-center">
                <v-btn @click="refreshBool = !refreshBool" depressed class="mr-4">Refresh</v-btn>
                <v-btn @click="copyToken()" depressed>Copy token</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import {copyToClipboard} from "../../utils/helpers";

    const noop = () => {
    };

    export default {
        name: "UuidGenerator",
        data: () => ({
            refreshBool: true
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

                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
            }
        }
    }
</script>

<style scoped>
    ::v-deep .centered-input input {
        text-align: center
    }
</style>