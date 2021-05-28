<template>
  <ToolWrapper :config="$toolConfig">
    <v-row no-gutters align="center" align-content="center" justify="center">
      <v-col cols="12" sm="6" align="center">
        <v-color-picker
          v-model="rgbPicker"
          flat
          canvas-height="300"
          hide-inputs
          mode="rgba"
          @input="(v) => updateColors(v, 'picker')"
        />
      </v-col>
      <v-col cols="12" sm="6" align="center">
        <v-text-field
          ref="hex"
          outlined
          label="hex"
          :value="hex"
          :rules="rules.hex"
          append-icon="mdi-content-copy"
          @input="(v) => updateColors(v, 'hex')"
          @click:append="copy(hex)"
        />
        <v-text-field
          ref="rgb"
          outlined
          label="rgb"
          :value="rgb"
          :rules="rules.rgb"
          append-icon="mdi-content-copy"
          @input="(v) => updateColors(v, 'rgb')"
          @click:append="copy(rgb)"
        />
        <v-text-field
          ref="hsl"
          outlined
          label="hsl"
          :value="hsl"
          :rules="rules.hsl"
          append-icon="mdi-content-copy"
          @input="(v) => updateColors(v, 'hsl')"
          @click:append="copy(hsl)"
        />
        <v-combobox
          ref="keyword"
          :value="keyword"
          outlined
          label="css keyword"
          :items="colorsName"
          :rules="rules.keyword"
          no-data-text="This is not an authorized color name."
          append-icon="mdi-content-copy"
          @change="(v) => updateColors(v, 'keyword')"
          @click:append="copy(keyword)"
        />
      </v-col>
    </v-row>
  </ToolWrapper>
</template>

<tool>
title: 'Color picker/converter'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-palette'
keywords: ['rgb', 'hsl', 'hex', 'keyword', 'css', 'picker']
path: '/color-picker-converter'
</tool>

<script lang="ts">

import {Component} from 'nuxt-property-decorator'
import colors from 'color-name'
import convert from 'color-convert'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import type {VForm} from '~/types/VForm'

const required = (v: unknown) => !!v || 'A value is required'

@Component({
  mixins: [CopyableMixin]
})
export default class ColorPickerConverter extends Tool {
  rgbPicker = {
    r: 76,
    g: 175,
    b: 80
  }

  colorsName = Object.keys(colors).sort()
  valid = true
  rules = {
    hex: [
      required,
      (v: string) => /^#(?:[0-9a-fA-F]{6})$/.test(v) || 'Format should be like #112233'
    ],
    rgb: [
      required,
      (v: string) => /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(v) || 'Format should be like rgb(255, 0, 0)'
    ],
    hsl: [
      required,
      (v: string) => /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/.test(v) || 'Format should be like hsl(360, 100%, 50%)'
    ],
    keywords: [
      required,
      (v: string) => this.colorsName.includes(v) || 'Value should be from the list'
    ]
  }

  hex = '#4CAF50'
  rgb = 'rgb(76, 175, 80)'
  hsl = 'hsl(122, 39%, 49%)'
  keyword = 'mediumseagreen'

  setHSL(r: number, g: number, b: number) {
    const [h, s, l] = convert.rgb.hsl(r, g, b)
    this.hsl = `hsl(${Math.floor(h)}, ${Math.floor(s)}%, ${Math.floor(l)}%)`
  }

  setRGB(r: number, g: number, b: number) {
    this.rgb = `rgb(${r}, ${g}, ${b})`
  }

  setHEX(r: number, g: number, b: number) {
    const result = convert.rgb.hex(r, g, b)
    this.hex = `#${result}`
  }

  setKeyword(r: number, g: number, b: number) {
    this.keyword = convert.rgb.keyword(r, g, b)
  }

  updateColors(value: string, fromType: string) {
    if (fromType === 'picker' || (this.$refs[fromType] as VForm)?.validate()) {
      if (fromType === 'rgb') {
        const [r, g, b] = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)?.slice(1).map(v => parseInt(v)) ?? [0, 0, 0]
        this.rgbPicker = {r, g, b}
        this.setHEX(r, g, b)
        this.setHSL(r, g, b)
        this.setKeyword(r, g, b)
      } else if (fromType === 'hex') {
        const [r, g, b] = convert.hex.rgb(value.replace(/#/g, ''))
        this.rgbPicker = {r, g, b}
        this.setRGB(r, g, b)
        this.setHSL(r, g, b)
        this.setKeyword(r, g, b)
      } else if (fromType === 'hsl') {
        const [h, s, l] = value.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/)?.slice(1).map(v => parseInt(v)) ?? [0, 0, 0]
        // @ts-ignore
        const [r, g, b] = convert.hsl.rgb(h, s, l)
        this.rgbPicker = {r, g, b}
        this.setRGB(r, g, b)
        this.setHEX(r, g, b)
        this.setKeyword(r, g, b)
      } else if (fromType === 'keyword') {
        try {
          // @ts-ignore
          const [r, g, b] = convert.keyword.rgb(value)
          this.rgbPicker = {r, g, b}
          this.setRGB(r, g, b)
          this.setHEX(r, g, b)
          this.setHSL(r, g, b)
        } catch (ignored) {
          // ignored
        }
      } else if (fromType === 'picker') {
        const {r, g, b} = value as unknown as { r: number, g: number, b: number }
        this.setRGB(r, g, b)
        this.setHEX(r, g, b)
        this.setHSL(r, g, b)
        this.setKeyword(r, g, b)
      }
    }
  }

  mounted() {
    this.updateColors(this.hex, 'hex')
  }
}
</script>

<style scoped lang="less">
::v-deep .v-input__icon {
  height: 18px !important;
}
</style>
