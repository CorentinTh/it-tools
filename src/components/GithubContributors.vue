<template>
    <div class="github-contributor">

        <div v-if="loading" class="text-center pt-3 pb-3">
            <v-progress-circular indeterminate />
        </div>

        <v-list v-else class="pa-0">
            <v-list-item v-for="(contributor, i) in contributors" :key="i" :href="contributor.html_url">
                <v-list-item-avatar>
                    <v-img :src="contributor.avatar_url"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                    {{contributor.login}}
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
    const baseUrl = 'https://api.github.com/repos/$repo$/contributors'
    import axios from 'axios'

    export default {
        name: "GithubContributors",
        props: ['repo'],
        data: () => ({
            contributors: [],
            loading: true,
            hasError: false
        }),
        mounted() {
            const url = baseUrl.replace('$repo$', this.repo)

            axios
                .get(url)
                .then(({data}) => {
                    this.contributors = data.sort((a, b) => a.contributions - b.contributions)
                    this.loading = false
                })
                .catch(() => this.hasError = true)
        }
    }
</script>

<style scoped>

</style>