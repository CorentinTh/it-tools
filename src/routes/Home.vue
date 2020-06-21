<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="12" lg="5" md="12">
                <v-card>
                    <v-card-title>IT-Tools</v-card-title>
                    <v-card-text class="description">
                        <Abstract />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="5" md="12">
                <v-card class="card-auto">
                    <v-card-text>
                        <div class="card-wrapper ">
                            <div v-for="item in items" :key="item.text" class="pa-2">
                                <v-card class="card-element" color="primary" :to="item.path">
                                    <v-card-text>
                                        <v-icon>{{ item.icon }}</v-icon>
                                        <div class="item-title">{{item.text}}</div>
                                    </v-card-text>
                                </v-card>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import {toolsComponentsFlat} from "../router";
    import Abstract from "../components/Abstract";

    export default {
        name: 'Home',
        components : {
            Abstract
        },
        data: () => ({
            items: toolsComponentsFlat
        })
    }
</script>

<style lang="less" scoped>
    .card-auto {
        width: auto;
    }

    .card-wrapper {
        display: flex;
        flex-wrap: wrap;

        div {
            flex: 0 1 33%;

            @media only screen and (max-width: 800px) {
                flex: 0 1 33%;
            }
            @media only screen and (max-width: 620px) {
                flex: 0 1 50%;
            }
            @media only screen and (max-width: 420px) {
                flex: 0 1 220px;
                margin: auto;
            }
            @media only screen and (max-width: 300px) {
                flex: 0 1 100%;
            }

            .card-element {
                width: 100%;
                border-radius: 24px 4px !important;
                color: #ffffff !important;
                font-weight: bold !important;
                text-align: center;
                transition: 0.2s ease;
                position: relative;
                top: 0;

                &:hover {
                    position: relative;
                    top: -5px;
                    opacity: 0.9;
                }

                .v-card__text {
                    padding: 16px 10px;
                }

                .v-icon {
                    font-size: 40px;
                    color: #ffffff;
                    margin: 10px 0;
                    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

                }

                .item-title {
                    overflow-wrap: anywhere;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 16px;
                    line-height: 22px;
                    height: 44px;
                    opacity: 1;
                    color: #ffffff;
                    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
                }
            }
        }
    }
</style>
