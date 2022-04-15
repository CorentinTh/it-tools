<template>
  <div>
    <n-card>
      <n-input-group>
        <n-input-group-label style="width: 200px;">
          Input number:
        </n-input-group-label>
        <n-input-number
          v-model:value="inputNumber"
          min="0"
        />

        <n-input-group-label style="width: 200px;">
          Input base:
        </n-input-group-label>
        <n-input-number
          v-model:value="inputBase"
          max="64"
          min="2"
          style="width: 100px;"
        />
      </n-input-group>
      <n-divider />



      <n-input-group>
        <n-input-group-label style="width: 200px;">
          Binary (2):
        </n-input-group-label>
        <n-input
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 2 })"
          readonly
        />
      </n-input-group>

      <n-input-group>
        <n-input-group-label style="width: 200px;">
          Octale (8):
        </n-input-group-label>
        <n-input
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 8 })"
          readonly
        />
      </n-input-group>

      <n-input-group>
        <n-input-group-label style="width: 200px;">
          Decimal (10):
        </n-input-group-label>
        <n-input
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 10 })"
          readonly
        />
      </n-input-group>

      <n-input-group>
        <n-input-group-label style="width: 200px;">
          Hexadecimal (16):
        </n-input-group-label>
        <n-input
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 16 })"
          readonly
        />
      </n-input-group>

      <n-input-group>
        <n-input-group-label style="width: 200px;">
          Base64 (64):
        </n-input-group-label>
        <n-input
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: 64 })"
          readonly
        />
      </n-input-group>
      <n-input-group>
        <n-input-group-label style="width: 90px;">
          Custom:
        </n-input-group-label>
        <n-input-number
          v-model:value="outputBase"
          style="width: 110px;"
          max="64"
          min="2"
        />
        <n-input
          :value="convertBase({ value: String(inputNumber), fromBase: inputBase, toBase: outputBase })"
          readonly
        />
      </n-input-group>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { convertBase } from './integer-base-converter.model'

const inputNumber = ref(42)
const inputBase = ref(10)
const outputBase = ref(42)

</script>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
    margin-top: 5px;
}
</style>