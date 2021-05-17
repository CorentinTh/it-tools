<template>
  <v-text-field
    v-model="color"
    hide-details
    class="ma-0 pa-0"
    outlined
    :label="label"
    @input="$emit('input', color)"
  >
    <template v-slot:append>
      <v-menu v-model="menu" top nudge-bottom="101" nudge-left="16" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <div :style="swatchStyle" v-on="on" />
        </template>
        <v-card>
          <v-card-text class="pa-0">
            <v-color-picker v-model="color" flat @input="$emit('input', color)" />
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator'
// Adapted from: https://codepen.io/JamieCurnow/pen/KKPjraK

@Component
export default class ColorInput extends Vue {
  @Prop({default: '#ffffff'}) readonly value!: string;
  @Prop() readonly label: string | undefined;
  menu = false
  color = ''

  created() {
    this.color = this.value
  }

  get swatchStyle() {
    return {
      backgroundColor: this.color,
      cursor: 'pointer',
      height: '30px',
      width: '30px',
      borderRadius: this.menu ? '50%' : '4px',
      transition: 'border-radius 200ms ease-in-out'
    }
  }
}
</script>

<style scoped lang="less">
::v-deep .v-input__append-inner {
  margin-top: 13px;
}
</style>
