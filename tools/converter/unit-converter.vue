<template>
  <ToolWrapper :config="$toolConfig">
    <v-select
      v-model="category"
      outlined
      label="Measurement type"
      :items="categoryList"
      dense
      @input="onMeasurementChanged"
    />

    <v-row>
      <v-col cols="12" sm="6" class="input-group">
        <v-text-field v-model.number="inputValue" outlined label="Input number" hide-details :suffix="inputUnit" />
        <v-select
          v-model="inputUnit"
          outlined
          placeholder="Unit"
          dense
          :items="unitList"
        />
      </v-col>
      <v-col cols="12" sm="6" class="input-group">
        <v-text-field
          v-model="outputValue"
          outlined
          label="Output number"
          hide-details
          readonly
          :suffix="outputUnit"
        />
        <v-select
          v-model="outputUnit"
          outlined
          placeholder="Unit"
          dense
          :items="unitList"
        />
      </v-col>
    </v-row>
    Best : <strong>{{ best.val }} {{ best.unit }}</strong> ({{ best.singular }})
  </ToolWrapper>
</template>

<tool>
title: 'Unit converter'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-numeric'
keywords: [ ]
path: '/unit-converter'
</tool>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import convert from 'convert-units'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import {capitalise} from '~/utils/string'

const formatItemsReadable = (value: string) => ({text: capitalise(value), value})

@Component({
  mixins: [CopyableMixin]
})
export default class UnitConverter extends Tool {
  categoryList = convert().measures().map(formatItemsReadable)
  category: string = 'volume'
  inputValue: number = 3.14
  unitList: { value: string, text: string }[] = []
  inputUnit = 'cm3'
  outputUnit = 'l'

  created() {
    this.onMeasurementChanged()
  }

  get outputValue() {
    // @ts-ignore because of shitting typing definition in convert-units
    return convert(this.inputValue).from(this.inputUnit).to(this.outputUnit)
  }

  get best() {
    // @ts-ignore because of shitting typing definition in convert-units
    return convert(this.inputValue).from(this.inputUnit).toBest()
  }

  onMeasurementChanged() {
    // @ts-ignore because of shitting typing definition in convert-units
    const list: { abbr: string, singular: string }[] = convert().list(this.category)

    this.unitList = list.map(({abbr, singular}) => ({value: abbr, text: `${singular} (${abbr})`}))
    this.inputUnit = list[0].abbr
    this.outputUnit = list[1].abbr
  }
}

</script>

<style lang="less" scoped>
.input-group {
  .v-text-field--outlined:first-child {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .v-text-field--outlined:last-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
