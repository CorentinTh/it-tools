<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const prompt = ref<string>('');
const characterLimit = ref<number>(15000);
const characterLimitInput = ref<number>(characterLimit.value);
const splitPrompts = ref<string[]>([]); // Array to store the split prompts
const formattedPrompt = ref<string>(''); // To store the entire formatted prompt
const clickedParts = ref<boolean[]>([]); // Array to keep track of which parts have been clicked

// Watch for changes to characterLimitInput and update characterLimit
watch(characterLimitInput, (newLimit) => {
  characterLimit.value = newLimit;
});

// Computed property to get the current length of the prompt
const promptLength = computed(() => prompt.value.length);

// Function to split the prompt into parts considering START and END
function splitPrompt(): void {
  const sentences = prompt.value.split(/(?<=[.!?])\s+|\n/); // Split sentences using punctuation or new lines
  const splitPromptsArray: string[] = [];
  let currentSplit = '';
  let currentLength = 0;
  const numberOfParts = Math.ceil(prompt.value.length / characterLimit.value); // Calculate the total number of parts

  sentences.forEach((sentence: string) => {
    const sentenceLength = sentence.length;

    // Calculate the exact lengths for [START PART X/Y] and [END PART X/Y]
    const partIndex = splitPromptsArray.length + 1;
    const startTagLength = `[START PART ${partIndex}/${numberOfParts}]`.length;
    const endTagLength = `[END PART ${partIndex}/${numberOfParts}]`.length;
    const totalTagLength = startTagLength + endTagLength + 2; // +2 for newlines between start/end

    // Check if adding this sentence would exceed the character limit
    if (currentLength + sentenceLength + totalTagLength > characterLimit.value) {
      // Push the current split, trim spaces, and reset the current split and length
      splitPromptsArray.push(currentSplit.trim());
      currentSplit = '';
      currentLength = 0;
    }

    currentSplit += `${sentence} `; // Add the sentence to the current split
    currentLength += sentenceLength + 1; // Account for sentence length and a space
  });

  // Push any remaining text in the last split
  if (currentSplit.length > 0) {
    splitPromptsArray.push(currentSplit.trim());
  }

  // Set the split prompts array
  splitPrompts.value = splitPromptsArray;
  clickedParts.value = Array(splitPrompts.value.length).fill(false); // Reset clicked parts on split
  formattedPrompt.value = generateFormattedPrompt(); // Update the formatted prompt for display
}

// Function to generate the complete formatted prompt with [START] and [END]
function generateFormattedPrompt(): string {
  const numberOfParts = splitPrompts.value.length;
  let formatted = `The content I need to share is too large to send in a single message.

To make it manageable, I will break it into parts:

[START PART 1/${numberOfParts}]
this is the content of the part 1 out of ${numberOfParts} in total
[END PART 1/${numberOfParts}]

Please reply with: "Received part 1/${numberOfParts}"

Once I say 'ALL PARTS SENT,' you can start processing my requests.\n\n`;

  // Append all split parts with [START] and [END] sections
  splitPrompts.value.forEach((split, index) => {
    const partIndex = index + 1;
    formatted += `[START PART ${partIndex}/${numberOfParts}]
${split}
[END PART ${partIndex}/${numberOfParts}]\n\n`;
  });

  return formatted;
}

// Function to copy a specific prompt part to the clipboard
function copyToClipboard(part: string, index: number) {
  const numberOfParts = splitPrompts.value.length;
  const start = `[START PART ${index + 1}/${numberOfParts}]`;
  const end = `[END PART ${index + 1}/${numberOfParts}]`;
  const fullText = `${start}\n${part}\n${end}`;

  navigator.clipboard.writeText(fullText).then(() => {
    clickedParts.value[index] = true; // Mark the button as clicked
  }).catch((err) => {
    console.error('Failed to copy: ', err);
  });
}

// Function to copy the initial instructions to the clipboard
function copyInstructions() {
  const numberOfParts = splitPrompts.value.length;
  const initialInstructions = `The content I need to share is too large to send in a single message.

To make it manageable, I will break it into parts:

[START PART 1/${numberOfParts}]
this is the content of the part 1 out of ${numberOfParts} in total
[END PART 1/${numberOfParts}]

Please reply with: "Received part 1/${numberOfParts}"

Once I say 'ALL PARTS SENT,' you can start processing my requests.`;

  navigator.clipboard.writeText(initialInstructions).then(() => {
  }).catch((err) => {
    console.error('Failed to copy instructions: ', err);
  });
}

// Function to copy the full prompt to the clipboard
function copyFullPrompt() {
  const initialPrompt = formattedPrompt.value;
  navigator.clipboard.writeText(initialPrompt).then(() => {
  }).catch((err) => {
    console.error('Failed to copy initial prompt: ', err);
  });
}

