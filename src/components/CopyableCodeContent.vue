<template>
    <div class="copyable-code-content" @click="copy($slots.default[0].text)">
        <pre class="pretty-scrollbar"><slot></slot></pre>
        <v-icon>far fa-copy</v-icon>
    </div>
</template>

<script>
    import {copyable} from "../mixins/copyable.mixin";

    export default {
        name: "CopyableCodeContent",
        mixins: [copyable]
    }
</script>

<style lang="less" scoped>
    .copyable-code-content {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        padding: 8px 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        pre {
            flex: 1;
            overflow-x: auto;
        }

        .v-icon {
            opacity: 0;
        }

        &:hover {
            .v-icon {
                opacity: 1;
            }
        }
    }
</style>