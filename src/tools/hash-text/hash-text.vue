<template>
    <div>
        <n-card>
            <n-input
                v-model:value="clearText"
                type="textarea"
                placeholder="Your string..."
                :autosize="{ minRows: 3 }"
            />
            <br />
            <br />
            <n-select
                v-model:value="algo"
                :options="Object.keys(algos).map(label => ({ label, value: label }))"
            />

            <br />
            <n-input
                style="text-align: center;"
                v-model:value="hashedText"
                type="textarea"
                placeholder="Your string hash"
                :autosize="{ minRows: 1 }"
                readonly
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
            />
            <br />
            <br />
            <n-space justify="center">
                <n-button @click="copy" secondary autofocus>Copy</n-button>
            </n-space>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { ref, computed } from 'vue'
import {
    MD5,
    SHA1,
    SHA256,
    SHA224,
    SHA512,
    SHA384,
    SHA3,
    RIPEMD160,
} from 'crypto-js'

const algos = {
    MD5,
    SHA1,
    SHA256,
    SHA224,
    SHA512,
    SHA384,
    SHA3,
    RIPEMD160,
} as const;

const clearText = ref('Lorem ipsum')
const hashedText = computed(() => algos[algo.value](clearText.value))
const algo = ref<keyof typeof algos>('SHA256')

const { copy } = useCopy({ source: hashedText, text: 'Token copied to the clipboard' })
</script>

<style lang="scss" scoped>
</style>