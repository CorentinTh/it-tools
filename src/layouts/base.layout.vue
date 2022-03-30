<script lang="ts">
export default {
    name: 'base-layout'
}
</script>

<template>
    <div class="base-layout">
        <slot />
    </div>
</template>

<style lang="less" scoped>
.base-layout {
    width: 100%;
    min-height: 100vh;
    background-color: #f4f6fa;
}
</style>