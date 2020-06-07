<template>
    <v-card class="single-card">
        <v-card-title>Text stats</v-card-title>
        <v-card-text>
            <v-textarea
                    outlined
                    v-model="inputText"
                    label="Input text"
            />

            <table>
                <tr>
                    <td><strong>Character count:</strong></td>
                    <td>{{ inputText.length }}</td>
                </tr>
                <tr>
                    <td><strong>Character count (without spaces):</strong></td>
                    <td>{{ inputText.split(' ').join('').length }}</td>
                </tr>
                <tr>
                    <td><strong>Word count:</strong></td>
                    <td>{{ inputText.length > 0 ? inputText.trim().split(/\s+/).length : 0 }}</td>
                </tr>
                <tr>
                    <td><strong>Line count:</strong></td>
                    <td>{{ inputText.length > 0 ? inputText.split(/\r\n|\r|\n/).length : 0 }}</td>
                </tr>
                <tr>
                    <td><strong>Byte size:</strong></td>
                    <td>{{ formatBytes(bytesSize) }} <span v-if="bytesSize >= 1024">({{bytesSize}} Bytes)</span></td>
                </tr>
            </table>
        </v-card-text>
    </v-card>
</template>

<script>
    import {formatBytes} from "../../utils/helpers";

    export default {
        name: "TextStats",
        data() {
            return {
                Blob: Blob,
                formatBytes,
                inputText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            }
        },
        computed: {
            bytesSize() {
                return new Blob([this.inputText]).size
            }
        }
    }
</script>

<style scoped lang="less">
    table {
        width: 100%;

        tr {
            td {
                width: 50%;
                padding: 5px;

                &:first-child {
                    text-align: right;
                }
            }
        }
    }
</style>