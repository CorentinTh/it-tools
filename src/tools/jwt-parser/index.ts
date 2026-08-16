import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Web',
  order: 8,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.jwt-parser.title'),
  path: '/jwt-parser',
  description: translate('tools.jwt-parser.description'),
  keywords: [
    'jwt',
    'parser',
    'decode',
    'typ',
    'alg',
    'iss',
    'sub',
    'aud',
    'exp',
    'nbf',
    'iat',
    'jti',
    'json',
    'web',
    'token',
    'verify',
    'sign',
    'hmac',
    'HS256',
    'HS384',
    'HS512',
    'JWK',
    'JWKS',
    'RSA',
    'RSA-PSS',
    'ECDSA',
    'EdDSA',
    'Ed25519',
    'public key',
    'kid',
  ],
  component: () => import('./jwt-parser.vue'),
  icon: Key,
});
