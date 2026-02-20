<script setup lang="ts">
import * as jose from 'jose';
import JSON5 from 'json5';
import { decodeJwt, getJwtAlgorithm } from './jwt-parser.service';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const rawJwt = ref(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
);

const decodedJWT = computed(() =>
  withDefaultOnError(() => decodeJwt({ jwt: rawJwt.value }), { header: [], payload: [] }),
);

const sections = [
  { key: 'header', title: 'Header' },
  { key: 'payload', title: 'Payload' },
] as const;

const validation = useValidation({
  source: rawJwt,
  rules: [
    {
      validator: value => value.length > 0 && isNotThrowing(() => decodeJwt({ jwt: rawJwt.value })),
      message: 'Invalid JWT',
    },
  ],
});

const secretOrPublicKey = ref('');
const signatureVerification = computedAsync(async () => {
  const secretOrPublicKeyValue = secretOrPublicKey.value?.trim();
  if (!secretOrPublicKeyValue) {
    return { error: 'No secret or key provided' };
  }
  const jwt = rawJwt.value?.trim();
  if (!jwt) {
    return { error: 'No JWT token provided' };
  }
  try {
    const alg = getJwtAlgorithm({ jwt }) || 'unk';

    if (secretOrPublicKeyValue.startsWith('{')) {
      const jwk = JSON5.parse(secretOrPublicKeyValue);
      const publicKey = await jose.importJWK(jwk, alg);

      await jose.jwtVerify(jwt, publicKey);
    }
    else if (secretOrPublicKeyValue.includes('-----BEGIN PUBLIC KEY-----')) {
      const publicKey = await jose.importSPKI(secretOrPublicKeyValue, alg);
      await jose.jwtVerify(jwt, publicKey);
    }
    else {
      const secret = new TextEncoder().encode(secretOrPublicKeyValue);
      await jose.jwtVerify(jwt, secret);
    }

    return { error: '' };
  }
  catch (e: any) {
    return { error: `Key or secret or verification error: ${e.toString()}` };
  }
});
</script>

<template>
  <c-card>
    <c-input-text v-model:value="rawJwt" label="JWT to decode" :validation="validation" placeholder="Put your token here..." rows="5" multiline raw-text autofocus mb-3 />

    <n-table v-if="validation.isValid">
      <tbody>
        <template v-for="section of sections" :key="section.key">
          <th colspan="2" class="table-header">
            {{ section.title }}
          </th>
          <tr v-for="{ claim, claimDescription, friendlyValue, value } in decodedJWT[section.key]" :key="claim + value">
            <td class="claims">
              <span font-bold>
                {{ claim }}
              </span>
              <span v-if="claimDescription" ml-2 op-70>
                ({{ claimDescription }})
              </span>
            </td>
            <td>
              <span>{{ value }}</span>
              <span v-if="friendlyValue" ml-2 op-70>
                ({{ friendlyValue }})
              </span>
            </td>
          </tr>
        </template>
      </tbody>
    </n-table>

    <c-card title="Signature Validation">
      <c-input-text
        v-model:value="secretOrPublicKey" label="Secret or Public Key (SPKI or JWK)"
        placeholder="Put your secret or Public key here..." rows="5" multiline raw-text autofocus mb-3
      />

      <c-alert v-if="signatureVerification?.error">
        {{ signatureVerification.error }}
      </c-alert>

      <n-alert v-if="!signatureVerification?.error" type="success">
        Signature verified
      </n-alert>
    </c-card>
  </c-card>
</template>

<style lang="less" scoped>
.table-header {
  text-align: center;
}
</style>
