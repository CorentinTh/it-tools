<template>
    <div>
        <h2>Hello, World!</h2>
        <p class="text-justify">
            Welcome to <strong>IT-Tools</strong>! This wonderful website, originally created with ❤ by
            <a href="//corentin-thomasset.fr">Corentin Thomasset</a>, aggregate a set of useful tools
            that every developer may need once in a while.
        </p>


        <v-row>
            <v-col cols="12" lg="6" md="12">
                <h2>A tool is missing?</h2>
                <p class="text-justify">
                    If you need a tool that is not currently not present here, and you think can be
                    relevant, you are welcome to submit a feature request <a
                        href="//github.com/CorentinTh/it-tools/issues/new?assignees=CorentinTh&labels=enhancement&template=feature_request.md&title=%5BFEAT%5D%20My%20feature">here</a>.
                </p>
            </v-col>
            <v-col cols="12" lg="6" md="12">
                <h2>Found a bug?</h2>
                <p class="text-justify">
                    If you found a bug, or something broken that doesn't work as expected, please fill a bug report here <a
                        href="//github.com/CorentinTh/it-tools/issues/new?assignees=CorentinTh&labels=bug&template=bug_report.md&title=%5BBUG%5D%20My%20bug">here</a>.
                </p>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "Abstract"
    }
</script>

<style scoped lang="less">
    a {
        border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
        text-decoration: none;
        color: inherit !important;

        &:hover {
            color: #4CAF50 !important;
            border-bottom: 1px solid;
        }
    }
</style>