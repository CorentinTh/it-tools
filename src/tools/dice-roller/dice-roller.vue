<script setup lang="ts">
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const dicesNotations = useQueryParamOrStorage({ name: 'dices', storageName: 'dice-roll:dices', defaultValue: '3d6' });
const [diceRollResult, refreshDiceRollResult] = computedRefreshable(() => {
  try {
    return {
      error: '',
      roll: new DiceRoll(dicesNotations.value),
    };
  }
  catch (e: any) {
    return {
      error: e.toString(),
      roll: null,
    };
  }
});

const diceRollString = computed(() => diceRollResult.value.roll?.output || '');

const { copy } = useCopy({ source: diceRollString, text: 'Dice Roll copied to the clipboard' });
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="dicesNotations"
      label="Dice Roll Notations:" label-position="left"
      placeholder="Dice configuration"
      mb-2
    />
    <n-p mb-2>
      For more information about Dice Notation, see <n-a href="https://dice-roller.github.io/documentation/guide/notation/" target="_blank">
        here
      </n-a>
    </n-p>

    <c-alert v-if="diceRollResult.error" mb-2>
      {{ diceRollResult.error }}
    </c-alert>

    <c-card v-if="!diceRollResult.error" title="Roll Result" mb-2>
      <input-copyable :value="diceRollResult.roll?.output" readonly mb-1 />
      <input-copyable :value="diceRollResult.roll?.total" label="Total" readonly placeholder="Dice Roll total:" label-position="left" mb-1 />
    </c-card>

    <div mb-2 flex justify-center gap-3>
      <c-button @click="copy()">
        Copy roll result
      </c-button>
      <c-button @click="refreshDiceRollResult">
        Refresh roll
      </c-button>
    </div>

    <c-card v-if="!diceRollResult.error" title="Dice Notation Stats" mb-2>
      <input-copyable :value="diceRollResult.roll?.minTotal" readonly label="Min Total:" label-position="left" mb-1 />
      <input-copyable :value="diceRollResult.roll?.maxTotal" readonly label="Max Total:" label-position="left" mb-1 />
      <input-copyable :value="diceRollResult.roll?.averageTotal" readonly label="Avg Total:" label-position="left" mb-1 />
    </c-card>
  </c-card>
</template>
