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
import BaseConverter from "./routes/tools/BaseConverter";
import UuidGenerator from "./routes/tools/UuidGenerator";
import ColorConverter from "./routes/tools/ColorConverter";

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
                keywords: ['token', 'random', 'string', 'alphanumeric'],
                description: 'Generate random tokens.'
            },
            {
                icon: 'fa-fingerprint',
                text: 'Uuid generator',
                path: '/uuid-generator',
                component: UuidGenerator,
                keywords: ['token', 'v4', 'string', 'alphanumeric']
            },
            {
                icon: 'fa-font',
                text: 'Hash text',
                path: '/hash',
                component: Hash,
                keywords: ['md5', 'sha1', 'sha256', 'sha224', 'sha512', 'sha384', 'sha3', 'ripemd160', 'random']

            },
            {
                icon: 'fa-lock',
                text: 'Cypher/uncypher text',
                path: '/cypher',
                component: TextCypher,
                keywords: ['aes', 'tripledes', 'rabbit', 'rabbitlegacy', 'rc4']
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
                component: DateConverter,
                keywords: ['locale', 'format', 'iso 8601', 'utc', 'timestamp', 'unix', 'year', 'month', 'day', 'hours', 'minutes', 'seconds']
            },
            {
                icon: 'fa-exchange-alt',
                text: 'Base converter',
                path: '/base-converter',
                component: BaseConverter,
                keywords: ['binary', 'hexadecimal', 'decimal']
            },
            {
                icon: 'fa-palette',
                text: 'Color picker/converter',
                path: '/color-picker-converter',
                component: ColorConverter,
                keywords: ['rgb', 'rgba', 'hexadecimal', 'hsla', 'red', 'green', 'blue', 'alpha']
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
                component: UrlEncoder,
                keywords: ['%20']
            },
            {
                icon: 'fa-file-export',
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
                icon: 'fa-align-left\n',
                text: 'Text stats',
                path: '/text-stats',
                component: TextStats,
                keywords: ['word', 'count', 'size', 'bytes', 'length']
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
    },
    {
        path: '*',
        name: '404',
        component: () => import('./routes/NotFound.vue')
    }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
});

export default router;
export {
    routes,
    toolsComponents,
    toolsComponentsFlat
};
