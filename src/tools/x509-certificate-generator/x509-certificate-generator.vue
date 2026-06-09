<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { X509CertificateOptions } from './x509-certificate-generator.service';
import { generateX509 } from './x509-certificate-generator.service';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

// Country codes list (ISO 3166-1 alpha-2)
const countryCodes = [
  { label: 'AF', value: 'AF' },
  { label: 'AL', value: 'AL' },
  { label: 'AG', value: 'AG' },
  { label: 'AQ', value: 'AQ' },
  { label: 'AN', value: 'AN' },
  { label: 'AO', value: 'AO' },
  { label: 'AV', value: 'AV' },
  { label: 'AY', value: 'AY' },
  { label: 'AC', value: 'AC' },
  { label: 'AR', value: 'AR' },
  { label: 'AM', value: 'AM' },
  { label: 'AA', value: 'AA' },
  { label: 'AS', value: 'AS' },
  { label: 'AU', value: 'AU' },
  { label: 'AJ', value: 'AJ' },
  { label: 'BF', value: 'BF' },
  { label: 'BA', value: 'BA' },
  { label: 'BG', value: 'BG' },
  { label: 'BB', value: 'BB' },
  { label: 'BO', value: 'BO' },
  { label: 'BE', value: 'BE' },
  { label: 'BH', value: 'BH' },
  { label: 'BN', value: 'BN' },
  { label: 'BD', value: 'BD' },
  { label: 'BT', value: 'BT' },
  { label: 'BL', value: 'BL' },
  { label: 'BK', value: 'BK' },
  { label: 'BC', value: 'BC' },
  { label: 'BV', value: 'BV' },
  { label: 'BR', value: 'BR' },
  { label: 'IO', value: 'IO' },
  { label: 'VI', value: 'VI' },
  { label: 'BX', value: 'BX' },
  { label: 'BU', value: 'BU' },
  { label: 'UV', value: 'UV' },
  { label: 'BM', value: 'BM' },
  { label: 'BY', value: 'BY' },
  { label: 'CV', value: 'CV' },
  { label: 'CB', value: 'CB' },
  { label: 'CM', value: 'CM' },
  { label: 'CA', value: 'CA' },
  { label: 'CJ', value: 'CJ' },
  { label: 'CT', value: 'CT' },
  { label: 'CD', value: 'CD' },
  { label: 'CI', value: 'CI' },
  { label: 'CH', value: 'CH' },
  { label: 'KT', value: 'KT' },
  { label: 'CK', value: 'CK' },
  { label: 'CO', value: 'CO' },
  { label: 'CN', value: 'CN' },
  { label: 'CG', value: 'CG' },
  { label: 'CF', value: 'CF' },
  { label: 'CW', value: 'CW' },
  { label: 'CS', value: 'CS' },
  { label: 'IV', value: 'IV' },
  { label: 'HR', value: 'HR' },
  { label: 'CU', value: 'CU' },
  { label: 'UC', value: 'UC' },
  { label: 'CY', value: 'CY' },
  { label: 'EZ', value: 'EZ' },
  { label: 'DA', value: 'DA' },
  { label: 'DJ', value: 'DJ' },
  { label: 'DO', value: 'DO' },
  { label: 'DR', value: 'DR' },
  { label: 'EC', value: 'EC' },
  { label: 'EG', value: 'EG' },
  { label: 'ES', value: 'ES' },
  { label: 'EK', value: 'EK' },
  { label: 'ER', value: 'ER' },
  { label: 'EN', value: 'EN' },
  { label: 'ET', value: 'ET' },
  { label: 'FK', value: 'FK' },
  { label: 'FO', value: 'FO' },
  { label: 'FJ', value: 'FJ' },
  { label: 'FI', value: 'FI' },
  { label: 'FR', value: 'FR' },
  { label: 'FX', value: 'FX' },
  { label: 'FG', value: 'FG' },
  { label: 'FP', value: 'FP' },
  { label: 'FS', value: 'FS' },
  { label: 'GB', value: 'GB' },
  { label: 'GA', value: 'GA' },
  { label: 'GZ', value: 'GZ' },
  { label: 'GG', value: 'GG' },
  { label: 'GM', value: 'GM' },
  { label: 'GH', value: 'GH' },
  { label: 'GI', value: 'GI' },
  { label: 'GR', value: 'GR' },
  { label: 'GL', value: 'GL' },
  { label: 'GJ', value: 'GJ' },
  { label: 'GP', value: 'GP' },
  { label: 'GQ', value: 'GQ' },
  { label: 'GT', value: 'GT' },
  { label: 'GZ', value: 'GZ' },
  { label: 'GK', value: 'GK' },
  { label: 'GV', value: 'GV' },
  { label: 'PU', value: 'PU' },
  { label: 'GY', value: 'GY' },
  { label: 'HA', value: 'HA' },
  { label: 'HM', value: 'HM' },
  { label: 'VT', value: 'VT' },
  { label: 'HO', value: 'HO' },
  { label: 'HK', value: 'HK' },
  { label: 'HU', value: 'HU' },
  { label: 'IC', value: 'IC' },
  { label: 'IN', value: 'IN' },
  { label: 'ID', value: 'ID' },
  { label: 'IR', value: 'IR' },
  { label: 'IZ', value: 'IZ' },
  { label: 'EI', value: 'EI' },
  { label: 'IM', value: 'IM' },
  { label: 'IS', value: 'IS' },
  { label: 'IT', value: 'IT' },
  { label: 'JM', value: 'JM' },
  { label: 'JA', value: 'JA' },
  { label: 'JE', value: 'JE' },
  { label: 'JO', value: 'JO' },
  { label: 'KZ', value: 'KZ' },
  { label: 'KE', value: 'KE' },
  { label: 'KR', value: 'KR' },
  { label: 'KN', value: 'KN' },
  { label: 'KS', value: 'KS' },
  { label: 'KV', value: 'KV' },
  { label: 'KU', value: 'KU' },
  { label: 'KG', value: 'KG' },
  { label: 'LA', value: 'LA' },
  { label: 'LG', value: 'LG' },
  { label: 'LE', value: 'LE' },
  { label: 'LT', value: 'LT' },
  { label: 'LI', value: 'LI' },
  { label: 'LY', value: 'LY' },
  { label: 'LS', value: 'LS' },
  { label: 'LH', value: 'LH' },
  { label: 'LU', value: 'LU' },
  { label: 'MC', value: 'MC' },
  { label: 'MK', value: 'MK' },
  { label: 'MA', value: 'MA' },
  { label: 'MI', value: 'MI' },
  { label: 'MY', value: 'MY' },
  { label: 'MV', value: 'MV' },
  { label: 'ML', value: 'ML' },
  { label: 'MT', value: 'MT' },
  { label: 'RM', value: 'RM' },
  { label: 'MB', value: 'MB' },
  { label: 'MR', value: 'MR' },
  { label: 'MP', value: 'MP' },
  { label: 'MF', value: 'MF' },
  { label: 'MX', value: 'MX' },
  { label: 'FM', value: 'FM' },
  { label: 'MD', value: 'MD' },
  { label: 'MN', value: 'MN' },
  { label: 'MG', value: 'MG' },
  { label: 'MJ', value: 'MJ' },
  { label: 'MH', value: 'MH' },
  { label: 'MO', value: 'MO' },
  { label: 'MZ', value: 'MZ' },
  { label: 'WA', value: 'WA' },
  { label: 'NR', value: 'NR' },
  { label: 'NP', value: 'NP' },
  { label: 'NL', value: 'NL' },
  { label: 'NT', value: 'NT' },
  { label: 'NC', value: 'NC' },
  { label: 'NZ', value: 'NZ' },
  { label: 'NU', value: 'NU' },
  { label: 'NG', value: 'NG' },
  { label: 'NI', value: 'NI' },
  { label: 'NE', value: 'NE' },
  { label: 'NF', value: 'NF' },
  { label: 'CQ', value: 'CQ' },
  { label: 'NO', value: 'NO' },
  { label: 'MU', value: 'MU' },
  { label: 'PK', value: 'PK' },
  { label: 'PS', value: 'PS' },
  { label: 'PM', value: 'PM' },
  { label: 'PP', value: 'PP' },
  { label: 'PA', value: 'PA' },
  { label: 'PE', value: 'PE' },
  { label: 'RP', value: 'RP' },
  { label: 'PC', value: 'PC' },
  { label: 'PL', value: 'PL' },
  { label: 'PO', value: 'PO' },
  { label: 'RQ', value: 'RQ' },
  { label: 'QA', value: 'QA' },
  { label: 'RE', value: 'RE' },
  { label: 'RO', value: 'RO' },
  { label: 'TW', value: 'TW' },
  { label: 'RS', value: 'RS' },
  { label: 'RW', value: 'RW' },
  { label: 'TB', value: 'TB' },
  { label: 'SH', value: 'SH' },
  { label: 'SC', value: 'SC' },
  { label: 'ST', value: 'ST' },
  { label: 'RN', value: 'RN' },
  { label: 'VC', value: 'VC' },
  { label: 'WS', value: 'WS' },
  { label: 'SM', value: 'SM' },
  { label: 'TP', value: 'TP' },
  { label: 'SA', value: 'SA' },
  { label: 'SG', value: 'SG' },
  { label: 'RI', value: 'RI' },
  { label: 'SE', value: 'SE' },
  { label: 'SL', value: 'SL' },
  { label: 'SN', value: 'SN' },
  { label: 'NN', value: 'NN' },
  { label: 'LO', value: 'LO' },
  { label: 'SI', value: 'SI' },
  { label: 'BP', value: 'BP' },
  { label: 'SO', value: 'SO' },
  { label: 'SF', value: 'SF' },
  { label: 'SX', value: 'SX' },
  { label: 'OD', value: 'OD' },
  { label: 'SP', value: 'SP' },
  { label: 'CE', value: 'CE' },
  { label: 'SU', value: 'SU' },
  { label: 'NS', value: 'NS' },
  { label: 'SB', value: 'SB' },
  { label: 'WZ', value: 'WZ' },
  { label: 'SW', value: 'SW' },
  { label: 'SZ', value: 'SZ' },
  { label: 'SY', value: 'SY' },
  { label: 'TI', value: 'TI' },
  { label: 'TZ', value: 'TZ' },
  { label: 'TH', value: 'TH' },
  { label: 'TT', value: 'TT' },
  { label: 'TO', value: 'TO' },
  { label: 'TL', value: 'TL' },
  { label: 'TN', value: 'TN' },
  { label: 'TD', value: 'TD' },
  { label: 'TS', value: 'TS' },
  { label: 'TU', value: 'TU' },
  { label: 'TX', value: 'TX' },
  { label: 'TK', value: 'TK' },
  { label: 'TV', value: 'TV' },
  { label: 'UG', value: 'UG' },
  { label: 'UP', value: 'UP' },
  { label: 'AE', value: 'AE' },
  { label: 'UK', value: 'UK' },
  { label: 'US', value: 'US' },
  { label: 'UM', value: 'UM' },
  { label: 'UY', value: 'UY' },
  { label: 'UZ', value: 'UZ' },
  { label: 'NH', value: 'NH' },
  { label: 'VE', value: 'VE' },
  { label: 'VM', value: 'VM' },
  { label: 'VQ', value: 'VQ' },
  { label: 'WF', value: 'WF' },
  { label: 'WE', value: 'WE' },
  { label: 'WI', value: 'WI' },
  { label: 'UN', value: 'UN' },
  { label: 'EU', value: 'EU' },
  { label: 'ASEAN', value: 'ASEAN' },
  { label: 'YM', value: 'YM' },
  { label: 'ZA', value: 'ZA' },
  { label: 'ZI', value: 'ZI' },
  { label: 'RH', value: 'RH' },
  { label: 'YU', value: 'YU' },
  { label: 'UR', value: 'UR' },
  { label: 'VO', value: 'VO' },
  { label: 'TC', value: 'TC' },
  { label: 'UA', value: 'UA' },
];

