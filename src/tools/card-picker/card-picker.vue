<script setup lang="ts">
import cards from '@younestouati/playing-cards-standard-deck';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { randIntFromInterval } from '@/utils/random';

const cardKeys = Object.keys(cards);
type CardNames = keyof typeof cards;

const numberOfCards = useQueryParamOrStorage({ name: 'cards', storageName: 'card-picker:n', defaultValue: 5 });
const [cardPicked, refreshCardPicked] = computedRefreshable(() =>
  Array.from({ length: numberOfCards.value },
    () => cardKeys[randIntFromInterval(0, 51)]));

const suitNames = {
  c: 'clubs (♣)',
  d: 'diamonds (♦)',
  h: 'hearts (♥)',
  s: 'spades (♠)',
};
const numberNames = {
  1: 'Ace',
  11: 'Jack',
  12: 'Queen',
  13: 'King',
};
function translateName(cardId: string) {
  const [, number, suit] = /(\d+)([cdhs])/.exec(cardId) || [];
  if (!number && !suit) {
    return cardId;
  }
  return `${numberNames[number as never] || number} of ${suitNames[suit as never] || suit}`;
}

const cardPickedString = computed(() => cardPicked.value.map(translateName).join(', '));

const { copy } = useCopy({ source: cardPickedString, text: 'Cards Picked copied to the clipboard' });
</script>

<template>
  <c-card>
    <div mb-2 flex justify-center>
      <img v-for="(card, index) in cardPicked" :key="index" style="width:90px" mr-1 :src="`data:image/svg+xml;base64,${cards[card as CardNames]}`">
    </div>
    <div mb-2>
      <textarea-copyable :value="cardPickedString" readonly mb-1 />
    </div>
    <div flex justify-center gap-3>
      <n-form-item label="Number of cards:" label-placement="left">
        <n-input-number v-model:value="numberOfCards" min="1" placeholder="Width of the text" />
      </n-form-item>
    </div>
    <div flex justify-center gap-3>
      <c-button @click="copy()">
        Copy deck
      </c-button>
      <c-button @click="refreshCardPicked">
        Refresh deck
      </c-button>
    </div>
  </c-card>
</template>
