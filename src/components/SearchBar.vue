<template>
    <v-autocomplete
            label="Search..."
            single-line
            append-icon="fa-search"
            color="white"
            hide-details
            :items="items"
            item-text="component.name"
            item-value="path"
            solo-inverted
            @change="choose"
    >
        <template v-slot:no-data>
            <v-list-item>
                <v-list-item-title>
                    Search for the <strong>tool</strong> you need!
                </v-list-item-title>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script>

    import {toolsRoutes} from '../router'

    export default {
        name: "SearchBar",
        data(){
            const vm = this;
            return {
                items:toolsRoutes,
                choose(path){
                    vm.$router.push(path)
                }
            }
        },
    }
</script>

<style scoped>

</style>