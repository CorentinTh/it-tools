<script setup lang="ts">
const inputValue = ref('');
const outputValue = ref('');

function toSentenceCase(input: string) {
  return input.replace(/.+?[\.\?\!](\s|$)/g, (sentence) => {
    return sentence.charAt(0).toUpperCase() + sentence.substr(1).toLowerCase();
  });
}
function toTitleCase(input: string) {
  return input.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

function toMixedCase(input: string) {
  return input.split('').map((char, index) => {
    return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
  }).join('');
}

function toInverseCase(input: string) {
  return input.split('').map((char) => {
    return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
  }).join('');
}
function handleCaseChange(type: string) {
  switch (type) {
    case 'sentence':
      outputValue.value = toSentenceCase(inputValue.value);
      break;
    case 'upper':
      outputValue.value = inputValue.value.toUpperCase();
      break;
    case 'lower':
      outputValue.value = inputValue.value.toLowerCase();
      break;
    case 'title':
      outputValue.value = toTitleCase(inputValue.value);
      break;
    case 'mixed':
      outputValue.value = toMixedCase(inputValue.value);
      break;
    case 'inverse':
      outputValue.value = toInverseCase(inputValue.value);
      break;
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputValue" rows="3" placeholder="Enter your text..."
      multiline monospace autosize mt-5
    />
  </div>

  <div flex>
    <div flex flex-wrap gap-5>
      <c-button @click="() => handleCaseChange('sentence')">
        Sentence case
      </c-button>
      <c-button @click="() => handleCaseChange('upper')">
        UPPER CASE
      </c-button>
      <c-button @click="() => handleCaseChange('lower')">
        lower case
      </c-button>
      <c-button @click="() => handleCaseChange('title')">
        Title Case
      </c-button>
      <c-button @click="() => handleCaseChange('mixed')">
        MiXeD CaSe
      </c-button>
      <c-button @click="() => handleCaseChange('inverse')">
        iNvErSecAsE
      </c-button>
    </div>

    <div flex justify-center gap-3>
      <c-button autofocus @click="() => inputValue = ''">
        Reset
      </c-button>
    </div>
  </div>
  <div>
    <TextareaCopyable :value="outputValue" mb-1 mt-1 copy-placement="outside" />
  </div>
</template>