// Form fields
const commonName = ref('example.com');
const country = ref('US');
const stateOrProvince = ref('');
const locality = ref('');
const organization = ref('');
const organizationalUnit = ref('');
const email = ref('');

// Date range (1 year from today by default)
const today = new Date();
const oneYearFromNow = new Date(today);
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

const startDate = ref(today.toISOString().split('T')[0]);
const endDate = ref(oneYearFromNow.toISOString().split('T')[0]);

// Validation
const commonNameValidation = useValidation({
  source: commonName,
  rules: [
    {
      validator: value => value.length > 0,
      message: t('tools.x509-certificate-generator.requiredField', { field: t('tools.x509-certificate-generator.commonName') }),
    },
  ],
});

const countryValidation = useValidation({
  source: country,
  rules: [
    {
      validator: value => value.length > 0,
      message: t('tools.x509-certificate-generator.requiredField', { field: t('tools.x509-certificate-generator.country') }),
    },
    {
      validator: value => value.length === 2,
      message: t('tools.x509-certificate-generator.countryMustBe2Letters'),
    },
  ],
});

const emailValidation = useValidation({
  source: email,
  rules: [
    {
      validator: value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: t('tools.x509-certificate-generator.invalidEmailFormat'),
    },
  ],
});

const dateValidation = useValidation({
  source: endDate,
  rules: [
    {
      validator: value => new Date(value) > new Date(startDate.value),
      message: t('tools.x509-certificate-generator.endDateMustBeAfterStart'),
    },
  ],
  watch: [startDate],
});

