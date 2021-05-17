<template>
  <ToolWrapper :config="config()">
    <v-text-field
      v-model="value"
      outlined
      label="Data"
      :rules="rules.value"
    />
    <v-slider v-model="size" min="100" max="1920" label="Size (preview will not change): " thumb-label />
    <v-select
      v-model="level"
      outlined
      :items="levels"
      label="Error resistance"
    />
    <v-row>
      <v-col cols="12" md="6" sm="12">
        <ColorInput v-model="fgColor" label="Foreground color" />
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <ColorInput v-model="bgColor" label="Background color" />
      </v-col>
    </v-row>

    <div class="text-center mt-5 mb-5">
      <qrcode-vue
        :value="value"
        :size="size"
        :level="level"
        :background="bgColor"
        :foreground="fgColor"
        render-as="svg"
        class-name="qrcode-wrapper"
      />
    </div>

    <div class="text-center mb-sm-2">
      <v-btn class="mr-1" color="primary" @click="download('png')">
        download as png
      </v-btn>
      <v-btn class="ml-1" color="primary" @click="download('svg')">
        download as svg
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import QrcodeVue from 'qrcode.vue'
import colors from 'color-name'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import type {ToolConfig} from '~/types/ToolConfig'
import {downloadBase64File} from '~/utils/file'
import {stringToBase64} from '~/utils/convert'
import ColorInput from '~/components/ColorInput.vue'

@Component({
  components: {QrcodeVue, ColorInput},
  mixins: [CopyableMixin]
})
export default class QrcodeGenerator extends Tool {
  config(): ToolConfig {
    return {
      title: 'QR-code generator',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.',
      icon: 'mdi-qrcode',
      keywords: ['editor']
    }
  }

  value = 'https://it-tools.tech'
  size = 300
  level = 'M'
  bgColor = 'transparent'
  fgColor = '#ffffff'
  levels = [
    {text: 'Low', value: 'L'},
    {text: 'Medium', value: 'M'},
    {text: 'Quartile', value: 'Q'},
    {text: 'High', value: 'H'}
  ]

  rules = {
    value: [
      (v: string) => v.length > 0 || 'Value is needed'
    ],
    color: [
      (v: string) => {
        v = v.trim()
        const isFFFFFF = /^#[0-9a-fA-F]{6}$/.test(v)
        const isFFF = /^#[0-9a-fA-F]{3}$/.test(v)
        const isRGB = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(v)
        const isHSL = /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/.test(v)
        const isKeyword = v in colors
        const isTransparent = v === 'transparent'
        return isFFFFFF || isFFF || isKeyword || isTransparent || isRGB || isHSL || 'Incorrect color.'
      }
    ]
  }

  download(type: string) {
    const svgEl = this.$el.querySelector('.qrcode-wrapper svg')!
    const svgString = new XMLSerializer().serializeToString(svgEl)
    const svgUrl = `data:image/svg+xml;base64,${stringToBase64(svgString)}`
    if (type === 'png') {
      const canvas = document.createElement('canvas')
      canvas.width = this.size
      canvas.height = this.size
      const ctx = canvas.getContext('2d')!
      const image = new Image()
      image.onload = function () {
        ctx.drawImage(image, 0, 0)
        const result = canvas.toDataURL()
        downloadBase64File(result, 'qr-code')
      }
      image.src = svgUrl
    } else {
      downloadBase64File(svgUrl, 'qr-code')
    }
  }
}

</script>

<style scoped lang="less">
::v-deep .qrcode-wrapper {
  & > * {
    width: 300px !important;
    height: 300px !important;
  }
}
</style>
