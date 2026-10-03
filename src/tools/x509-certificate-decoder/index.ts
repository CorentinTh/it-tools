import { ShieldLock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'X.509 certificate decoder',
  path: '/x509-certificate-decoder',
  description: 'Decode a PEM certificate (RSA, EC or Ed25519): subject, issuer, validity, public key, extensions and fingerprints',
  keywords: ['x509', 'certificate', 'pem', 'tls', 'ssl', 'decoder', 'asn1', 'expiry'],
  component: () => import('./x509-certificate-decoder.vue'),
  icon: ShieldLock,
  createdAt: new Date('2026-09-30'),
});
