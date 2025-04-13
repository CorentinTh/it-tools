<script setup lang="ts">
import { useCopy } from '@/composable/copy';

const str = ref('Lorem ipsum dolor sit amet DOLOR Lorem ipsum dolor sit amet DOLOR');
const findWhat = ref('');
const replaceWith = ref('');
const matchCase = ref(false);
const keepLineBreaks = ref(true);
const addLineBreakPlace = ref('before');
const addLineBreakRegex = ref('');
const splitEveryCharacterCounts = ref(0);

// Tracks the index of the currently active highlight.
const currentActiveIndex = ref(0);
// Tracks the total number of matches found to cycle through them.
const totalMatches = ref(0);

const highlightedText = computed(() => {
  const findWhatValue = findWhat.value;
  let strValue = str.value;

  if (!strValue) {
    return strValue;
  }

  if (!keepLineBreaks.value) {
    strValue = strValue.replace(/\r?\n/g, '');
  }

  if (addLineBreakRegex.value) {
    const addLBRegex = new RegExp(addLineBreakRegex.value, matchCase.value ? 'g' : 'gi');
    if (addLineBreakPlace.value === 'before') {
      strValue = strValue.replace(addLBRegex, m => `\n${m}`);
    }
    else if (addLineBreakPlace.value === 'after') {
      strValue = strValue.replace(addLBRegex, m => `${m}\n`);
    }
    else if (addLineBreakPlace.value === 'place') {
      strValue = strValue.replace(addLBRegex, '\n');
    }
  }
  if (splitEveryCharacterCounts.value) {
    strValue = strValue.replace(new RegExp(`[^\n]{${splitEveryCharacterCounts.value}}`, 'g'), m => `${m}\n`);
  }

  if (!findWhatValue) {
    return strValue;
  }

  const regex = new RegExp(findWhatValue, matchCase.value ? 'g' : 'gi');
  let index = 0;
  const newStr = strValue.replace(regex, (match) => {
    index++;
    return `<span class="${match === findWhatValue ? 'highlight' : 'outline'}">${match}</span>`;
  });

  totalMatches.value = index;
  // Reset to -1 to ensure the first match is highlighted upon next search
  currentActiveIndex.value = -1;
  return newStr;
});

// Automatically highlight the first occurrence after any change
watchEffect(async () => {
  if (highlightedText.value) {
    await nextTick();
    updateHighlighting();
  }
});

watch(matchCase, () => {
  // Use nextTick to wait for the DOM to update after highlightedText re-reaction
  nextTick().then(() => {
    const matches = document.querySelectorAll('.outline, .highlight');
    if (matches.length === 0) {
      // No matches after change, reset
      currentActiveIndex.value = -1;
      totalMatches.value = 0;
    }
    else if (matches.length <= currentActiveIndex.value || currentActiveIndex.value === -1) {
      // Current selection is out of range or reset, select the first match
      currentActiveIndex.value = 0;
      updateHighlighting(); // Ensure correct highlighting
    }
    else {
      // The current selection is still valid, ensure it's highlighted correctly
      updateHighlighting(); // This might need adjustment to not advance the index
    }
  });
});

// Function to add active highlighting
function updateHighlighting() {
  currentActiveIndex.value = (currentActiveIndex.value + 1) % totalMatches.value;
  const matches = document.querySelectorAll('.outline, .highlight');
  matches.forEach((match, index) => {
    match.className = index === currentActiveIndex.value ? 'highlight' : 'outline';
  });
}

function replaceSelected() {
  const matches = document.querySelectorAll('.outline, .highlight');
  if (matches.length > currentActiveIndex.value) {
    const selectedMatch = matches[currentActiveIndex.value];
    if (selectedMatch) {
      const newText = replaceWith.value;
      selectedMatch.textContent = newText;
      selectedMatch.classList.remove('highlight');
      currentActiveIndex.value--;
      totalMatches.value--;
    }
  }
  updateHighlighting();
}

function replaceAll() {
  const matches = document.querySelectorAll('.outline, .highlight');
  matches.forEach((match) => {
    match.textContent = replaceWith.value;
    match.classList.remove('highlight');
    match.classList.remove('outline');
  });
  currentActiveIndex.value = -1;
  totalMatches.value = matches.length;
}

function findNext() {
  updateHighlighting();
}

const { copy } = useCopy({ source: highlightedText });
</script>

<template>
  <div>
    <c-input-text v-model:value="str" raw-text placeholder="Enter text here..." label="Text to search and replace:" clearable multiline rows="10" />

    <div mt-4 w-full flex gap-10px>
      <div flex-1>
        <div>Find what:</div>
        <c-input-text v-model:value="findWhat" placeholder="Search regex" @keyup.enter="findNext()" />
      </div>
      <div flex-1>
        <div>Replace with:</div>
        <c-input-text v-model:value="replaceWith" placeholder="Replacement expression" @keyup.enter="replaceSelected()" />
      </div>
    </div>

    <n-space mt-4 gap-1 align="baseline" justify="space-between">
      <c-button @click="findNext()">
        <label>Find Next</label>
      </c-button>
      <c-button @click="replaceSelected()">
        <label>Replace</label>
      </c-button>
      <c-button @click="replaceAll()">
        <label>Replace All</label>
      </c-button>
      <n-checkbox v-model:checked="matchCase">
        <label>Match case</label>
      </n-checkbox>
      <n-checkbox v-model:checked="keepLineBreaks">
        <label>Keep linebreaks</label>
      </n-checkbox>
    </n-space>

    <n-divider />

    <div mt-4 w-full flex items-baseline gap-10px>
      <c-select
        v-model:value="addLineBreakPlace"
        :options="[{ value: 'before', label: 'Add linebreak before' }, { value: 'after', label: 'Add linebreak after' }, { value: 'place', label: 'Add linebreak in place of' }]"
      />

      <c-input-text
        v-model:value="addLineBreakRegex"
        placeholder="Split text regex"
      />
    </div>
    <div mt-4 w-full flex items-baseline gap-10px>
      <n-form-item label="Split every characters:" label-placement="left">
        <n-input-number v-model:value="splitEveryCharacterCounts" :min="0" />
      </n-form-item>
    </div>
    <c-card v-if="highlightedText" mt-60px max-w-600px flex items-center gap-5px font-mono>
      <!-- //NOSONAR --><div flex-1 break-anywhere text-wrap style="white-space: pre-wrap" v-html="highlightedText" />

      <c-button @click="copy()">
        <icon-mdi:content-copy />
      </c-button>
    </c-card>
  </div>
</template>

<style lang="less">
.highlight {
  background-color: #ff0;
  color: black;
}
</style>
