<template>
  <div>
    <n-card>
      <div v-if="styleStore.isSmallScreen">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px"> Input number: </n-input-group-label>
          <n-input-number v-model:value="inputNumber" min="0" style="width: 100%" />
        </n-input-group>
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px"> Input base: </n-input-group-label>
          <n-input-number v-model:value="inputBase" max="64" min="2" style="width: 100%" />
        </n-input-group>
      </div>

      <n-input-group v-else>
        <n-input-group-label style="flex: 0 0 120px"> Input number: </n-input-group-label>
        <n-input-number v-model:value="inputNumber" min="0" />
        <n-input-group-label style="flex: 0 0 120px"> Input base: </n-input-group-label>
        <n-input-number v-model:value="inputBase" max="64" min="2" />
      </n-input-group>
      <n-divider />

      <n-input-group>
        <n-input-group-label style="flex: 0 0 170px"> Binary (2): </n-input-group-label>
        <input-copyable :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 2 })" readonly />
      </n-input-group>

      <n-input-group>
        <n-input-group-label style="flex: 0 0 170px"> Octal (8): </n-input-group-label>
        <input-copyable :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 8 })" readonly />
      </n-input-group>

      <n-input-group>
        <n-input-group-label style="flex: 0 0 170px"> Decimal (10): </n-input-group-label>
        <input-copyable
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 10 })"
          readonly
        />
      </n-input-group>

      <n-input-group>
        <n-input-group-label style="flex: 0 0 170px"> Hexadecimal (16): </n-input-group-label>
        <input-copyable
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 16 })"
          readonly
        />
      </n-input-group>

      <n-input-group>
        <n-input-group-label style="flex: 0 0 170px"> Base64 (64): </n-input-group-label>
        <input-copyable
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 64 })"
          readonly
        />
      </n-input-group>
      <n-input-group>
        <n-input-group-label style="flex: 0 0 85px"> Custom: </n-input-group-label>
        <n-input-number v-model:value="outputBase" style="flex: 0 0 86px" max="64" min="2" />
        <input-copyable
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: outputBase })"
          readonly
        />
      </n-input-group>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { convertBase } from './integer-base-converter.model';
import InputCopyable from '../../components/InputCopyable.vue';
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();

const inputNumber = ref(42);
const inputBase = ref(10);
const outputBase = ref(42);
</script>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
