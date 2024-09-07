<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { NCard, NColorPicker, NForm, NFormItem, NSelect, NSlider } from 'naive-ui';
import type { Borders } from './border-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

export default defineComponent({
  name: 'BorderRadiusViewer',
  components: {
    NSlider,
    NForm,
    NFormItem,
    NSelect,
    NCard,
    NColorPicker,
    TextareaCopyable,
  },
  setup() {
    const borders = ref<Borders>({
      topLeft: { label: 'Top Left', value: 0, max: 100 },
      topRight: { label: 'Top Right', value: 0, max: 100 },
      bottomLeft: { label: 'Bottom Left', value: 0, max: 100 },
      bottomRight: { label: 'Bottom Right', value: 0, max: 100 },
    });
    const unit = ref('px');
    const borderWidth = ref<number>(0);
    const borderStyle = ref('solid');
    const borderColor = ref('#000000');
    const unitOptions = [
      { label: 'Pixels (px)', value: 'px' },
      { label: 'Percentage (%)', value: '%' },
    ];
    const borderStyles = [
      { label: 'Solid', value: 'solid' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Dotted', value: 'dotted' },
      { label: 'Double', value: 'double' },
      { label: 'Groove', value: 'groove' },
      { label: 'Ridge', value: 'ridge' },
      { label: 'Inset', value: 'inset' },
      { label: 'Outset', value: 'outset' },
      { label: 'None', value: 'none' },
    ];
    const styleObject = computed(() => ({
      border: `${borderWidth.value}px ${borderStyle.value} ${borderColor.value}`,
      borderRadius: `${borders.value.topLeft.value}${unit.value} ${borders.value.topRight.value}${unit.value} ${borders.value.bottomRight.value}${unit.value} ${borders.value.bottomLeft.value}${unit.value}`,
    }));

    const cssOutput = computed(
      () =>
        `border: ${borderWidth.value}px ${borderStyle.value} ${borderColor.value};
border-radius: ${borders.value.topLeft.value}${unit.value} ${borders.value.topRight.value}${unit.value} ${borders.value.bottomRight.value}${unit.value} ${borders.value.bottomLeft.value}${unit.value};`,
    );

    function updateCSSOutput() {
      // Forces update computed properties
    }

    return {
      borders,
      unit,
      borderWidth,
      borderStyle,
      borderColor,
      unitOptions,
      borderStyles,
      cssOutput,
      updateCSSOutput,
      styleObject,
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="square" :style="styleObject" />

    <NCard title="Border Radius and Style Editor" class="controls">
      <NForm>
        <NFormItem label="Units">
          <NSelect v-model:value="unit" :options="unitOptions" @update:value="updateCSSOutput" />
        </NFormItem>

        <div class="radius-controls">
          <NFormItem label="Top Left" class="half-slider">
            <NSlider
              v-model:value="borders.topLeft.value"
              :min="0"
              :max="borders.topLeft.max"
              :step="1"
              @update:value="updateCSSOutput"
            />
            <span>{{ borders.topLeft.value + unit }}</span>
          </NFormItem>
          <NFormItem label="Top Right" class="half-slider">
            <NSlider
              v-model:value="borders.topRight.value"
              :min="0"
              :max="borders.topRight.max"
              :step="1"
              @update:value="updateCSSOutput"
            />
            <span>{{ borders.topRight.value + unit }}</span>
          </NFormItem>
        </div>
        <div class="radius-controls">
          <NFormItem label="Bottom Left" class="half-slider">
            <NSlider
              v-model:value="borders.bottomLeft.value"
              :min="0"
              :max="borders.bottomLeft.max"
              :step="1"
              @update:value="updateCSSOutput"
            />
            <span>{{ borders.bottomLeft.value + unit }}</span>
          </NFormItem>
          <NFormItem label="Bottom Right" class="half-slider">
            <NSlider
              v-model:value="borders.bottomRight.value"
              :min="0"
              :max="borders.bottomRight.max"
              :step="1"
              @update:value="updateCSSOutput"
            />
            <span>{{ borders.bottomRight.value + unit }}</span>
          </NFormItem>
        </div>
        <div class="border-controls">
          <NFormItem label="Border Width" class="border-width-slider">
            <NSlider v-model:value="borderWidth" :min="0" :max="100" :step="1" @update:value="updateCSSOutput" />
            <span>{{ `${borderWidth}px` }}</span>
          </NFormItem>
          <NFormItem label="Border Style" class="border-style-select">
            <NSelect v-model:value="borderStyle" :options="borderStyles" @update:value="updateCSSOutput" />
          </NFormItem>
        </div>

        <NFormItem label="Border Color">
          <NColorPicker v-model:value="borderColor" @update:value="updateCSSOutput" />
        </NFormItem>

        <NFormItem label="CSS Properties">
          <TextareaCopyable :value="cssOutput" language="css" />
        </NFormItem>
      </NForm>
    </NCard>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.square {
  width: 250px;
  height: 250px;
  background-color: #f3f3f3;
}

.controls {
  width: 100%;
}

.radius-controls,
.border-controls {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}

.half-slider,
.border-width-slider {
  position: relative;
  padding: 10px 0;
  width: 60%;
}

.half-slider span,
.border-width-slider span {
  position: absolute;
  right: 0;
  top: 30px;
  background-color: #fff;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 0.9em;
  color: #333;
}

.border-style-select {
  width: 30%;
}

n-slider {
  width: calc(100% - 60px);
}

.controls .n-form-item__label {
  min-width: 70px;
  text-align: right;
}

n-select,
n-color-picker {
  width: 100%;
}
</style>
