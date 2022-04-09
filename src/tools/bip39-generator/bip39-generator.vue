<template>
    <div>
        <n-card>
            <n-space item-style="flex: 1 1 0">
                <n-form-item label="Language:">
                    <n-select v-model:value="language" :options="languages" />
                </n-form-item>
                <n-form-item label="Entropy (seed):">
                    <n-input v-model:value="entropy" placeholder="Your string..." />
                </n-form-item>
            </n-space>
            <n-form-item label="Passphrase (mnemonic):">
                <n-input
                    style="text-align: center;"
                    :value="passphrase"
                    type="textarea"
                    placeholder="Your string hash"
                    :autosize="{ minRows: 1 }"
                    readonly
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                />
            </n-form-item>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { ref, computed } from 'vue'
import { entropyToMnemonic } from 'bip39'

const entropy = ref('1d60683972011cb97322ed6ae96225f3')
const language = ref('English')
const languages = ref(['English'])
const passphrase = computed(() => {
    // setDefaultWordlist(language.value)
    return entropyToMnemonic(Buffer.from(entropy.value, "utf-8"))
})


</script>

<style lang="scss" scoped>
</style>