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
        <v-row justify="center" >
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
                        <div v-for="(section, i) in changelog" :key="i">
                            <h2>{{section.title}}</h2>
                            <ul>
                                <li v-for="(log, i) in section.logs" :key="i"> {{log}}</li>
                            </ul>
                            <br>
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

    export default {
        name: "About",
        data: () => ({
            changelog: []
        }),
        mounted() {

            this.changelog = ('##' + changelog.replace(/^(.*?)##/s, ''))
                .split('\n')
                .filter(v => v !== '')
                .reduce((sections, v) => {
                    v = v.trim();
                    if(v.startsWith('##')){
                        sections.push({
                            title: v.replace(/^##/, '').trim(),
                            logs: []
                        })
                    }else {
                        sections.slice(-1)[0].logs.push(v.replace(/^-/, '').trim())
                    }

                    return sections
                }, []);
            console.log(this.changelog);
        },
        components: {
            Abstract,
            GithubContributors
        },
    }
</script>