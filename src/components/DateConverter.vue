<template>
    <v-row justify="center">
        <v-col lg="6" md="6" sm="12" >
            <v-card class="mb-5">
                <v-card-title>Input</v-card-title>
                <v-card-text>
                    <v-switch v-model="useCurrentDate" label="Use current date"/>
                </v-card-text>
            </v-card>
            <v-card class="mb-5">
                <v-card-title>Date</v-card-title>
                <v-card-text>
                    <v-text-field readonly outlined label="Date" :value="displayedDate.toDateString()"/>
                    <v-text-field readonly outlined label="Locale date" :value="displayedDate.toLocaleDateString()"/>
                </v-card-text>
            </v-card>
            <v-card class="mb-5">
                <v-card-title>Time</v-card-title>
                <v-card-text>
                    <v-text-field readonly outlined label="Time" :value="displayedDate.toTimeString()"/>
                    <v-text-field readonly outlined label="Locale time" :value="displayedDate.toLocaleTimeString()"/>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col lg="6" md="6" sm="12">
            <v-card >
                <v-card-title>DateTime</v-card-title>
                <v-card-text>

                    <v-text-field readonly outlined label="Locale datetime" :value="displayedDate.toLocaleString()"/>
                    <v-text-field readonly outlined label="ISO 8601" :value="displayedDate.toISOString()"/>
                    <v-text-field readonly outlined label="UTC format" :value="displayedDate.toUTCString()"/>
                    <v-text-field readonly outlined label="UNIX Timestamp (ms)" :value="displayedDate.getTime()"/>
                    <v-text-field readonly outlined label="Complete" :value="displayedDate.toString()"/>

                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: "DateConverter",
        created() {
            setInterval(this.refreshCurrentDate.bind(this), 1000);
        },
        data() {
            return {
                useCurrentDate: true,
                displayedDate: new Date(),
                formats: ['locale'],
                refreshCurrentDate() {
                    if (this.useCurrentDate) {
                        this.displayedDate = new Date();
                    }
                }
            }
        }
    }
</script>

<style scoped lang="less">
</style>