<template>
  <div
    class="drop-area pa-4 text-center"
    :class="{'drag-over':dragging, 'pb-0':!loading}"
    @dragover.prevent
    @drop.prevent="imageDropped"
    @dragenter="dragEnter()"
    @dragend="dragEnd()"
    @dragleave="dragLeave()"
    @dragexit="dragExit()"
  >
    <div v-if="loading">
      <v-progress-circular
        indeterminate
        color="primary"

      />
    </div>
    <div v-else>
      <p>Drag & drop a file here</p>
      <p class="or">or</p>
      <v-btn depressed @click="manualUploadClicked">select a file</v-btn>
      <input ref="uploadInput" type="file" hidden @change="(e) => handleFiles(e.target.files[0])">

      <div v-if="allowUrl">
        <p class="or">or</p>
        <v-text-field
          ref="urlInput"
          @click:append="urlFilled(url)"
          @keypress.enter="urlFilled(url)"
          v-model="url"
          append-icon="fa-arrow-right"
          dense
          label="Paste the file url"
          outlined
          :error-messages="urlErrors"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as axios from "axios";
export default {
  name: "FileUploader",
  props: {
    allowUrl: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dragging: false,
      urlErrors: undefined,
      dragEnterCounter: 0,
      url: '',
      loading: false
    }
  },
  methods: {
    imageDropped(e) {
      this.dragging = false;
      if (e.dataTransfer.items.length > 0) {
        const item = e.dataTransfer.items[0];
        switch (item.kind) {
          case 'string':
            item.getAsString(url => this.urlFilled(url));
            break;
          case 'file':
            this.handleFiles(item.getAsFile());
            break;
        }
      }
    },
    dragEnter() {
      this.dragEnterCounter++;
      this.dragging = true;
    },
    dragLeave() {
      if (--this.dragEnterCounter <= 0) {
        this.dragging = false;
      }
    },
    async urlFilled(url) {
      if (url && url.length > 0) {
        this.loading = true;
        try {
          const {data, headers} = await axios.get(url);
          const name = url.split('/').pop();
          const file = new File([data], name, {type: headers['content-type']})
          this.handleFiles(file);
        } catch (ignored) {
          this.urlErrors = 'Incorrect url'
        }
        this.loading = false;
      }
    },
    dragEnd() {
      this.dragging = false;
    },
    dragExit() {
      this.dragging = false;
    },
    handleFiles(file) {
      if (!file) return;
      this.$emit('input', file)
    },
    manualUploadClicked() {
      this.$refs.uploadInput.click()
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
    border-color: var(--v-primary-base);
  }
  .v-input__icon {
    button {
      margin-top: 0 !important;
    }
  }
}
</style>

<!--<template>-->
<!--  <div-->
<!--    class="drop-area pa-4 text-center"-->
<!--    :class="{'drag-over':dragging, 'pb-0':!loading}"-->
<!--    @dragover.prevent-->
<!--    @drop.prevent="imageDropped"-->
<!--    @dragenter="dragEnter()"-->
<!--    @dragend="dragEnd()"-->
<!--    @dragleave="dragLeave()"-->
<!--    @dragexit="dragExit()"-->
<!--  >-->
<!--    <div v-if="loading">-->
<!--      <v-progress-circular-->
<!--        indeterminate-->
<!--        color="primary"-->
<!--      />-->
<!--    </div>-->
<!--    <div v-else>-->
<!--      <p>Drag & drop a file here</p>-->
<!--      <p class="or">-->
<!--        or-->
<!--      </p>-->
<!--      <v-btn depressed @click="manualUploadClicked">-->
<!--        select a file-->
<!--      </v-btn>-->
<!--      <input ref="uploadInput" type="file" hidden @change="(e) => handleFiles(e.target.files[0])">-->

<!--      <div v-if="allowUrl">-->
<!--        <p class="or">-->
<!--          or-->
<!--        </p>-->
<!--        <v-text-field-->
<!--          ref="urlInput"-->
<!--          v-model="url"-->
<!--          append-icon="fa-arrow-right"-->
<!--          dense-->
<!--          label="Paste the file url"-->
<!--          outlined-->
<!--          :error-messages="urlErrors"-->
<!--          @click:append="urlFilled(url)"-->
<!--          @keypress.enter="urlFilled(url)"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import {Component, Prop, Vue} from 'nuxt-property-decorator'-->

<!--@Component-->
<!--export default class FileUploader extends Vue {-->
<!--  @Prop({default: true}) readonly allowUrl!: boolean-->
<!--  dragging = false-->
<!--  urlErrors: string|null = null-->
<!--  dragEnterCounter = 0-->
<!--  url = ''-->
<!--  loading = false-->

<!--  imageDropped(e: DragEvent) {-->
<!--    this.dragging = false-->
<!--    if (e.dataTransfer.items.length > 0) {-->
<!--      const item = e.dataTransfer.items[0]-->
<!--      switch (item.kind) {-->
<!--        case 'string':-->
<!--          item.getAsString((url: string) => this.urlFilled(url))-->
<!--          break-->
<!--        case 'file':-->
<!--          this.handleFiles(item.getAsFile())-->
<!--          break-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  dragEnter() {-->
<!--    this.dragEnterCounter++-->
<!--    this.dragging = true-->
<!--  }-->

<!--  dragLeave() {-->
<!--    if (&#45;&#45;this.dragEnterCounter <= 0) {-->
<!--      this.dragging = false-->
<!--    }-->
<!--  }-->

<!--  async urlFilled(url: string) {-->
<!--    if (url && url.length > 0) {-->
<!--      this.loading = true-->
<!--      try {-->
<!--        const {data, headers} = await this.$axios.$get(url)-->
<!--        const name = url.split('/').pop()-->
<!--        const file = new File([data], name, {type: headers['content-type']})-->
<!--        this.handleFiles(file)-->
<!--      } catch (ignored) {-->
<!--        this.urlErrors = 'Incorrect url'-->
<!--      }-->
<!--      this.loading = false-->
<!--    }-->
<!--  }-->

<!--  dragEnd() {-->
<!--    this.dragging = false-->
<!--  }-->

<!--  dragExit() {-->
<!--    this.dragging = false-->
<!--  }-->

<!--  handleFiles(file: File) {-->
<!--    if (!file) {-->
<!--      return-->
<!--    }-->
<!--    this.$emit('input', file)-->
<!--  }-->

<!--  manualUploadClicked() {-->
<!--    this.$refs.uploadInput.click()-->
<!--  }-->
<!--}-->

<!--</script>-->

<!--<style lang="less">-->
<!--.drop-area {-->
<!--  border: 2px dashed rgba(255, 255, 255, 0.3);-->
<!--  border-radius: 10px;-->
<!--  background-color: rgba(255, 255, 255, 0.03);-->

<!--  & > *, .v-btn {-->
<!--    margin: 0 !important;-->
<!--  }-->

<!--  .or {-->
<!--    opacity: 0.7;-->
<!--    margin: 5px 0 !important;-->
<!--  }-->

<!--  &.drag-over {-->
<!--    border-color: var(&#45;&#45;v-primary-base);-->
<!--  }-->

<!--  .v-input__icon {-->
<!--    button {-->
<!--      margin-top: 0 !important;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
