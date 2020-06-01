<template>
    <v-autocomplete
            label="Search..."
            single-line
            append-icon="fa-search"
            color="white"
            hide-details
            :items="items"
            item-text="text"
            item-value="path"
            solo-inverted
            @change="choose"
            :filter="filter"
            clearable
            cache-items
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
    import {toolsComponentsFlat} from '../router'

    console.log(toolsComponentsFlat);
    export default {
        name: "SearchBar",
        data() {
            const vm = this;
            return {
                items: toolsComponentsFlat,
                choose(path) {
                    vm.$router.push(path).catch(() => {
                    })
                }
            }
        },
        methods: {
            filter(item, queryText, itemText) {
                const query = queryText.trim().toLowerCase();
                const nameContainsText = itemText.toLowerCase().includes(query);
                const keywordContainsText = item.keywords ? item.keywords.some(keyword => keyword.toLowerCase().includes(query)) : false;
                return nameContainsText || keywordContainsText;
            }
        }
    }
</script>

<style scoped lang="less">
    ::v-deep .v-list-item__mask{
        color: inherit !important;
        background: inherit !important;
    }

</style>