// Generate certificate with refresh functionality
const emptyResult = { certificate: '', privateKey: '' };
const refreshCounter = ref(0);

function generateCertificate() {
  // Include refreshCounter as a dependency to force regeneration
  const _forceDependency = refreshCounter.value;

  const isValid = commonNameValidation.isValid
    && countryValidation.isValid
    && emailValidation.isValid
    && dateValidation.isValid;

  if (!isValid) {
    return null;
  }

  return withDefaultOnError(() => {
    const options: X509CertificateOptions = {
      commonName: commonName.value,
      country: country.value,
      stateOrProvince: stateOrProvince.value || undefined,
      locality: locality.value || undefined,
      organization: organization.value || undefined,
      organizationalUnit: organizationalUnit.value || undefined,
      email: email.value || undefined,
      date: [startDate.value, endDate.value],
    };

    return generateX509(options);
  }, null);
}

const certificateResult = computed(generateCertificate);
const [refreshableResult, refresh] = computedRefreshable(() => certificateResult.value ?? emptyResult);

// Override refresh to increment counter
function regenerateKeys() {
  refreshCounter.value++;
  refresh();
}

// Download functionality
function downloadCertificate() {
  if (!refreshableResult.value.certificate) {
    return;
  }

  const blob = new Blob([refreshableResult.value.certificate], { type: 'application/x-pem-file' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${commonName.value.replace(/[^a-z0-9]/gi, '_')}.crt`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPrivateKey() {
  if (!refreshableResult.value.privateKey) {
    return;
  }

  const blob = new Blob([refreshableResult.value.privateKey], { type: 'application/x-pem-file' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${commonName.value.replace(/[^a-z0-9]/gi, '_')}.key`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <c-card>
      <div style="max-width: 600px" mx-auto>
        <n-form label-placement="left" label-width="180" label-align="right">
          <!-- Required fields -->
          <n-form-item :label="`${t('tools.x509-certificate-generator.commonName')}:*`" v-bind="commonNameValidation.attrs as any">
            <n-input v-model:value="commonName" :placeholder="t('tools.x509-certificate-generator.commonNamePlaceholder')" />
          </n-form-item>

          <n-form-item :label="`${t('tools.x509-certificate-generator.country')}:*`" v-bind="countryValidation.attrs as any">
            <n-select
              v-model:value="country"
              :options="countryCodes"
              filterable
              tag
              :placeholder="t('tools.x509-certificate-generator.countryPlaceholder')"
            />
          </n-form-item>

          <!-- Optional fields -->
          <n-form-item :label="`${t('tools.x509-certificate-generator.stateOrProvince')}:`">
            <n-input v-model:value="stateOrProvince" :placeholder="t('tools.x509-certificate-generator.stateOrProvincePlaceholder')" />
          </n-form-item>

          <n-form-item :label="`${t('tools.x509-certificate-generator.locality')}:`">
            <n-input v-model:value="locality" :placeholder="t('tools.x509-certificate-generator.localityPlaceholder')" />
          </n-form-item>

          <n-form-item :label="`${t('tools.x509-certificate-generator.organization')}:`">
            <n-input v-model:value="organization" :placeholder="t('tools.x509-certificate-generator.organizationPlaceholder')" />
          </n-form-item>

          <n-form-item :label="`${t('tools.x509-certificate-generator.organizationalUnit')}:`">
            <n-input v-model:value="organizationalUnit" :placeholder="t('tools.x509-certificate-generator.organizationalUnitPlaceholder')" />
          </n-form-item>

          <n-form-item :label="`${t('tools.x509-certificate-generator.email')}:`" v-bind="emailValidation.attrs as any">
            <n-input v-model:value="email" :placeholder="t('tools.x509-certificate-generator.emailPlaceholder')" />
          </n-form-item>

          <!-- Date range -->
          <n-form-item :label="`${t('tools.x509-certificate-generator.validFrom')}:`">
            <n-date-picker
              v-model:formatted-value="startDate"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="t('tools.x509-certificate-generator.validFrom')"
            />
          </n-form-item>

          <n-form-item :label="`${t('tools.x509-certificate-generator.validTo')}:`" v-bind="dateValidation.attrs as any">
            <n-date-picker
              v-model:formatted-value="endDate"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="t('tools.x509-certificate-generator.validTo')"
            />
          </n-form-item>
        </n-form>

        <!-- Refresh button -->
        <div mt-4 flex justify-center>
          <c-button @click="regenerateKeys">
            {{ t('tools.x509-certificate-generator.regenerateKeys') }}
          </c-button>
        </div>
      </div>
    </c-card>
  </div>

  <!-- Display certificate and private key side by side -->
  <div v-if="certificateResult" flex gap-3>
    <div flex-1>
      <div mb-2 flex items-center justify-between>
        <h3>{{ t('tools.x509-certificate-generator.certificate') }}</h3>
        <c-button @click="downloadCertificate">
          {{ t('tools.x509-certificate-generator.download') }}
        </c-button>
      </div>
      <TextareaCopyable :value="refreshableResult.certificate" />
    </div>

    <div flex-1>
      <div mb-2 flex items-center justify-between>
        <h3>{{ t('tools.x509-certificate-generator.privateKey') }}</h3>
        <c-button @click="downloadPrivateKey">
          {{ t('tools.x509-certificate-generator.download') }}
        </c-button>
      </div>
      <TextareaCopyable :value="refreshableResult.privateKey" />
    </div>
  </div>

  <c-alert v-else type="warning" mt-4>
    {{ t('tools.x509-certificate-generator.fillRequiredFields') }}
  </c-alert>
</template>
