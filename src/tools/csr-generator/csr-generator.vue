<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';
import { generateCSR } from "./csr-generator.service.ts";

const commonName = ref('');
const organizationName = ref('');
const organizationUnit = ref('');
const city = ref('');
const state = ref('');
const country = ref('');
const contactEmail = ref('');
const emptyCSR = { csrPem: '', privateKeyPem: '', publicKeyPem: '' };

const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => {
    return generateCSR({
      password: password.value,
      commonName: commonName.value,
      countryName: country.value,
      city: city.value,
      state: state.value,
      organizationName: organizationName.value,
      organizationalUnit: organizationalUnit.value,
      contactEmail: contactEmail.value,
    });
  },
  ), emptyCSR),
  emptyCSR,
);
</script>

<template>
  <div>
        <n-form-item label="Private Key passphrase:" label-placement="left">
          <n-input
            v-model:value="password"
            type="password"
            show-password-on="mousedown"
            placeholder="Passphrase"
          />
        </n-form-item>
    </div>

    <div>
        <n-form-item label="Common Name/Domain Name:" label-placement="left">
          <n-input
            v-model:value="commonName"
            placeholder="Common/Domain Name"
          />
        </n-form-item>
    </div>

    <div>
        <n-form-item label="Organization Name:" label-placement="left">
          <n-input
            v-model:value="organizationName"
            placeholder="Organization Name"
          />
        </n-form-item>
    </div>

    <div>
        <n-form-item label="Organization Unit:" label-placement="left">
          <n-input
            v-model:value="organizationalUnit"
            placeholder="Organization Unit"
          />
        </n-form-item>
    </div>

    <div>
        <n-form-item label="State:" label-placement="left">
          <n-input
            v-model:value="state"
            placeholder="State"
          />
        </n-form-item>
    </div>

    <div>
        <n-form-item label="City:" label-placement="left">
          <n-input
            v-model:value="city"
            placeholder="City"
          />
        </n-form-item>
    </div>

    <div>
        <n-form-item label="Country:" label-placement="left">
          <n-input
            v-model:value="country"
            placeholder="Country"
          />
        </n-form-item>
    </div>

    <div>
        <n-form-item label="Contact Email:" label-placement="left">
          <n-input
            v-model:value="contactEmail"
            placeholder="Contact Email"
          />
        </n-form-item>
    </div>

    <div>
        <c-button @click="refreshCerts">
          Refresh CSR
        </c-button>
      </div>

    <div>
      <h3>Certifacate Signing Request</h3>
      <TextareaCopyable :value="certs.csrPem" />
    </div>

    <div>
      <h3>Public key</h3>
      <TextareaCopyable :value="certs.publicKeyPem" word-wrap="true" />
    </div>

    <div>
      <h3>Private key</h3>
      <TextareaCopyable :value="certs.privateKeyPem" />
    </div>
  </div>
</template>
