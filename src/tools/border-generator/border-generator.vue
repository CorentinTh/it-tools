<template>
  <div class="container">
    <div class="square" :style="styleObject"></div>

    <n-card title="Border Radius and Style Editor" class="controls">
      <n-form>
        <n-form-item label="Units">
          <n-select v-model:value="unit" :options="unitOptions" @update:value="updateCSSOutput" />
        </n-form-item>

        <div class="radius-controls">
          <n-form-item label="Top Left" class="half-slider">
            <n-slider
              :min="0"
              :max="borders.topLeft.max"
              v-model:value="borders.topLeft.value"
              @update:value="updateCSSOutput"
              :step="1"
            />
            <span>{{ borders.topLeft.value + unit }}</span>
          </n-form-item>
          <n-form-item label="Top Right" class="half-slider">
            <n-slider
              :min="0"
              :max="borders.topRight.max"
              v-model:value="borders.topRight.value"
              @update:value="updateCSSOutput"
              :step="1"
            />
            <span>{{ borders.topRight.value + unit }}</span>
          </n-form-item>
        </div>
        <div class="radius-controls">
          <n-form-item label="Bottom Left" class="half-slider">
            <n-slider
              :min="0"
              :max="borders.bottomLeft.max"
              v-model:value="borders.bottomLeft.value"
              @update:value="updateCSSOutput"
              :step="1"
            />
            <span>{{ borders.bottomLeft.value + unit }}</span>
          </n-form-item>
          <n-form-item label="Bottom Right" class="half-slider">
            <n-slider
              :min="0"
              :max="borders.bottomRight.max"
              v-model:value="borders.bottomRight.value"
              @update:value="updateCSSOutput"
              :step="1"
            />
            <span>{{ borders.bottomRight.value + unit }}</span>
          </n-form-item>
        </div>
        <div class="border-controls">
          <n-form-item label="Border Width" class="border-width-slider">
            <n-slider :min="0" :max="100" v-model:value="borderWidth" @update:value="updateCSSOutput" :step="1" />
            <span>{{ borderWidth + 'px' }}</span>
          </n-form-item>
          <n-form-item label="Border Style" class="border-style-select">
            <n-select v-model:value="borderStyle" :options="borderStyles" @update:value="updateCSSOutput" />
          </n-form-item>
        </div>

        <n-form-item label="Border Color">
          <n-color-picker v-model:value="borderColor" @update:value="updateCSSOutput" />
        </n-form-item>

        <n-form-item label="CSS Properties">
          <TextareaCopyable :value="cssOutput" language="css" />
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { NSlider, NForm, NFormItem, NSelect, NCard, NColorPicker } from 'naive-ui';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { Borders } from './border-generator.service';

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
        `border: ${borderWidth.value}px ${borderStyle.value} ${borderColor.value};\nborder-radius: ${borders.value.topLeft.value}${unit.value} ${borders.value.topRight.value}${unit.value} ${borders.value.bottomRight.value}${unit.value} ${borders.value.bottomLeft.value}${unit.value};`,
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
