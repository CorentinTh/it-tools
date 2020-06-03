<template>
    <v-card class="single-card">
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
</template>

<script>
    import {toolsComponentsFlat} from "../router";

    export default {
        name: 'Home',
        data: () => ({
            items: toolsComponentsFlat
        })
    }
</script>

<style lang="less" scoped>
    .card-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        div {
            flex: 1 1 33%;

            @media only screen and (max-width: 620px) {
                flex: 0 1 50%;
            }
            @media only screen and (max-width: 450px) {
                flex: 0 1 220px;
            }
            @media only screen and (max-width: 300px) {
                flex: 0 1 100%;
            }

            .card-element {
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

                .v-icon {
                    font-size: 50px;
                    color: #ffffff;
                    margin: 15px 0;
                    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

                }

                .item-title {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 18px;
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
