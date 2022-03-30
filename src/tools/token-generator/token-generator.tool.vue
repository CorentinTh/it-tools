<template>
    <div>
        <h1>Token generator</h1>

        <n-form label-placement="left" label-width="140">
            <n-space justify="center" item-style="padding: 0" :size="0">
                <div>
                    <n-form-item label="Uppercase (ABC...)">
                        <n-switch v-model:value="withUppercase" />
                    </n-form-item>

                    <n-form-item label="Lowercase (abc...)">
                        <n-switch v-model:value="withLowercase" />
                    </n-form-item>
                </div>

                <div>
                    <n-form-item label="Numbers (012...)">
                        <n-switch v-model:value="withNumbers" />
                    </n-form-item>

                    <n-form-item label="Symbols (;-!...)">
                        <n-switch v-model:value="withSymbols" />
                    </n-form-item>
                </div>
            </n-space>
        </n-form>

        <!-- <n-form-item label="Custom alphabet" label-placement="left">
            <n-switch v-model:value="withAlphabet" />
            <n-input v-model:value="customAlphabet" placeholder="Custom alphabet" />
        </n-form-item>-->

        <n-form-item :label="`Length (${length})`" label-placement="left">
            <n-slider v-model:value="length" :step="1" :min="1" :max="512" />
        </n-form-item>

        <n-input v-model:value="token" type="textarea" placeholder="The token..." />
    </div>
</template>

<script setup lang="ts">
import { shuffleString } from '@/utils/random';
import { ref, watch } from 'vue';

const token = ref('')
const length = ref(64)
const customAlphabet = ref('it-tools <3')

const withUppercase = ref(true)
const withLowercase = ref(true)
const withNumbers = ref(true)
const withSymbols = ref(false)
const withAlphabet = ref(false)

watch([withUppercase, withLowercase, withNumbers, withSymbols, length, customAlphabet, withAlphabet], refreshToken)

function refreshToken() {
    const alphabet = withAlphabet.value
        ? customAlphabet.value
        : [
            ...(withUppercase.value ? 'ABCDEFGHIJKLMOPQRSTUVWXYZ' : ''),
            ...(withLowercase.value ? 'abcdefghijklmopqrstuvwxyz' : ''),
            ...(withNumbers.value ? '0123456789' : ''),
            ...(withSymbols.value ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : '')
        ].join('')

    token.value = shuffleString(alphabet.repeat(length.value)).substring(0, length.value)
}

refreshToken()
</script>

<style lang="scss" scoped>
</style>