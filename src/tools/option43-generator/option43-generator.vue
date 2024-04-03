<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { getOption43Infos } from './option43-generator.service';

const dhcpVendorOptions = [
  { value: 'genuine', label: 'Native' },
  { value: 'cisco_01', label: 'Cisco IOS device' },
  { value: 'juniper_01', label: 'Juniper EX device' },
  { value: 'juniper_02', label: 'Juniper SRX device' },
  { value: 'linux_01', label: 'Linux DHCPD' },
  { value: 'ruckus_01', label: 'Ruckus SmartCellGateway' },
  { value: 'lancom_01', label: 'Lancom' },
  { value: 'fortinet_01', label: 'Fortinet' },
];
const wifiVendorOptions = [
  { value: 'cisco_01', label: 'Cisco Aironet' },
  { value: 'aruba_01', label: 'Aruba' },
  { value: 'ruckus_01', label: 'Ruckus SmartZone' },
  { value: 'ruckus_02', label: 'Ruckus ZoneDirector' },
  { value: 'ruckus_01', label: 'Ruckus SmartCellGateway' },
  { value: 'ubiquiti_01', label: 'Ubiquiti' },
  { value: 'fortinet_01', label: 'Fortinet (old)' },
  { value: 'fortinet_02', label: 'Fortinet (new/CAPWAP)' },
  { value: 'netgear_01', label: 'Netgear' },
  { value: 'cambium_01', label: 'Cambium cnMaestro' },
];

const dhcpVendor = useStorage('option43-generator:dhcp', 'genuine');
const wifiVendor = useStorage('option43-generator:wifi', 'cisco_01');
const ipAdresses = ref('192.168.0.15');

const option43Infos = computed(() => getOption43Infos(ipAdresses.value, wifiVendor.value, dhcpVendor.value));
</script>

<template>
  <div style="margin: 0 auto; max-width: 600px">
    <c-card>
      <c-select
        v-model:value="wifiVendor"
        label="Wifi Vendor:"
        label-position="left"
        label-width="120px"
        label-align="right"
        mb-2
        :options="wifiVendorOptions"
        w-full
        placeholder="Select a Wifi Vendor"
      />

      <c-select
        v-model:value="dhcpVendor"
        label="DHCP Vendor:"
        label-position="left"
        label-width="120px"
        label-align="right"
        mb-2
        :options="dhcpVendorOptions"
        w-full
        placeholder="Select a DHCP Vendor"
      />

      <c-input-text
        v-model:value="ipAdresses"
        label="IP Address(es) (one per line):"
        label-position="left"
        label-width="120px"
        label-align="right"
        multiline mb-2
        placeholder="Enter your IP Addresses (one per line)"
      />
    </c-card>

    <c-card title="Option 43 Result">
      <div v-html="option43Infos" />
    </c-card>
  </div>
</template>

<style lang="less">
.highlight {
  color: orange;
  font-variant: small-caps;
}
.cli {
  background-color: black;
  color: #adfc03;
  font-family: monospace;
  padding: 10px;
  font-size: 13px;
}
</style>
