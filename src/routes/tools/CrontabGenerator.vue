<template>
    <v-row justify="center" align="center">
        <v-col cols="12" xl="5" lg="5" md="12">
            <v-card>
                <v-card-title>Crontab generator</v-card-title>
                <v-card-text>
                    <div class="result">{{cronString}}</div>
                    <v-text-field
                            ref="cron"
                            class="cron-wrapper"
                            outlined
                            v-model="cron"
                            label="Cron"
                            append-icon="fa-copy"
                            @click:append="copy(cron)"
                            :rules="[isCronValid]"
                            hide-details="auto"
                    />

                    <v-checkbox
                            hide-details
                            label="Verbose"
                            v-model="cronstrueConfig.verbose"
                    />
                    <v-checkbox
                            hide-details
                            label="Use 24 hour time format"
                            v-model="cronstrueConfig.use24HourTimeFormat"
                    />
                    <v-checkbox
                            hide-details
                            label="Day of the week start a index 0"
                            v-model="cronstrueConfig.dayOfWeekStartIndexZero"
                    />
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" xl="6" lg="7" md="12">
            <v-card>
                <v-card-title>Crontab helper</v-card-title>
                <v-card-text>
                    <div class="text-center">
                        <pre>
┌────────── day of week (0 - 6, sunday=0) OR sun,mon ...
| ┌──────── month (1 - 12) OR jan,feb,mar,apr ...
| | ┌────── day of month (1 - 31)
| | | ┌──── hour (0 - 23)
| | | | ┌── minute (0 - 59)
| | | | |
* * * * * command
                        </pre>
                    </div>
                    <br>
                    <v-simple-table dense>
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th class="text-left">Symbol</th>
                                <th class="text-left">Meaning</th>
                                <th class="text-left">Example</th>
                                <th class="text-left">Equivalent</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>*</td>
                                <td>Any value</td>
                                <td>
                                    <pre>* * * *</pre>
                                </td>
                                <td>Every minute</td>
                            </tr>
                            <tr>
                                <td>-</td>
                                <td>Range of values</td>
                                <td>
                                    <pre>1-10 * * *</pre>
                                </td>
                                <td>Minutes 1 through 10</td>
                            </tr>
                            <tr>
                                <td>,</td>
                                <td>List of values</td>
                                <td>
                                    <pre>1,10 * * *</pre>
                                </td>
                                <td>At minutes 1 and 10</td>
                            </tr>
                            <tr>
                                <td>/</td>
                                <td>Step values</td>
                                <td>
                                    <pre>*/10 * * *</pre>
                                </td>
                                <td>Every 10 minutes</td>
                            </tr>
                            <tr>
                                <td>@yearly</td>
                                <td>Once every year at midnight of 1 January</td>
                                <td>
                                    <pre>@yearly</pre>
                                </td>
                                <td>0 0 1 1 *</td>
                            </tr>
                            <tr>
                                <td>@annually</td>
                                <td>Same as @yearly</td>
                                <td>
                                    <pre>@annually</pre>
                                </td>
                                <td>0 0 1 1 *</td>
                            </tr>
                            <tr>
                                <td>@monthly</td>
                                <td>Once a month at midnight on the first day</td>
                                <td>
                                    <pre>@monthly</pre>
                                </td>
                                <td>0 0 1 * *</td>
                            </tr>
                            <tr>
                                <td>@weekly</td>
                                <td>Once a week at midnight on Sunday morning</td>
                                <td>
                                    <pre>@weekly</pre>
                                </td>
                                <td>0 0 * * 0</td>
                            </tr>
                            <tr>
                                <td>@daily</td>
                                <td>Once a day at midnight</td>
                                <td>
                                    <pre>@daily</pre>
                                </td>
                                <td>0 0 * * *</td>
                            </tr>
                            <tr>
                                <td>@midnight</td>
                                <td>Same as @daily</td>
                                <td>
                                    <pre>@midnight</pre>
                                </td>
                                <td>0 0 * * *</td>
                            </tr>
                            <tr>
                                <td>@hourly</td>
                                <td>Once an hour at the beginning of the hour</td>
                                <td>
                                    <pre>@hourly</pre>
                                </td>
                                <td>0 * * * *</td>
                            </tr>
                            <tr>
                                <td>@reboot</td>
                                <td>Run at startup</td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import {copyable} from "../../mixins/copyable.mixin";
    import cronstrue from 'cronstrue';
    import * as CronValidator from 'cron-validator'

    export default {
        name: "CrontabGenerator",
        mixins: [copyable],
        data: () => ({
            cron: '* * * * *',
            cronstrueConfig: {
                verbose: true,
                dayOfWeekStartIndexZero: true,
                use24HourTimeFormat: true,
                throwExceptionOnParseError: true
            }
        }),
        methods: {
            isCronValid(v) {
                return CronValidator.isValidCron(v, {allowBlankDay: true, alias: true});
            }
        },
        computed: {
            cronString() {
                if (this.isCronValid(this.cron)) {
                    return cronstrue.toString(this.cron, this.cronstrueConfig)
                } else {
                    return ' '
                }
            }
        }
    }
</script>

<style scoped lang="less">
    ::v-deep .cron-wrapper input {
        text-align: center;
        font-size: 22px;
        font-family: Consolas, monospace;
    }

    .result {
        text-align: center;
        font-size: 18px;
        margin-bottom: 22px;
    }

    .text-center{
        pre{
            display: inline-block;
            text-align: left;
        }
    }
</style>