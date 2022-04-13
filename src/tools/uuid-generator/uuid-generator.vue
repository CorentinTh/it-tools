<template>
    <div>
        <n-card>
            <n-space align="center" justify="center">
                Quantity :
                <n-input-number v-model:value="count" :min="1" :max="50" />
            </n-space>
            <br />
            <n-input
                style="text-align: center; font-family: monospace;"
                :value="uuids"
                type="textarea"
                placeholder="Your uuids"
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
                <n-button @click="refreshUUIDs" secondary>Refresh</n-button>
            </n-space>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { ref, watch } from 'vue'
import { v4 as generateUUID } from 'uuid';

const count = ref(1)

const uuids = ref('')

function refreshUUIDs() {
    uuids.value = Array.from({ length: count.value }, () => generateUUID()).join('\n')
}

watch([count], refreshUUIDs)

const { copy } = useCopy({ source: uuids, text: 'UUIDs copied to the clipboard' })

refreshUUIDs()
</script>

<style lang="less" scoped>
</style>