<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app clipped>
            <v-list dense>

                <div v-for="section in items" :key="section.title">
                    <v-subheader class="mt-4 pl-4">{{section.title}}</v-subheader>

                    <v-list-item v-for="item in section.child" :key="item.text" :to="item.link">
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>

            </v-list>

            <template v-slot:append>
                <v-divider></v-divider>

                <div class="pa-5">
                    <div>
                        IT-Tools <a v-bind:href="'https://github.com/CorentinTh/it-tools/tree/'+appVersion"
                                    target="_blank">{{appVersion}}</a>

                    </div>
                    <div>&copy; {{new Date().getFullYear()}} <a href="//corentin-thomasset.fr" class="footer-link">Corentin
                        Thomasset</a></div>

                </div>


            </template>
        </v-navigation-drawer>

        <v-app-bar app clipped-left color="green">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title class="mr-12 align-center">
                <router-link to="/" class="title">IT Tools</router-link>
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-row
                    align="center"
                    style="max-width: 650px"
            >
                <SearchBar />
            </v-row>
            <v-spacer></v-spacer>

            <div class="right-links">
                <router-link to="/about">About</router-link>

                <a href="https://github.com/CorentinTh/it-tools" target="_blank" class="navbar-link">
                    <v-icon>fa-github</v-icon>
                </a>
            </div>
        </v-app-bar>

        <v-content>
            <v-row class="fill-height pa-4" justify="center" align="center" no-gutters>
                <router-view></router-view>
            </v-row>
        </v-content>

        <!--        <v-footer app>-->
        <!--            <span>&copy; {{new Date().getFullYear()}} <a href="//corentin-thomasset.fr" class="footer-link">Corentin Thomasset</a></span>-->
        <!--            <span>A bug ? A feature request ? Stuff happens <a href="https://github.com/CorentinTh/it-tools/issues"-->
        <!--                                                               target="_blank" class="footer-link">here</a>.</span>-->
        <!--        </v-footer>-->
    </v-app>
</template>

<script>
    import SearchBar from "./components/SearchBar";

    export default {
        props: {
            source: String,
        },
        components: {SearchBar},
        data: () => ({
            appVersion: 'v' + process.env.APPLICATION_VERSION,
            drawer: null,
            items: [
                {
                    title: 'Crypto',
                    child: [
                        {icon: 'fa-key', text: 'Token generator', link: '/token-generator'},
                        {icon: 'fa-font', text: 'Hash text', link: '/hash'},
                    ],
                },
                {
                    title: 'Converter',
                    child: [
                        {icon: 'fa-calendar', text: 'Date/Time converter', link: '/date-converter'},
                    ],
                },
                {
                    title: 'Web',
                    child: [
                        {icon: 'fa-link', text: 'URL encode/decode', link: '/url-encoder'},
                        {icon: 'fa-file-image-o', text: 'File to Base64', link: '/file-to-base64'},
                    ],
                }
            ],
        }),
        created() {
            this.$vuetify.theme.dark = true
        },
    }
</script>

<style lang="less">
    html {
        overflow-y: auto !important;
    }

    .single-card {
        width: 100%;
        max-width: 700px !important;
    }

    .v-card__title {
        justify-content: center;
        font-size: 30px !important;
        line-height: 30px !important;
        padding: 30px 0 !important;
        font-weight: 300 !important;
    }

    /*    footer {*/
    /*        display: flex;*/
    /*        flex-direction: row;*/
    /*        justify-content: space-between;*/
    /*        color: rgba(255, 255, 255, 0.52) !important;*/

    /*        .footer-link {*/
    /*            text-decoration: none;*/
    /*            color: rgba(255, 255, 255, 0.52) !important;*/
    /*            border-bottom: 1px dashed;*/

    /*            &:hover {*/
    /*                color: #4CAF50 !important;*/
    /*                border-bottom: 1px solid;*/
    /*            }*/
    /*        }*/
    /*    }*/

    .title {
        text-decoration: none;
        color: #fff !important;

        &:hover {
            border-bottom: 1px dashed;
        }
    }

    .right-links {
        align-items: center;
        display: flex;

        a:not(:last-child) {
            margin-right: 20px;
            text-decoration: none;
            color: #fff;

            &:hover {
                border-bottom: 1px dashed;
            }
        }


        .navbar-link {
            text-decoration: none;

            .v-icon {
                font-size: 37px !important;

                &:hover {
                    color: #363636;
                }
            }
        }
    }

    .v-navigation-drawer__append {
        text-align: center;
        color: rgba(255, 255, 255, 0.52) !important;

        a {
            border-bottom: 1px dashed;
            text-decoration: none;
            color: rgba(255, 255, 255, 0.52) !important;

            &:hover {
                color: #4CAF50 !important;
                border-bottom: 1px solid;
            }
        }

    }
</style>