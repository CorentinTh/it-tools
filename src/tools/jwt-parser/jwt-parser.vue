<template>
  <c-card>
    <n-form-item label="JWT to decode" :feedback="validation.message" :validation-status="validation.status">
      <n-input v-model:value="rawJwt" type="textarea" placeholder="Put your token here..." rows="5" />
    </n-form-item>

    <n-table v-if="validation.isValid">
      <tbody>
        <template v-for="section of sections" :key="section.key">
          <th colspan="2" class="table-header">{{ section.title }}</th>
          <tr v-for="{ claim, claimDescription, friendlyValue, value } in decodedJWT[section.key]" :key="claim + value">
            <td class="claims">
              <n-space>
                <n-text strong>{{ claim }}</n-text>
                <template v-if="claimDescription">
                  <n-text depth="3">({{ claimDescription }})</n-text>
                </template>
              </n-space>
            </td>
            <td>
              <n-space>
                <n-text>{{ value }}</n-text>
                <template v-if="friendlyValue">
                  <n-text depth="3">({{ friendlyValue }})</n-text>
                </template>
              </n-space>
            </td>
          </tr>
        </template>
      </tbody>
    </n-table>
  </c-card>
</template>

<script setup lang="ts">
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { computed, ref } from 'vue';
import { decodeJwt } from './jwt-parser.service';

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
      validator: (value) => value.length > 0 && isNotThrowing(() => decodeJwt({ jwt: rawJwt.value })),
      message: 'Invalid JWT',
    },
  ],
});
</script>

<style lang="less" scoped>
.table-header {
  text-align: center;
}
</style>
