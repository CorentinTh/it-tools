import { translate as t } from '@/plugins/i18n.plugin';

export const codesByCategories: {
  category: string
  codes: {
    code: number
    name: string
    description: string
    type: 'HTTP' | 'WebDav'
  }[]
}[] = [
  {
    category: t('tools.http-status-codes.1xx'),
    codes: [
      {
        code: 100,
        name: t('tools.http-status-codes.100.name'),
        description: t('tools.http-status-codes.100.description'),
        type: 'HTTP',
      },
      {
        code: 101,
        name: t('tools.http-status-codes.101.name'),
        description: t('tools.http-status-codes.101.description'),
        type: 'HTTP',
      },
      {
        code: 102,
        name: t('tools.http-status-codes.102.name'),
        description: t('tools.http-status-codes.102.description'),
        type: 'WebDav',
      },
      {
        code: 103,
        name: t('tools.http-status-codes.103.name'),
        description: t('tools.http-status-codes.103.description'),
        type: 'HTTP',
      },
    ],
  },
  {
    category: t('tools.http-status-codes.2xx'),
    codes: [
      {
        code: 200,
        name: t('tools.http-status-codes.200.name'),
        description: t('tools.http-status-codes.200.description'),
        type: 'HTTP',
      },
      {
        code: 201,
        name: t('tools.http-status-codes.201.name'),
        description: t('tools.http-status-codes.201.description'),
        type: 'HTTP',
      },
      {
        code: 202,
        name: t('tools.http-status-codes.202.name'),
        description: t('tools.http-status-codes.202.description'),
        type: 'HTTP',
      },
      {
        code: 203,
        name: t('tools.http-status-codes.203.name'),
        description: t('tools.http-status-codes.203.description'),
        type: 'HTTP',
      },
      {
        code: 204,
        name: t('tools.http-status-codes.204.name'),
        description: t('tools.http-status-codes.204.description'),
        type: 'HTTP',
      },
      {
        code: 205,
        name: t('tools.http-status-codes.205.name'),
        description: t('tools.http-status-codes.205.description'),
        type: 'HTTP',
      },
      {
        code: 206,
        name: t('tools.http-status-codes.206.name'),
        description: t('tools.http-status-codes.206.description'),
        type: 'HTTP',
      },
      {
        code: 207,
        name: t('tools.http-status-codes.207.name'),
        description: t('tools.http-status-codes.207.description'),
        type: 'WebDav',
      },
      {
        code: 208,
        name: t('tools.http-status-codes.208.name'),
        description: t('tools.http-status-codes.208.description'),
        type: 'WebDav',
      },
      {
        code: 226,
        name: t('tools.http-status-codes.226.name'),
        description: t('tools.http-status-codes.226.description'),
        type: 'HTTP',
      },
    ],
  },
  {
    category: t('tools.http-status-codes.3xx'),
    codes: [
      {
        code: 300,
        name: t('tools.http-status-codes.300.name'),
        description: t('tools.http-status-codes.300.description'),
        type: 'HTTP',
      },
      {
        code: 301,
        name: t('tools.http-status-codes.301.name'),
        description: t('tools.http-status-codes.301.description'),
        type: 'HTTP',
      },
      {
        code: 302,
        name: t('tools.http-status-codes.302.name'),
        description: t('tools.http-status-codes.302.description'),
        type: 'HTTP',
      },
      {
        code: 303,
        name: t('tools.http-status-codes.303.name'),
        description: t('tools.http-status-codes.303.description'),
        type: 'HTTP',
      },
      {
        code: 304,
        name: t('tools.http-status-codes.304.name'),
        description: t('tools.http-status-codes.304.description'),
        type: 'HTTP',
      },
      {
        code: 305,
        name: t('tools.http-status-codes.305.name'),
        description: t('tools.http-status-codes.305.description'),
        type: 'HTTP',
      },
      {
        code: 306,
        name: t('tools.http-status-codes.306.name'),
        description: t('tools.http-status-codes.306.description'),
        type: 'HTTP',
      },
      {
        code: 307,
        name: t('tools.http-status-codes.307.name'),
        description: t('tools.http-status-codes.307.description'),
        type: 'HTTP',
      },
      {
        code: 308,
        name: t('tools.http-status-codes.308.name'),
        description: t('tools.http-status-codes.308.description'),
        type: 'HTTP',
      },
    ],
  },
  {
    category: t('tools.http-status-codes.4xx'),
    codes: [
      {
        code: 400,
        name: t('tools.http-status-codes.400.name'),
        description: t('tools.http-status-codes.400.description'),
        type: 'HTTP',
      },
      {
        code: 401,
        name: t('tools.http-status-codes.401.name'),
        description: t('tools.http-status-codes.401.description'),
        type: 'HTTP',
      },
      {
        code: 402,
        name: t('tools.http-status-codes.402.name'),
        description: t('tools.http-status-codes.402.description'),
        type: 'HTTP',
      },
      {
        code: 403,
        name: t('tools.http-status-codes.403.name'),
        description: t('tools.http-status-codes.403.description'),
        type: 'HTTP',
      },
      {
        code: 404,
        name: t('tools.http-status-codes.404.name'),
        description: t('tools.http-status-codes.404.description'),
        type: 'HTTP',
      },
      {
        code: 405,
        name: t('tools.http-status-codes.405.name'),
        description: t('tools.http-status-codes.405.description'),
        type: 'HTTP',
      },
      {
        code: 406,
        name: t('tools.http-status-codes.406.name'),
        description: t('tools.http-status-codes.406.description'),
        type: 'HTTP',
      },
      {
        code: 407,
        name: t('tools.http-status-codes.407.name'),
        description: t('tools.http-status-codes.407.description'),
        type: 'HTTP',
      },
      {
        code: 408,
        name: t('tools.http-status-codes.408.name'),
        description: t('tools.http-status-codes.408.description'),
        type: 'HTTP',
      },
      {
        code: 409,
        name: t('tools.http-status-codes.409.name'),
        description: t('tools.http-status-codes.409.description'),
        type: 'HTTP',
      },
      {
        code: 410,
        name: t('tools.http-status-codes.410.name'),
        description: t('tools.http-status-codes.410.description'),
        type: 'HTTP',
      },
      {
        code: 411,
        name: t('tools.http-status-codes.411.name'),
        description: t('tools.http-status-codes.411.description'),
        type: 'HTTP',
      },
      {
        code: 412,
        name: t('tools.http-status-codes.412.name'),
        description: t('tools.http-status-codes.412.description'),
        type: 'HTTP',
      },
      {
        code: 413,
        name: t('tools.http-status-codes.413.name'),
        description: t('tools.http-status-codes.413.description'),
        type: 'HTTP',
      },
      {
        code: 414,
        name: t('tools.http-status-codes.414.name'),
        description: t('tools.http-status-codes.414.description'),
        type: 'HTTP',
      },
      {
        code: 415,
        name: t('tools.http-status-codes.415.name'),
        description: t('tools.http-status-codes.415.description'),
        type: 'HTTP',
      },
      {
        code: 416,
        name: t('tools.http-status-codes.416.name'),
        description: t('tools.http-status-codes.416.description'),
        type: 'HTTP',
      },
      {
        code: 417,
        name: t('tools.http-status-codes.417.name'),
        description: t('tools.http-status-codes.417.description'),
        type: 'HTTP',
      },
      {
        code: 418,
        name: t('tools.http-status-codes.418.name'),
        description: t('tools.http-status-codes.418.description'),
        type: 'HTTP',
      },
      {
        code: 421,
        name: t('tools.http-status-codes.421.name'),
        description: t('tools.http-status-codes.421.description'),
        type: 'HTTP',
      },
      {
        code: 422,
        name: t('tools.http-status-codes.422.name'),
        description: t('tools.http-status-codes.422.description'),
        type: 'HTTP',
      },
      {
        code: 423,
        name: t('tools.http-status-codes.423.name'),
        description: t('tools.http-status-codes.423.description'),
        type: 'HTTP',
      },
      {
        code: 424,
        name: t('tools.http-status-codes.424.name'),
        description: t('tools.http-status-codes.424.description'),
        type: 'HTTP',
      },
      {
        code: 425,
        name: t('tools.http-status-codes.425.name'),
        description: t('tools.http-status-codes.425.description'),
        type: 'HTTP',
      },
      {
        code: 426,
        name: t('tools.http-status-codes.426.name'),
        description: t('tools.http-status-codes.426.description'),
        type: 'HTTP',
      },
      {
        code: 428,
        name: t('tools.http-status-codes.428.name'),
        description: t('tools.http-status-codes.428.description'),
        type: 'HTTP',
      },
      {
        code: 429,
        name: t('tools.http-status-codes.429.name'),
        description: t('tools.http-status-codes.429.description'),
        type: 'HTTP',
      },
      {
        code: 431,
        name: t('tools.http-status-codes.431.name'),
        description: t('tools.http-status-codes.431.description'),
        type: 'HTTP',
      },
      {
        code: 451,
        name: t('tools.http-status-codes.451.name'),
        description: t('tools.http-status-codes.451.description'),
        type: 'HTTP',
      },
    ],
  },
  {
    category: t('tools.http-status-codes.5xx'),
    codes: [
      {
        code: 500,
        name: t('tools.http-status-codes.500.name'),
        description: t('tools.http-status-codes.500.description'),
        type: 'HTTP',
      },
      {
        code: 501,
        name: t('tools.http-status-codes.501.name'),
        description: t('tools.http-status-codes.501.description'),
        type: 'HTTP',
      },
      {
        code: 502,
        name: t('tools.http-status-codes.502.name'),
        description: t('tools.http-status-codes.502.description'),
        type: 'HTTP',
      },
      {
        code: 503,
        name: t('tools.http-status-codes.503.name'),
        description: t('tools.http-status-codes.503.description'),
        type: 'HTTP',
      },
      {
        code: 504,
        name: t('tools.http-status-codes.504.name'),
        description: t('tools.http-status-codes.504.description'),
        type: 'HTTP',
      },
      {
        code: 505,
        name: t('tools.http-status-codes.505.name'),
        description: t('tools.http-status-codes.505.description'),
        type: 'HTTP',
      },
      {
        code: 506,
        name: t('tools.http-status-codes.506.name'),
        description: t('tools.http-status-codes.506.description'),
        type: 'HTTP',
      },
      {
        code: 507,
        name: t('tools.http-status-codes.507.name'),
        description: t('tools.http-status-codes.507.description'),
        type: 'HTTP',
      },
      {
        code: 508,
        name: t('tools.http-status-codes.508.name'),
        description: t('tools.http-status-codes.508.description'),
        type: 'HTTP',
      },
      {
        code: 510,
        name: t('tools.http-status-codes.510.name'),
        description: t('tools.http-status-codes.510.description'),
        type: 'HTTP',
      },
      {
        code: 511,
        name: t('tools.http-status-codes.511.name'),
        description: t('tools.http-status-codes.511.description'),
        type: 'HTTP',
      },
    ],
  },
];
