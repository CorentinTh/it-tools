<template>
    <v-text-field v-model="color" hide-details class="ma-0 pa-0" outlined :label="label" v-on:input="$emit('input', color)">
        <template v-slot:append>
            <v-menu v-model="menu" top nudge-bottom="101" nudge-left="16" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                    <div :style="swatchStyle" v-on="on" />
                </template>
                <v-card>
                    <v-card-text class="pa-0">
                        <v-color-picker v-model="color" flat v-on:input="$emit('input', color)"/>
                    </v-card-text>
                </v-card>
            </v-menu>
        </template>
    </v-text-field>
</template>

<script>
    // From: https://codepen.io/JamieCurnow/pen/KKPjraK

    export default {
        name: "ColorInput",
        props:{
            value: {
                type: String,
                default: '#FFFFFF'
            },
            label:String
        },
        data: () => ({
            menu: false,
            color:''
        }),
        mounted() {
            this.color = this.value
        },
        computed: {
            swatchStyle() {
                const { color, menu } = this
                return {
                    backgroundColor: color,
                    cursor: 'pointer',
                    height: '30px',
                    width: '30px',
                    borderRadius: menu ? '50%' : '4px',
                    transition: 'border-radius 200ms ease-in-out'
                }
            }
        }
    }
</script>

<style scoped lang="less">
    ::v-deep .v-input__append-inner{
        margin-top: 13px;
    }

</style>