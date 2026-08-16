<script setup lang="ts">
import {
  type Ipv6Calculation,
  type Ipv6SubnetSplit,
  MAX_IPV6_SUBNET_PREVIEW,
  calculateIpv6,
  formatIpv6Count,
  isIpv6InCidr,
  splitIpv6Cidr,
} from './ipv6-calculator.service';
import { useCopy } from '@/composable/copy';

const cidr = ref('2001:db8:1234::/48');
const membershipAddress = ref('2001:db8:1234::1');
const splitPrefix = ref('52');
const calculation = ref<Ipv6Calculation>();
const split = ref<Ipv6SubnetSplit>();
const membership = ref<boolean>();
const error = ref('');
const calculatedSignature = ref('');

const signature = computed(() => `${cidr.value}\0${membershipAddress.value}\0${splitPrefix.value}`);
const isStale = computed(() => Boolean(calculation.value && signature.value !== calculatedSignature.value));
const subnetText = computed(() => {
  if (!split.value) {
    return '';
  }
  const suffix = split.value.truncated
    ? `\n… ${formatIpv6Count(split.value.totalSubnets - BigInt(split.value.preview.length))} additional subnets omitted from preview`
    : '';
  return split.value.preview.join('\n') + suffix;
});
const report = computed(() => {
  if (!calculation.value || !split.value) {
    return '';
  }
  return [
    `Input: ${calculation.value.inputAddress}/${calculation.value.prefix}`,
    `Compressed: ${calculation.value.compressedAddress}`,
    `Expanded: ${calculation.value.expandedAddress}`,
    `Network: ${calculation.value.networkAddress}/${calculation.value.prefix}`,
    `First address: ${calculation.value.firstAddress}`,
    `Last address: ${calculation.value.lastAddress}`,
    `Address count: ${calculation.value.addressCount}`,
    membership.value === undefined ? undefined : `Membership: ${membership.value ? 'inside' : 'outside'}`,
    `Split /${split.value.newPrefix}: ${split.value.totalSubnets} subnets`,
    '',
    subnetText.value,
  ].filter(value => value !== undefined).join('\n');
});

function calculate() {
  error.value = '';
  try {
    const nextCalculation = calculateIpv6(cidr.value);
    const parsedPrefix = /^\d+$/.test(splitPrefix.value) ? Number(splitPrefix.value) : Number.NaN;
    const nextSplit = splitIpv6Cidr(cidr.value, parsedPrefix);
    const trimmedMembership = membershipAddress.value.trim();
    const nextMembership = trimmedMembership === ''
      ? undefined
      : isIpv6InCidr(trimmedMembership, cidr.value);

    calculation.value = nextCalculation;
    split.value = nextSplit;
    membership.value = nextMembership;
    calculatedSignature.value = signature.value;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The IPv6 calculation failed.';
  }
}

watch([cidr, membershipAddress, splitPrefix], () => {
  error.value = '';
});

const { copy } = useCopy({ source: report, text: 'IPv6 report copied to the clipboard' });

calculate();
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card class="c-tool-panel" title="IPv6 network">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text
          v-model:value="cidr"
          label="IPv6 address and CIDR prefix"
          placeholder="2001:db8::/48"
          :maxlength="80"
          test-id="ipv6-cidr"

          raw-text clearable monospace
        />
        <c-input-text
          v-model:value="membershipAddress"
          label="Address to test (optional)"
          placeholder="2001:db8::1"
          :maxlength="64"
          test-id="ipv6-membership-address"
          raw-text
          monospace
          clearable
        />
        <c-input-text
          v-model:value="splitPrefix"
          label="Split into prefix"
          placeholder="52"
          :maxlength="3"
          test-id="ipv6-split-prefix"
          inputmode="numeric"
          raw-text
        />
      </div>
      <p mt-3 text-sm op-70>
        All address math uses exact 128-bit BigInt values. Subnet previews are capped at {{ MAX_IPV6_SUBNET_PREVIEW }} rows.
      </p>
      <c-alert v-if="error" title="Invalid IPv6 input" mt-3 data-test-id="ipv6-error">
        {{ error }}
      </c-alert>
    </c-card>

    <c-alert v-if="isStale" title="Results use previous inputs" data-test-id="ipv6-stale">
      Select Calculate to apply the current values.
    </c-alert>

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="ipv6-calculate" @click="calculate">
        Calculate
      </c-button>
      <c-button :disabled="!report" data-test-id="ipv6-copy" @click="copy()">
        Copy report
      </c-button>
    </div>

    <template v-if="calculation">
      <c-card class="c-tool-panel" title="Network result" data-test-id="ipv6-result">
        <div class="result-grid">
          <div><strong>Compressed address</strong><code>{{ calculation.compressedAddress }}</code></div>
          <div><strong>Expanded address</strong><code>{{ calculation.expandedAddress }}</code></div>
          <div><strong>Network</strong><code>{{ calculation.networkAddress }}/{{ calculation.prefix }}</code></div>
          <div><strong>First address</strong><code>{{ calculation.firstAddress }}</code></div>
          <div><strong>Last address</strong><code>{{ calculation.lastAddress }}</code></div>
          <div><strong>Address count</strong><code>{{ formatIpv6Count(calculation.addressCount) }}</code></div>
          <div><strong>Host bits</strong><code>{{ calculation.hostBits }}</code></div>
          <div v-if="membership !== undefined">
            <strong>Membership test</strong>
            <code data-test-id="ipv6-membership-result">{{ membership ? 'Inside network' : 'Outside network' }}</code>
          </div>
        </div>
      </c-card>

      <c-input-text
        v-if="split"
        class="c-tool-panel"
        :value="subnetText"
        :label="`/${split.newPrefix} subnet preview (${formatIpv6Count(split.totalSubnets)} total)`"
        aria-label="IPv6 subnet preview"
        test-id="ipv6-subnets"
        raw-text
        monospace
        readonly
        multiline
        :rows="12"
      />
    </template>
  </div>
</template>

<style scoped>
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--ui-space-3);
}

.result-grid > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--ui-space-1);
}

code {
  overflow-wrap: anywhere;
}
</style>
