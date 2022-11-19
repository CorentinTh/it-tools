<template>
  <n-card>
    <n-form-item label="JWT to decode" :feedback="validation.message" :validation-status="validation.status">
      <n-input v-model:value="raw_jwt" type="textarea" placeholder="Put your token here..." rows="5" />
    </n-form-item>
    <n-form-item label="Display parsed value?" label-placement="left" :show-feedback="false">
      <n-switch v-model:value="showParsedValues" />
    </n-form-item>

    <n-table>
      <tbody>
        <td colspan="2" class="table-header"><strong>Header</strong></td>
        <tr v-for="[key, value] in Object.entries(decodedJWT.header)" :key="key">
          <td class="claims"><claim-vue :claim="key" /></td>
          <td>
            <span v-if="!showParsedValues">{{ value }}</span>
            <value-vue v-else :claim="key" :value="value" />
          </td>
        </tr>
        <td colspan="2" class="table-header"><strong>Payload</strong></td>
        <tr v-for="[key, value] in Object.entries(decodedJWT.payload)" :key="key">
          <td class="claims"><claim-vue :claim="key" /></td>
          <td>
            <span v-if="!showParsedValues">{{ value }}</span>
            <value-vue v-else :claim="key" :value="value" />
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import jwt_decode from 'jwt-decode';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { safe_jwt_decode } from './jwt-parser.service';
import claimVue from './claim.vue';
import valueVue from './value.vue';

const raw_jwt = ref(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
);
const showParsedValues = ref(true);

const decodedJWT = computed(() => {
  return safe_jwt_decode(raw_jwt.value);
});
const validation = useValidation({
  source: raw_jwt,
  rules: [
    {
      validator: (value) => value.length > 0 && isNotThrowing(() => jwt_decode(value, { header: true })),
      message: 'Invalid JWT',
    },
  ],
});
</script>

<style lang="less" scoped>
.table-header {
  text-align: center;
}

.claims {
  width: 20%;
}
</style>
