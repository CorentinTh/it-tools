<script lang="ts" setup>
import { useValidation } from '@/composable/validation';

const value = ref('value');
const valueLong = ref(
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?',
);

const validationRules = [{ message: 'Length must be > 10', validator: (value: string) => value.length > 10 }];

const validation = useValidation({
  source: value,
  rules: validationRules,
});
</script>

<template>
  <h2>Default</h2>

  <c-input-text value="qsd" />
  <c-input-text
    value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?"
  />

  <h2>With placeholder</h2>

  <c-input-text placeholder="Placeholder" />

  <h2>With label</h2>

  <c-input-text label="Label" mb-2 />
  <c-input-text label="Label" mb-2 label-position="left" />
  <c-input-text label="Label" mb-2 label-position="left" label-width="100px" />
  <c-input-text label="Label" mb-2 label-position="left" label-width="100px" label-align="right" />

  <h2>Readonly</h2>

  <c-input-text value="value" readonly />

  <h2>Disabled</h2>

  <c-input-text value="value" disabled />

  <h2>Validation</h2>

  <c-input-text v-model:value="value" :validation-rules="validationRules" mb-2 />
  <c-input-text v-model:value="value" :validation-rules="validationRules" mb-2 label-position="left" label="Yo " />
  <c-input-text v-model:value="value" :validation="validation" />
  <c-input-text v-model:value="value" :validation="validation" multiline rows="3" />

  <h2>Clearable</h2>

  <c-input-text v-model:value="value" clearable />

  <h2>Type password</h2>

  <c-input-text value="value" type="password" />

  <h2>Multiline</h2>

  <c-input-text value="value" multiline label="Label" mb-2 rows="1" />
  <c-input-text value="value" multiline label="Label" mb-2 />
  <c-input-text
    value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?"
    multiline
    mb-2
  />

  <c-input-text
    value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?"
    multiline
    clearable
  />

  <h2>Autosize</h2>

  <c-input-text v-model:value="value" label="Autosize" rows="1" multiline autosize mb-2 />
  <c-input-text v-model:value="valueLong" label="Autosize monospace" rows="1" multiline autosize monospace mb-2 />
</template>
