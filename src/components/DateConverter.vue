<template>
    <v-row justify="center" align="center">
        <v-col xl="4" lg="6" md="12">
            <v-card class="mb-5">
                <v-card-title>Input</v-card-title>
                <v-card-text>
                    <div class="text-center">
                        <v-switch v-model="useCurrentDate" label="Use current date"/>
                    </div>

                    <v-divider></v-divider>
                    <br>

                    <v-row>
                        <v-col md="6" sm="12" class="pt-0 pb-0">
                            <v-select
                                    :items="formats.filter(f => !f.title.toLowerCase().includes('locale'))"
                                    item-value="dateFromFormat"
                                    item-text="title"
                                    outlined
                                    label="Your date format"
                                    placeholder="Input format"
                                    v-model="inputFormater"
                                    @input="userInputChanged()"
                            />
                        </v-col>
                        <v-col md="6" sm="12" class="pt-0 pb-0">
                            <v-text-field
                                    outlined
                                    v-model="inputString"
                                    label="Your date string"
                                    @input="userInputChanged()"
                                    :error="invalidInput"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col xl="4" lg="6" md="12" >
            <v-card>
                <v-card-title>Dates formats</v-card-title>
                <v-card-text>

                    <v-text-field
                            dense
                            readonly
                            outlined
                            v-for="format of formats"
                            v-bind:key="format.title"
                            :label="format.title"
                            :value="format.getDate()"
                            append-icon="fa-clipboard"
                            @click:append="copyDate(format.getDate())"
                    />

                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import {copyToClipboard} from "../utils/helpers";

    export default {
        name: "DateConverter",
        created() {
            setInterval(this.refreshCurrentDate.bind(this), 1000);
            this.inputFormater = this.formats[1].dateFromFormat;
        },
        data() {
            const vm = this;

            return {
                inputString: '',
                inputFormater: undefined,
                useCurrentDate: true,
                displayedDate: new Date(),
                invalidInput: false,
                formats: [
                    {
                        title: 'Locale datetime',
                        getDate() {
                            return vm.displayedDate.toLocaleString();
                        },
                        dateFromFormat(dateString){
                            return dateString
                        }
                    },
                    {
                        title: 'ISO 8601',
                        getDate() {
                            return vm.displayedDate.toISOString();
                        },
                        dateFromFormat(dateString){
                            return new Date(dateString)
                        }
                    },
                    {
                        title: 'UTC format',
                        getDate() {
                            return vm.displayedDate.toUTCString();
                        },
                        dateFromFormat(dateString){
                            return new Date(dateString)
                        }
                    },
                    {
                        title: 'UNIX Timestamp (ms)',
                        getDate() {
                            return vm.displayedDate.getTime();
                        },
                        dateFromFormat(dateString){
                            return new Date(parseInt(dateString))
                        }
                    },
                    {
                        title: 'Complete',
                        getDate() {
                            return vm.displayedDate.toString();
                        },
                        dateFromFormat(dateString){
                            return new Date(dateString)
                        }
                    }
                ],
                refreshCurrentDate() {
                    if (this.useCurrentDate) {
                        this.displayedDate = new Date();
                    }
                },
                copyDate(date) {
                    copyToClipboard(date);
                    this.$toast.success('Copied to clipboard.')
                },
                userInputChanged(){
                    try{
                        this.invalidInput = false;
                        const newDate = this.inputFormater(this.inputString);

                        if(newDate && !isNaN(newDate.getTime())){
                            this.useCurrentDate = false;
                            this.displayedDate = newDate;
                        }else if(this.inputString.length > 0) {
                            this.invalidInput = true;
                        }
                    } catch (ignored) {
                        //
                    }
                }
            }
        }
    }
</script>

<style scoped lang="less">
</style>