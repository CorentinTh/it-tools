import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './routes/Home.vue'
import TokenGenerator from "./routes/tools/TokenGenerator";
import Hash from "./routes/tools/Hash";
import DateConverter from "./routes/tools/DateConverter";
import UrlEncoder from "./routes/tools/UrlEncoder";
import FileToBase64 from "./routes/tools/FileToBase64";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/token-generator',
        component: TokenGenerator
    },
    {
        path: '/hash',
        component: Hash
    },
    {
        path: '/date-converter',
        component: DateConverter
    },
    {
        path: '/url-encoder',
        component: UrlEncoder
    },
    {
        path: '/file-to-base64',
        component: FileToBase64
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('./routes/About.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
