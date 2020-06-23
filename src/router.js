import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './routes/Home.vue'

Vue.use(VueRouter)

const toolsComponents = [
    {
        title: 'Crypto',
        child: [
            {
                icon: 'fa-key',
                text: 'Token generator',
                path: '/token-generator',
                component: () => import('./routes/tools/TokenGenerator'),
                keywords: ['token', 'random', 'string', 'alphanumeric'],
                description: 'Generate random tokens.'
            },
            {
                icon: 'fa-fingerprint',
                text: 'Uuid generator',
                path: '/uuid-generator',
                component: () => import('./routes/tools/UuidGenerator'),
                keywords: ['token', 'v4', 'string', 'alphanumeric']
            },
            {
                icon: 'fa-font',
                text: 'Hash text',
                path: '/hash',
                component: () => import('./routes/tools/Hash'),
                keywords: ['md5', 'sha1', 'sha256', 'sha224', 'sha512', 'sha384', 'sha3', 'ripemd160', 'random']

            },
            {
                icon: 'fa-lock',
                text: 'Cypher/uncypher text',
                path: '/cypher',
                component: () => import('./routes/tools/TextCypher'),
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
                component: () => import('./routes/tools/DateConverter'),
                keywords: ['locale', 'format', 'iso 8601', 'utc', 'timestamp', 'unix', 'year', 'month', 'day', 'hours', 'minutes', 'seconds']
            },
            {
                icon: 'fa-exchange-alt',
                text: 'Base converter',
                path: '/base-converter',
                component: () => import('./routes/tools/BaseConverter'),
                keywords: ['binary', 'hexadecimal', 'decimal']
            },
            {
                icon: 'fa-palette',
                text: 'Color picker/converter',
                path: '/color-picker-converter',
                component: () => import('./routes/tools/ColorConverter'),
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
                component: () => import('./routes/tools/UrlEncoder'),
                keywords: ['%20']
            },
            {
                icon: 'fa-file-export',
                text: 'File to Base64',
                path: '/file-to-base64',
                component: () => import('./routes/tools/FileToBase64')
            },
        ],
    },
    {
        title: 'Text',
        child: [
            {
                icon: 'fa-align-left',
                text: 'Text stats',
                path: '/text-stats',
                component: () => import('./routes/tools/TextStats'),
                keywords: ['word', 'count', 'size', 'bytes', 'length']
            },
            {
                icon: 'fab fa-markdown',
                text: 'Markdown editor',
                path: '/markdown-editor',
                component: () => import('./routes/tools/MarkdownEditor'),
                keywords: ['text', 'html', 'markdown']
            },
            {
                icon: 'fa-align-justify',
                text: 'Lorem ipsum generator',
                path: '/lorem-ipsum-generator',
                component: () => import('./routes/tools/LoremIpsumGenerator'),
                keywords: ['text', 'dolor', 'sit', 'placeholder', 'fill', 'dummy']
            }
        ],
    },
    {
        title: 'Memos',
        child: [
            {
                text: 'Git memo',
                path: '/git-memo',
                icon: 'fa-code-branch',
                component: () => import('./routes/tools/GitMemo'),
                keywords: ['git', 'push', 'rebase', 'merge', 'tag', 'commit', 'checkout']
            }
        ]
    },
    {
        title: 'Miscellaneous',
        child: [
            {
                text: 'QR Code generator',
                path: '/qrcode-generator',
                icon: 'fa-qrcode',
                component: () => import('./routes/tools/QRCodeGenerator'),
                keywords: []
            }
        ]
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
    mode: 'history',
    routes
});

export default router;
export {
    routes,
    toolsComponents,
    toolsComponentsFlat
};
