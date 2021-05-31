<template>
  <ToolWrapper :config="$toolConfig" no-card="true">
    <FileUploader v-model="file" />

    <div v-if="base64 || loading" class="mt-10">
      <v-card>
        <v-card-title>Result</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="base64"
            label="File in base 64"
            outlined
            readonly
            hide-details
            :loading="loading"
          />
          <div class="text-center mt-4">
            <v-btn depressed @click="copy(base64)">
              Copy base64
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </ToolWrapper>
</template>

<tool>
title: 'File to base64'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-file-link-outline'
keywords: ['file', 'base64']
path: '/file-to-base64'
</tool>

<script lang="ts">
import {Component, Watch} from 'nuxt-property-decorator'
import {CopyableMixin} from '@/mixins/copyable.mixin'
import Tool from '@/components/Tool.vue'
import FileUploader from '~/components/FileUploader.vue'

@Component({
  mixins: [CopyableMixin],
  components: {FileUploader}
})
export default class FileToBase64 extends Tool {
  file: Blob | null = null
  loading = false
  base64 = ''

  handleBase64(base64: string) {
    this.base64 = base64
    this.loading = false
  }

  @Watch('file')
  onFile() {
    if (this.file) {
      this.loading = true
      this.base64 = ''
      const reader = new FileReader()
      reader.onload = () => this.handleBase64(reader.result as string)
      reader.onerror = () => this.handleBase64('[An error as occurred]')
      reader.readAsDataURL(this.file)
    }
  }
}
</script>
