import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './routes/Home.vue'
import TokenGenerator from "./routes/tools/TokenGenerator";
import Hash from "./routes/tools/Hash";
import DateConverter from "./routes/tools/DateConverter";
import UrlEncoder from "./routes/tools/UrlEncoder";
import FileToBase64 from "./routes/tools/FileToBase64";
import TextCypher from "./routes/tools/TextCypher";
import TextStats from "./routes/tools/TextStats";

Vue.use(VueRouter)


const toolsComponents = [
    {
        title: 'Crypto',
        child: [
            {
                icon: 'fa-key',
                text: 'Token generator',
                path: '/token-generator',
                component: TokenGenerator,
                keywords: ['md5']
            },
            {
                icon: 'fa-font',
                text: 'Hash text',
                path: '/hash',
                component: Hash
            },
            {
                icon: 'fa-lock',
                text: 'Cypher/uncypher text',
                path: '/cypher',
                component: TextCypher
            },
        ],
    },
    {
        title: 'Converter',
        child: [
            {
                icon: 'fa-calendar',
                text: 'Date/Time converter',
                path: '/date-converter',
                component: DateConverter
            },
        ],
    },
    {
        title: 'Web',
        child: [
            {
                icon: 'fa-link',
                text: 'URL encode/decode',
                path: '/url-encoder',
                component: UrlEncoder
            },
            {
                icon: 'fa-file-image-o',
                text: 'File to Base64',
                path: '/file-to-base64',
                component: FileToBase64
            },
        ],
    },
    {
        title: 'Miscellaneous',
        child: [
            {
                icon: 'fa-file-text',
                text: 'Text stats',
                path: '/text-stats',
                component: TextStats
            },
        ],
    }
];

const toolsComponentsFlat = toolsComponents.reduce((acc, section) => [...acc, ...section.child], [])

const routes = [
    ...toolsComponentsFlat,
    {
        path: '/',
        component: Home
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
});

export default router;
export {
    routes,
    toolsComponents,
    toolsComponentsFlat
};
