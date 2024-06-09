<script lang="ts" setup>
// import {AllFontNames,AllOptions, bold,italic,monospace,strikethrough,underline,superscript,subscript,formatSelections} from './unicod'
import { Copy } from '@vicons/tabler';
import type { AllFontNames, AllOptions } from './unicode-formatter.service';
import { formatSelection } from './unicode-formatter.service';

import { useCopy } from '@/composable/copy';

const textArea = ref<HTMLTextAreaElement>();
function formatTextAreaSelection(format: AllFontNames | undefined, options: AllOptions) {
  if (!textArea.value) {
    return;
  }
  formatSelection(textArea.value, format, options);
}

const formattedText = ref('Type your text here and 𝗳𝗼𝗿𝗺𝗮𝘁 it by highlighting the text you want to format and clicking one of the buttons above. Click "More fonts" to show more Unicode fonts. The eraser button will convert your selection back to normal text.');

const { copy: copyFormattedText } = useCopy({ source: formattedText, text: 'Formatted text copied to the clipboard' });
</script>

<template>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">

  <div
    max-w-600
    style="font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
  >
    <!-- First set of buttons -->
    <n-form-item label="Fonts:" mb-3 mt-3 w-full>
      <n-button title="Normal" @click="formatTextAreaSelection('normal', { clear: true })">
        <!-- Eraser Icon -->
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.586,15.408l4.299,4.299C7.072,19.895,7.326,20,7.592,20h0.001h2h0.4h9.6v-2h-6.958l7.222-7.222 c0.78-0.779,0.78-2.049,0-2.828L14.906,3c-0.779-0.779-2.049-0.779-2.828,0l-4.75,4.749l-4.754,4.843 C1.809,13.371,1.813,14.634,2.586,15.408z M13.492,4.414l4.95,4.95l-2.586,2.586L10.906,7L13.492,4.414z M8.749,9.156l0.743-0.742 l4.95,4.95l-4.557,4.557C9.86,17.946,9.838,17.973,9.816,18H9.593H8.006l-4.005-4.007L8.749,9.156z" />
        </svg>
      </n-button>
      <n-button title="Bold" @click="formatTextAreaSelection('sansBold', { })">
        𝗕
      </n-button>
      <n-button title="Italic" @click="formatTextAreaSelection('sansItalic', { })">
        𝘐
      </n-button>
      <n-button title="Monospace" @click="formatTextAreaSelection('monospace', { })">
        𝙼
      </n-button>
      <n-button style="text-decoration: underline" @click="formatTextAreaSelection(undefined, { append: '͟' })">
        U
      </n-button>
      <n-button style="text-decoration: line-through" @click="formatTextAreaSelection(undefined, { append: '̶' })">
        S
      </n-button>
    </n-form-item>

    <!-- Collapsible section with more buttons -->
    <details style="display:block" borders mb-3 w-full>
      <summary>More fonts</summary>
      <n-space mt-3 w-full>
        <n-button title="Math Sans" @click="formatTextAreaSelection('sans', { })">
          𝖬
        </n-button>
        <n-button title="Sans Bold italic" @click="formatTextAreaSelection('sansBoldItalic', { })">
          𝘽𝙄
        </n-button>
        <n-button title="Serif bold" @click="formatTextAreaSelection('serifBold', { })">
          𝐁
        </n-button>
        <n-button title="Serif italic" @click="formatTextAreaSelection('serifItalic', { })">
          𝐼
        </n-button>
        <n-button title="Serif bold italic" @click="formatTextAreaSelection('serifBoldItalic', { })">
          𝑩𝑰
        </n-button>
        <n-button title="Double Underline" @click="formatTextAreaSelection(undefined, { append: '̳' })">
          U̳
        </n-button>
        <n-button title="Short Strikethrough" style="text-decoration: line-through" @click="formatTextAreaSelection(undefined, { append: '̵' })">
          S̵
        </n-button>
        <n-button title="Math double-struck" @click="formatTextAreaSelection('doubleStruck', { })">
          𝔻
        </n-button>
        <n-button title="Fullwidth" @click="formatTextAreaSelection('fullwidth', { })">
          Ｆ
        </n-button>
        <n-button title="Math Fraktur" @click="formatTextAreaSelection('fraktur', { })">
          𝔉
        </n-button>
        <n-button title="Math Fraktur bold" @click="formatTextAreaSelection('boldFraktur', { })">
          𝕱
        </n-button>
        <n-button title="Script" @click="formatTextAreaSelection('script', { })">
          𝒮
        </n-button>
        <n-button title="Bold script" @click="formatTextAreaSelection('boldScript', { })">
          𝓢
        </n-button>
        <n-button title="Circled" @click="formatTextAreaSelection('circled', { })">
          Ⓒ
        </n-button>
        <n-button title="Circled negative" @click="formatTextAreaSelection('circledNegative', { })">
          🅒
        </n-button>
        <n-button title="Squared" @click="formatTextAreaSelection('squared', { })">
          🅂
        </n-button>
        <n-button title="Squared negative" @click="formatTextAreaSelection('squaredNegative', { })">
          🆂
        </n-button>
        <n-button title="Parenthesized" @click="formatTextAreaSelection('parenthesized', { })">
          ⒫
        </n-button>
        <n-button title="Small caps" @click="formatTextAreaSelection('smallCaps', { })">
          Aʙ
        </n-button>
        <n-button title="Subscript" @click="formatTextAreaSelection('subscript', { })">
          ₛᵤᵦ
        </n-button>
        <n-button title="Superscript" @click="formatTextAreaSelection('superscript', { })">
          ˢᵘᵖ
        </n-button>
        <n-button title="Inverted" @click="formatTextAreaSelection('inverted', { })">
          ∀
        </n-button>
        <n-button title="Rotated Left" @click="formatTextAreaSelection('rotatedLeft', { })">
          ᗉ
        </n-button>
        <n-button title="Rotated Right" @click="formatTextAreaSelection('rotatedRight', { })">
          ᗆ
        </n-button>
        <n-button title="Mirrored" @click="formatTextAreaSelection('mirrored', { })">
          Я
        </n-button>
        <n-button title="Reverse" @click="formatTextAreaSelection(undefined, { reverse: true })">
          <!-- Left/Right Arrow Icon -->
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z" />
          </svg>
        </n-button>
        <n-button title="Inverted Reverse" @click="formatTextAreaSelection('inverted', { reverse: true })">
          ∀
          <!-- Left/Right Arrow Icon -->
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M377.941 169.941V216H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.568 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296h243.882v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.568 0-33.941l-86.059-86.059c-15.119-15.12-40.971-4.412-40.971 16.97z" />
          </svg>
        </n-button>
        <n-button title="Rotated Right Reverse" @click="formatTextAreaSelection('rotatedRight', { reverse: true })">
          ᗆ
          <!-- Left/Right Arrow Icon -->
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M377.941 169.941V216H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.568 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296h243.882v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.568 0-33.941l-86.059-86.059c-15.119-15.12-40.971-4.412-40.971 16.97z" />
          </svg>
        </n-button>
        <n-button title="Mirrored Reverse" @click="formatTextAreaSelection('mirrored', { reverse: true })">
          Я
          <!-- Left/Right Arrow Icon -->
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M377.941 169.941V216H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.568 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296h243.882v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.568 0-33.941l-86.059-86.059c-15.119-15.12-40.971-4.412-40.971 16.97z" />
          </svg>
        </n-button>
      </n-space>
    </details>

    <textarea
      ref="textArea" :value="formattedText" rows="12" mb-3 mt-3 w-full
      spellcheck="false"
      style="font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
    />

    <div text-center>
      <c-button @click="copyFormattedText()">
        <n-icon size="22">
          <Copy />
        </n-icon>
      </c-button>
    </div>
  </div>
</template>
