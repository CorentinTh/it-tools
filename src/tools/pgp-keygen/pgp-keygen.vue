<script setup lang="ts">
import * as openpgp from 'openpgp';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const bits = ref(4096);
const username = ref('');
const useremail = ref('');
const password = ref('');

const format = useStorage('pgp-key-pair-generator:format', 'curve25519');
const formats = [
  'rsa',
  'curve25519',
  'ed25519',
  'p256', 'p384', 'p521',
  'brainpoolP256r1', 'brainpoolP384r1', 'brainpoolP512r1',
  'secp256k1',
];

const { attrs: bitsValidationAttrs } = useValidation({
  source: bits,
  rules: [
    {
      message: 'Bits should be 256 <= bits <= 16384 and be a multiple of 8',
      validator: value => value >= 256 && value <= 16384 && value % 8 === 0,
    },
  ],
});

const [certs, refreshCerts] = computedRefreshableAsync(
  async () => {
    const formatValue = format.value;
    const passphrase = password.value;
    const name = username.value;
    const email = useremail.value;
    const rsaBits = bits.value;

    try {
      if (format.value === 'rsa') {
        const { privateKey, publicKey } = await openpgp.generateKey({
          type: 'rsa', // Type of the key
          rsaBits, // RSA key size (defaults to 4096 bits)
          userIDs: [{ name, email }], // you can pass multiple user IDs
          passphrase, // protects the private key
          format: 'armored',
        });

        return { privateKey, publicKey, revocationCertificate: '' };
      }

      const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
        type: 'ecc', // Type of the key, defaults to ECC
        curve: formatValue as openpgp.EllipticCurveName, // ECC curve name, defaults to curve25519
        userIDs: [{ name, email }], // you can pass multiple user IDs
        passphrase, // protects the private key
        format: 'armored',
      });
      return { privateKey, publicKey, revocationCertificate };
    }
    catch (e: any) {
      return { privateKey: `#${e.toString()}`, publicKey: `#${e.toString()}`, revocationCertificate: '' };
    }
  }, { privateKey: '', publicKey: '', revocationCertificate: '' },
);
</script>

<template>
  <div>
    <div mb-4>
      <div style="flex: 0 0 100%">
        <div item-style="flex: 1 1 0" style="max-width: 600px" mx-auto flex gap-3>
          <c-select
            v-model:value="format"
            label-position="left"
            label="Format:"
            :options="formats"
            placeholder="Select a key format"
          />

          <n-form-item v-if="format === 'rsa'" label="RSA Bits :" v-bind="bitsValidationAttrs as any" label-placement="left">
            <n-input-number v-model:value="bits" min="256" max="16384" step="8" />
          </n-form-item>
        </div>
      </div>
    </div>

    <div>
      <n-form-item label="User Name :" label-placement="left">
        <n-input
          v-model:value="username"
          type="text"
          placeholder="User Name"
        />
      </n-form-item>
      <n-form-item label="User Email :" label-placement="left">
        <n-input
          v-model:value="useremail"
          :input-props="{ type: 'email' }"
          placeholder="User Email"
        />
      </n-form-item>

      <n-form-item label="Passphrase :" label-placement="left">
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          placeholder="Passphrase"
        />
      </n-form-item>

      <div text-center>
        <c-button @click="refreshCerts">
          Refresh key-pair
        </c-button>
      </div>
    </div>

    <div>
      <h3>Public key</h3>
      <TextareaCopyable :value="certs?.publicKey || ''" word-wrap="true" />
    </div>

    <div>
      <h3>Private key</h3>
      <TextareaCopyable :value="certs?.privateKey || ''" word-wrap="true" />
    </div>

    <div>
      <h3>Revocation Certificate</h3>
      <TextareaCopyable :value="certs?.revocationCertificate || ''" word-wrap="true" />
    </div>
  </div>
</template>
