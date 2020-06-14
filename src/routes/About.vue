<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="12" xl="12">
                <v-card class="single-card">
                    <v-card-title>About</v-card-title>
                    <v-card-text>
                        <Abstract/>
                    </v-card-text>
                </v-card>
            </v-col>

        </v-row>
        <v-row justify="center">
            <v-col cols="12" md="5" sm="12">
                <v-card>
                    <v-card-title>Contributors</v-card-title>
                    <github-contributors repo="CorentinTh/it-tools"/>
                </v-card>
            </v-col>
            <v-col cols="12" md="7" sm="12">
                <v-card>
                    <v-card-title>Changelog</v-card-title>
                    <v-card-text>
                        <div v-html="changelog" class="changelog">
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
    import Abstract from "../components/Abstract";
    import GithubContributors from "../components/GithubContributors";
    import changelog from "../../CHANGELOG.md"
    import marked from 'marked'
    import DOMPurify from 'dompurify';

    export default {
        name: "About",
        data: () => ({
            changelog: []
        }),
        mounted() {
            this.changelog = DOMPurify.sanitize(marked('##' + changelog.replace(/^(.*?)##/s, '')));
        },
        components: {
            Abstract,
            GithubContributors
        },
    }
</script>

<style scoped lang="less">
    ::v-deep {
        .changelog {
            h2 {
                margin-top: 10px;
            }
        }
    }
</style>