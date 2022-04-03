<script lang="ts" setup>
import { SearchRound } from '@vicons/material'
import { computed, ref } from 'vue';
import { deburr } from 'lodash'
import { tools } from '@/tools';
import { useRouter } from 'vue-router';

const router = useRouter()
const queryString = ref('')

const cleanString = (s: string) => deburr(s.trim().toLowerCase())

const searchableTools = tools.map(({ name, description, keywords, path }) => ({
    searchableText: [name, description, ...keywords].map(cleanString).join(' '),
    path,
    name
}))

const options = computed(() => {
    const query = cleanString(queryString.value)

    return searchableTools
        .filter(({ searchableText }) => searchableText.includes(query))
        .map(({ name, path }) => ({ label: name, value: path }))
})

function onSelect(path: string) {
    router.push(path)
    queryString.value = ''
}

</script>

<template>
    <div>
        <n-auto-complete
            placeholder="Search a tool..."
            :options="options"
            v-model:value="queryString"
            :input-props="{ autocomplete: 'disabled' }"
            :on-select="onSelect"
        >
            <template #prefix>
                <n-icon>
                    <search-round />
                </n-icon>
            </template>
        </n-auto-complete>
    </div>
</template>


<style lang="less" scoped>
// ::v-deep(.n-input__border) {
//     border: none;
// }
</style>