// Function to copy the final command to the clipboard
function copyFinalCommand() {
  const finalCommand = 'ALL PARTS SENT';
  navigator.clipboard.writeText(finalCommand).then(() => {
  }).catch((err) => {
    console.error('Failed to copy final command: ', err);
  });
}

// Computed property for potential number of splits based on the current prompt
const numberOfSplits = computed(() => {
  const sentences = prompt.value.split(/(?<=[.!?])\s+|\n/);
  let currentLength = 0;
  let splits = 0;
  const numberOfParts = Math.ceil(prompt.value.length / characterLimit.value);

  sentences.forEach((sentence: string) => {
    const sentenceLength = sentence.length;
    const partIndex = splits + 1;
    const startTagLength = `[START PART ${partIndex}/${numberOfParts}]`.length;
    const endTagLength = `[END PART ${partIndex}/${numberOfParts}]`.length;
    const totalTagLength = startTagLength + endTagLength + 2; // +2 for newlines

    if (currentLength + sentenceLength + totalTagLength > characterLimit.value) {
      splits++; // Increment split count if exceeding limit
      currentLength = 0; // Reset length for new split
    }

    currentLength += sentenceLength + 1; // Update length
  });

  if (currentLength > 0) {
    splits++; // Add an additional split for remaining text
  }

  return splits;
});

// Computed property for formatted prompt display inside c-input-text
const formattedPromptDisplay = computed(() => {
  if (splitPrompts.value.length > 0) {
    return formattedPrompt.value.replace(/\n/g, '\n'); // Display formatted with line breaks
  }
  return '';
});

// Clear prompt function
function clearPrompt(): void {
  prompt.value = '';
  splitPrompts.value = []; // Clear the split prompts as well
  formattedPrompt.value = ''; // Clear the formatted prompt
  clickedParts.value = []; // Reset clicked parts
}

// Method to restrict character limit input to numbers only
function handleCharacterLimitInput(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Control', 'Alt',
    'Meta', 'Shift', 'Enter', 'Escape', 'Delete', 'Home', 'End', 'PageUp', 'PageDown'];
  if (!allowedKeys.includes(event.key) && (event.key < '0' || event.key > '9')) {
    event.preventDefault();
  }
}
</script>

<template>
  <c-card>
    <!-- Character Limit Input -->
    <n-form-item label="Character Limit">
      <n-input-number
        v-model:value="characterLimitInput"
        :min="1"
        :input-default="characterLimit"
        test-id="characterLimitInput"
        placeholder="Set character limit..."
        @keydown="handleCharacterLimitInput"
      />
    </n-form-item>

    <!-- Prompt Input with Character Length -->
    <c-input-text
      v-model:value="prompt"
      :label="`Prompt Content (Length: ${promptLength}):`"
      placeholder="Enter your prompt here..."
      rows="15"
      multiline
      test-id="promptInput"
      raw-text
      mb-3
    />
    <!-- Clear and Split Buttons under Full Prompt Label -->
    <div style="display: flex; justify-content: space-between; margin-top: 5px;">
      <c-button @click="splitPrompt">
        Split ({{ numberOfSplits }})
      </c-button>
      <c-button @click="clearPrompt">
        Clear
      </c-button>
    </div>
  </c-card>

  <!-- Split Prompts and Initial Prompt inside c-input-text -->
  <c-card :label="`Split Prompts (${numberOfSplits})`">
    <c-input-text
      :label="`Split Prompts (${numberOfSplits})`"
      :value="formattedPromptDisplay"
      placeholder="Your formatted prompt will display here..."
      rows="18"
      multiline
      test-id="splitPromptDisplay"
      raw-text
    />

    <!-- Copy Instructions, Full Prompt, and Final Command buttons -->
    <div class="copy-commands-buttons">
      <c-button @click="copyInstructions">
        Copy Instructions
      </c-button>
      <c-button float-right @click="copyFullPrompt">
        Copy Full Prompt
      </c-button>
      <c-button @click="copyFinalCommand">
        Copy Final Command
      </c-button>
    </div>

    <!-- Buttons for copying split prompts in a grid layout -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 10px;">
      <div v-for="(split, index) in splitPrompts" :key="index">
        <c-button
          style="width: 120px; height: 50px; text-align: center;"
          :class="{ 'button-clicked': clickedParts[index] }"
          @click="copyToClipboard(split, index)"
        >
          Copy Part {{ index + 1 }}
        </c-button>
      </div>
    </div>
  </c-card>
</template>

<style scoped>
.button-clicked {
  background-color: #229C60;
  color: #000;
}

.copy-commands-buttons {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}
</style>
