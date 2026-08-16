import { describe, expect, it } from 'vitest';
import { decryptAnsibleVault, encryptAnsibleVault, parseHtpasswdLine, validateHtpasswdPassword, validateHtpasswdUsername } from './devops-secret-helper.service';

const ANSIBLE_2_21_FIXTURE = `$ANSIBLE_VAULT;1.1;AES256
62663131633136643035346136653165393132303730303638373530643164313036376637666135
3063666639373735393266313661366264353834343330660a663430613535393034393732666163
38633766653262333336626537323265613239633336653336326239663165626632373537313939
6266656131656133370a316239663862633130363539333064313634366134353866303030323863
39353634396137613833316562663634313864363738623132366366383161393531
`;
const ANSIBLE_2_21_FIXED_SALT_FIXTURE = `$ANSIBLE_VAULT;1.1;AES256
30303031303230333034303530363037303830393061306230633064306530663130313131323133
3134313531363137313831393161316231633164316531660a646139663761313965343664653765
65356330653466633130373033663030373537383036343237323033363232396363396633373535
3130613766353434310a626135313564656263616263343866626566303233373664643464373765
34346633646130306663396234633038656461653566643264616463376632353964
`;

describe('DevOps secret formats', () => {
  it('decrypts an Ansible Core 2.21.2 Vault 1.1 AES256 fixture', async () => {
    await expect(decryptAnsibleVault(ANSIBLE_2_21_FIXTURE, 'correct horse battery staple')).resolves.toBe('hello from ansible\n');
  });

  it('round-trips deterministic Vault 1.1 and labelled 1.2 output', async () => {
    const salt = Uint8Array.from({ length: 32 }, (_, index) => index);
    await expect(encryptAnsibleVault('compatibility-check', 'vault password', '', salt)).resolves.toBe(ANSIBLE_2_21_FIXED_SALT_FIXTURE);
    const one = await encryptAnsibleVault('Привет\n', 'vault password', '', salt);
    const two = await encryptAnsibleVault('Привет\n', 'vault password', 'production', salt);
    expect(one).toMatch(/^\$ANSIBLE_VAULT;1\.1;AES256\n/u);
    expect(two).toMatch(/^\$ANSIBLE_VAULT;1\.2;AES256;production\n/u);
    await expect(decryptAnsibleVault(two, 'vault password')).resolves.toBe('Привет\n');
  });

  it('authenticates before releasing modified or wrong-password plaintext', async () => {
    const vault = await encryptAnsibleVault('secret', 'right password', '', new Uint8Array(32));
    await expect(decryptAnsibleVault(vault, 'wrong password')).rejects.toThrow(/Authentication failed/u);
    const changed = vault.replace(/[0-9a-f](?=\n?$)/u, character => character === '0' ? '1' : '0');
    await expect(decryptAnsibleVault(changed, 'right password')).rejects.toThrow();
  });

  it('validates the modern bcrypt htpasswd boundary', () => {
    expect(parseHtpasswdLine('alice:$2y$05$c4WoMPo3SXsafkva.HHa6uXQZWr7oboPiC2bT/r7q1BB8I2s0BRqC').username).toBe('alice');
    expect(() => validateHtpasswdUsername('a:b')).toThrow(/colon/u);
    expect(() => validateHtpasswdPassword('💩'.repeat(19))).toThrow(/72/u);
  });
});
