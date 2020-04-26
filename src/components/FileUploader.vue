<template>
    <div
            class="drop-area pa-4 text-center"
            :class="{'drag-over':dragging }"
            @dragover.prevent
            @drop.prevent="imageDropped"
            @dragenter="dragEnter()"
            @dragend="dragEnd()"
            @dragleave="dragLeave()"
            @dragexit="dragExit()"
    >
        <p>Drag & drop a file here</p>
        <p class="or">or</p>
        <v-btn depressed>upload manually</v-btn>
        <p class="or">or</p>
        <v-text-field outlined dense label="Paste an url to the file" hide-details></v-text-field>
    </div>
</template>

<script>
    export default {
        name: "FileUploader",
        props: ['value'],
        data() {
            return {
                dragging: false,
                dragEnterCounter: 0
            }
        },
        methods: {
            imageDropped(e) {
                this.dragging = false;
                const droppedFiles = [...e.dataTransfer.files];

                if (!droppedFiles || droppedFiles.length === 0) return;

                this.$emit('input', droppedFiles[0])
            },
            dragEnter() {
                this.dragEnterCounter++;
                this.dragging = true;
            },
            dragLeave() {
                if(--this.dragEnterCounter <= 0){
                    this.dragging = false;
                }
            },
            dragEnd() {
                this.dragging = false;
            },
            dragExit() {
                this.dragging = false;
            }
        }
    }
</script>

<style lang="less">
    .drop-area {
        border: 2px dashed #363636;
        border-radius: 10px;

        & > *, .v-btn {
            margin: 0 !important;
        }

        .or {
            opacity: 0.7;
            margin: 5px 0 !important;
        }

        &.drag-over {
            border-color: #4CAF50;

        }
    }
</style>