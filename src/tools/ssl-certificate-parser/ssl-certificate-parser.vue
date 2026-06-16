<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parseCertificate } from './ssl-certificate-parser.service';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import type { CertificateInfo } from './ssl-certificate-parser.service';

const { t } = useI18n();

const pemInput = ref('');

const emptyCert: CertificateInfo = {
  subject: [],
  issuer: [],
  serialNumber: '',
  validFrom: '',
  validTo: '',
  isExpired: false,
  daysUntilExpiry: 0,
  version: 0,
  signatureAlgorithm: '',
  thumbprint: '',
  subjectAltNames: [],
  keyUsage: [],
  basicConstraints: '',
  publicKeyAlgorithm: '',
  publicKeySize: '',
};

const certInfo = computed(() =>
  withDefaultOnError(() => parseCertificate(pemInput.value), emptyCert),
);

const validation = useValidation({
  source: pemInput,
  rules: [
    {
      validator: value => value.length > 0 && isNotThrowing(() => parseCertificate(value)),
      message: t('tools.ssl-certificate-parser.invalidPem'),
    },
  ],
});

function formatDate(iso: string) {
  if (!iso) { return ''; }
  return new Date(iso).toLocaleString();
}
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="pemInput"
      :label="t('tools.ssl-certificate-parser.inputLabel')"
      :validation="validation"
      :placeholder="t('tools.ssl-certificate-parser.inputPlaceholder')"
      rows="8"
      multiline
      raw-text
      autofocus
      mb-3
    />

    <n-collapse mb-3>
      <n-collapse-item :title="t('tools.ssl-certificate-parser.help.title')" name="help">
        <n-h4 prefix="bar">{{ t('tools.ssl-certificate-parser.help.section1Title') }}</n-h4>
        <n-code
          language="bash"
          :code="`openssl s_client -connect example.com:443 -showcerts </dev/null 2>/dev/null | openssl x509 -outform PEM`"
        />
        <n-p>
          {{ t('tools.ssl-certificate-parser.help.section1Desc') }}
        </n-p>

        <n-h4 prefix="bar">{{ t('tools.ssl-certificate-parser.help.section2Title') }}</n-h4>
        <n-ul>
          <n-li>{{ t('tools.ssl-certificate-parser.help.section2Step1') }}</n-li>
          <n-li>{{ t('tools.ssl-certificate-parser.help.section2Step2') }}</n-li>
        </n-ul>

        <n-h4 prefix="bar">{{ t('tools.ssl-certificate-parser.help.section3Title') }}</n-h4>
        <n-ul>
          <n-li>{{ t('tools.ssl-certificate-parser.help.section3Nginx') }}</n-li>
          <n-li>{{ t('tools.ssl-certificate-parser.help.section3Apache') }}</n-li>
          <n-li>{{ t('tools.ssl-certificate-parser.help.section3Paths') }}</n-li>
        </n-ul>

        <n-h4 prefix="bar">{{ t('tools.ssl-certificate-parser.help.section4Title') }}</n-h4>
        <n-code
          :code="`-----BEGIN CERTIFICATE-----\nMIIDdzCCAl+gAwIBAgIEAgAAuTANBgkqhkiG9w0BAQUFADBa\nMQswCQYDVQQGEwJJRTESMBAGA1UEChMJQmFsdGltb3Jl...\n-----END CERTIFICATE-----`"
        />
      </n-collapse-item>
    </n-collapse>

    <div v-if="validation.isValid">
      <c-card :title="t('tools.ssl-certificate-parser.validity')" mb-3>
        <n-table :bordered="false" :single-line="false">
          <tbody>
            <tr>
              <td font-bold w-200px>
                {{ t('tools.ssl-certificate-parser.status') }}
              </td>
              <td>
                <n-tag :type="certInfo.isExpired ? 'error' : 'success'" size="small">
                  {{ certInfo.isExpired ? t('tools.ssl-certificate-parser.expired') : t('tools.ssl-certificate-parser.valid') }}
                </n-tag>
                <span ml-2 op-70>
                  {{ certInfo.isExpired
                    ? t('tools.ssl-certificate-parser.expiredAgo', { days: Math.abs(certInfo.daysUntilExpiry) })
                    : t('tools.ssl-certificate-parser.daysRemaining', { days: certInfo.daysUntilExpiry })
                  }}
                </span>
              </td>
            </tr>
            <tr>
              <td font-bold>
                {{ t('tools.ssl-certificate-parser.validFrom') }}
              </td>
              <td>{{ formatDate(certInfo.validFrom) }}</td>
            </tr>
            <tr>
              <td font-bold>
                {{ t('tools.ssl-certificate-parser.validTo') }}
              </td>
              <td>{{ formatDate(certInfo.validTo) }}</td>
            </tr>
          </tbody>
        </n-table>
      </c-card>

      <c-card :title="t('tools.ssl-certificate-parser.subject')" mb-3>
        <n-table :bordered="false" :single-line="false">
          <tbody>
            <tr v-for="{ key, value } in certInfo.subject" :key="key">
              <td font-bold w-200px>
                {{ key }}
              </td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </n-table>
      </c-card>

      <c-card v-if="certInfo.subjectAltNames.length > 0" :title="t('tools.ssl-certificate-parser.san')" mb-3>
        <n-table :bordered="false" :single-line="false">
          <tbody>
            <tr v-for="(name, i) in certInfo.subjectAltNames" :key="i">
              <td>{{ name }}</td>
            </tr>
          </tbody>
        </n-table>
      </c-card>

      <c-card :title="t('tools.ssl-certificate-parser.issuer')" mb-3>
        <n-table :bordered="false" :single-line="false">
          <tbody>
            <tr v-for="{ key, value } in certInfo.issuer" :key="key">
              <td font-bold w-200px>
                {{ key }}
              </td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </n-table>
      </c-card>

      <c-card :title="t('tools.ssl-certificate-parser.details')" mb-3>
        <n-table :bordered="false" :single-line="false">
          <tbody>
            <tr>
              <td font-bold w-200px>
                {{ t('tools.ssl-certificate-parser.version') }}
              </td>
              <td>V{{ certInfo.version }}</td>
            </tr>
            <tr>
              <td font-bold>
                {{ t('tools.ssl-certificate-parser.serialNumber') }}
              </td>
              <td style="word-break: break-all;">
                {{ certInfo.serialNumber }}
              </td>
            </tr>
            <tr>
              <td font-bold>
                {{ t('tools.ssl-certificate-parser.signatureAlgorithm') }}
              </td>
              <td>{{ certInfo.signatureAlgorithm }}</td>
            </tr>
            <tr>
              <td font-bold>
                {{ t('tools.ssl-certificate-parser.publicKey') }}
              </td>
              <td>{{ certInfo.publicKeyAlgorithm }} {{ certInfo.publicKeySize }}</td>
            </tr>
            <tr>
              <td font-bold>
                {{ t('tools.ssl-certificate-parser.fingerprint') }}
              </td>
              <td style="word-break: break-all;">
                {{ certInfo.thumbprint }}
              </td>
            </tr>
            <tr v-if="certInfo.keyUsage.length > 0">
              <td font-bold>
                {{ t('tools.ssl-certificate-parser.keyUsage') }}
              </td>
              <td>{{ certInfo.keyUsage.join(', ') }}</td>
            </tr>
            <tr>
              <td font-bold>
                {{ t('tools.ssl-certificate-parser.basicConstraints') }}
              </td>
              <td>{{ certInfo.basicConstraints }}</td>
            </tr>
          </tbody>
        </n-table>
      </c-card>
    </div>
  </c-card>
</template>
