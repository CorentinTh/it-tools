<template>
    <n-card>
        <div class="port">{{ port }}</div>
        <n-space justify="center">
            <n-button @click="copy" secondary>Copy</n-button>
            <n-button @click="refreshPort" secondary>Refresh</n-button>
        </n-space>
    </n-card>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { ref } from 'vue'
import { generatePort } from './random-port-generator.model'

const port = ref('')

const { copy } = useCopy({ source: port, text: 'Port copied to the clipboard' })

function refreshPort() {
    port.value = String(generatePort())
}

refreshPort()

</script>

<style lang="less" scoped>
.port {
    text-align: center;
    font-size: 26px;
    font-weight: 400;
    margin: 10px 0 25px;
}
</style>