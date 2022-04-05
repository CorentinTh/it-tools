<script setup lang="ts">

</script>

<template>
    <div class="e404-wrapper">
        <n-result
            status="404"
            title="404 Not Found"
            description="Sorry, this page does not seem to extist"
        >
            <template #footer>
                <router-link to="/" #="{ navigate, href }" custom>
                    <n-button
                        tag="a"
                        :href="href"
                        secondary
                        @click="navigate"
                        type="success"
                    >Back home</n-button>
                </router-link>
            </template>
        </n-result>
    </div>
</template>


<style scoped>
.e404-wrapper {
    padding-top: 150px;
}
</style>