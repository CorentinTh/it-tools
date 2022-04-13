<template>
    <n-space item-style="flex:1">
        <n-card title="Encode">
            <n-form-item label="Your string :" :feedback="encodedValidation.message"
                :validation-status="encodedValidation.status">
                <n-input v-model:value="encodeInput" type="textarea" placeholder="The string to encode"
                    :autosize="{ minRows: 3 }" />
            </n-form-item>

            <n-form-item label="Your string encoded :">
                <n-input :value="encodeOutput" type="textarea" readonly placeholder="Your string encoded"
                    :autosize="{ minRows: 3 }" />
            </n-form-item>

            <n-space justify="center">
                <n-button @click="copyEncoded" secondary>Copy</n-button>
            </n-space>
        </n-card>
        <n-card title="Encode">
            <n-form-item label="Your encode string :" :feedback="decodeValidation.message"
                :validation-status="decodeValidation.status">
                <n-input v-model:value="decodeInput" type="textarea" placeholder="The string to decode"
                    :autosize="{ minRows: 3 }" />
            </n-form-item>

            <n-form-item label="Your string decoded :">
                <n-input :value="decodeOutput" type="textarea" readonly placeholder="Your string decoded"
                    :autosize="{ minRows: 3 }" />
            </n-form-item>

            <n-space justify="center">
                <n-button @click="copyDecoded" secondary>Copy</n-button>
            </n-space>
        </n-card>
    </n-space>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { computed, ref } from 'vue'

const encodeInput = ref('Hello world :)')
const encodeOutput = computed(() => {
    try {
        return encodeURIComponent(encodeInput.value)
    } catch (_) {
        return ''
    }
})

const encodedValidation = useValidation({
    source: encodeInput, rules: [{
        validator: (value) => {
            try {
                encodeURIComponent(value)
                return true
            } catch (_) {
                return false
            }
        },
        message: 'Impossible to parse this string'
    }]
})

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: 'Encoded string copied to the clipboard' })


const decodeInput = ref('Hello%20world%20%3A)')

const decodeOutput = computed(() => {
    try {
        return decodeURIComponent(decodeInput.value)
    } catch (_) {
        return ''
    }
})

const decodeValidation = useValidation({
    source: encodeInput, rules: [{
        validator: (value) => {
            try {
                decodeURIComponent(value)
                return true
            } catch (_) {
                return false
            }
        },
        message: 'Impossible to parse this string'
    }]
})

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: 'Decoded string copied to the clipboard' })



</script>

<style lang="less" scoped>
</style>