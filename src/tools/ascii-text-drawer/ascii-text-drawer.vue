<script setup lang="ts">
import figlet from 'figlet';
// Local fallback for the Standard font to avoid network flakiness
// figlet >=1.7.0 provides importable fonts as JS modules
// This guarantees Standard works even if CDN fetch fails
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import StandardFont from 'figlet/importable-fonts/Standard.js';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const input = ref('Ascii ART');
const font = useStorage('ascii-text-drawer:font', 'Standard');
const width = useStorage('ascii-text-drawer:width', 80);
const output = ref('');
const errored = ref(false);
const processing = ref(false);

// Prefer HTTPS CDN to avoid protocol-relative issues; add a fallback CDN
const FONT_CDNS = [
  'https://unpkg.com/figlet@1.6.0/fonts/',
  'https://cdn.jsdelivr.net/npm/figlet@1.6.0/fonts/',
];
const cdnIndex = useStorage('ascii-text-drawer:cdnIndex', 0);
figlet.defaults({ fontPath: FONT_CDNS[Math.min(cdnIndex.value, FONT_CDNS.length - 1)] });

// Register the local Standard font immediately
try {
  figlet.parseFont('Standard', StandardFont);
} catch {}

function loadFigletFont(targetFont: string) {
  return new Promise<boolean>((resolve) => {
    figlet.loadFont(targetFont as figlet.Fonts, (err) => {
      resolve(!err);
    });
  });
}

async function renderAscii() {
  processing.value = true;
  const baseOptions = {
    width: Math.max(1, Number(width.value || 80)),
    whitespaceBreak: true,
  } satisfies Partial<figlet.Options>;

  let success = false;
  let rendered = '';

  // Try each CDN, and for each try the selected font then Standard as a fallback
  for (let attempt = 0; attempt < FONT_CDNS.length && !success; attempt++) {
    const idx = (cdnIndex.value + attempt) % FONT_CDNS.length;
    figlet.defaults({ fontPath: FONT_CDNS[idx] });

    const candidates = [String(font.value), 'Standard'];
    for (const candidate of candidates) {
      // If candidate is Standard, we already have it locally
      if (candidate !== 'Standard') {
        const loaded = await loadFigletFont(candidate);
        if (!loaded)
          continue;
      }

      try {
        rendered = await new Promise<string>((resolve, reject) =>
          figlet.text(String(input.value ?? ''), { ...baseOptions, font: candidate as figlet.Fonts }, (err, text) => {
            if (err)
              reject(err);
            else
              resolve(text ?? '');
          }),
        );
        // Rendering succeeded; remember the working CDN for next time
        cdnIndex.value = idx;
        success = true;
        break;
      }
      catch {
        // try next candidate
      }
    }
  }

  if (success) {
    errored.value = false;
    output.value = rendered;
  }
  else {
    errored.value = true;
    output.value = '';
  }

  processing.value = false;
}

watchEffect(() => {
  // include cdnIndex so switching CDN also triggers recompute
  void cdnIndex.value;
  void renderAscii();
});

const fonts = ['1Row', '3-D', '3D Diagonal', '3D-ASCII', '3x5', '4Max', '5 Line Oblique', 'AMC 3 Line', 'AMC 3 Liv1', 'AMC AAA01', 'AMC Neko', 'AMC Razor', 'AMC Razor2', 'AMC Slash', 'AMC Slider', 'AMC Thin', 'AMC Tubes', 'AMC Untitled', 'ANSI Shadow', 'ASCII New Roman', 'Acrobatic', 'Alligator', 'Alligator2', 'Alpha', 'Alphabet', 'Arrows', 'Avatar', 'B1FF', 'B1FF', 'Banner', 'Banner3-D', 'Banner3', 'Banner4', 'Barbwire', 'Basic', 'Bear', 'Bell', 'Benjamin', 'Big Chief', 'Big Money-ne', 'Big Money-nw', 'Big Money-se', 'Big Money-sw', 'Big', 'Bigfig', 'Binary', 'Block', 'Blocks', 'Bloody', 'Bolger', 'Braced', 'Bright', 'Broadway KB', 'Broadway', 'Bubble', 'Bulbhead', 'Caligraphy', 'Caligraphy2', 'Calvin S', 'Cards', 'Catwalk', 'Chiseled', 'Chunky', 'Coinstak', 'Cola', 'Colossal', 'Computer', 'Contessa', 'Contrast', 'Cosmike', 'Crawford', 'Crawford2', 'Crazy', 'Cricket', 'Cursive', 'Cyberlarge', 'Cybermedium', 'Cybersmall', 'Cygnet', 'DANC4', 'DOS Rebel', 'DWhistled', 'Dancing Font', 'Decimal', 'Def Leppard', 'Delta Corps Priest 1', 'Diamond', 'Diet Cola', 'Digital', 'Doh', 'Doom', 'Dot Matrix', 'Double Shorts', 'Double', 'Dr Pepper', 'Efti Chess', 'Efti Font', 'Efti Italic', 'Efti Piti', 'Efti Robot', 'Efti Wall', 'Efti Water', 'Electronic', 'Elite', 'Epic', 'Fender', 'Filter', 'Fire Font-k', 'Fire Font-s', 'Flipped', 'Flower Power', 'Four Tops', 'Fraktur', 'Fun Face', 'Fun Faces', 'Fuzzy', 'Georgi16', 'Georgia11', 'Ghost', 'Ghoulish', 'Glenyn', 'Goofy', 'Gothic', 'Graceful', 'Gradient', 'Graffiti', 'Greek', 'Heart Left', 'Heart Right', 'Henry 3D', 'Hex', 'Hieroglyphs', 'Hollywood', 'Horizontal Left', 'Horizontal Right', 'ICL-1900', 'Impossible', 'Invita', 'Isometric1', 'Isometric2', 'Isometric3', 'Isometric4', 'Italic', 'Ivrit', 'JS Block Letters', 'JS Bracket Letters', 'JS Capital Curves', 'JS Cursive', 'JS Stick Letters', 'Jacky', 'Jazmine', 'Jerusalem', 'Katakana', 'Kban', 'Keyboard', 'Knob', 'Konto Slant', 'Konto', 'LCD', 'Larry 3D 2', 'Larry 3D', 'Lean', 'Letters', 'Lil Devil', 'Line Blocks', 'Linux', 'Lockergnome', 'Madrid', 'Marquee', 'Maxfour', 'Merlin1', 'Merlin2', 'Mike', 'Mini', 'Mirror', 'Mnemonic', 'Modular', 'Morse', 'Morse2', 'Moscow', 'Mshebrew210', 'Muzzle', 'NScript', 'NT Greek', 'NV Script', 'Nancyj-Fancy', 'Nancyj-Improved', 'Nancyj-Underlined', 'Nancyj', 'Nipples', 'O8', 'OS2', 'Octal', 'Ogre', 'Old Banner', 'Patorjk\'s Cheese', 'Patorjk-HeX', 'Pawp', 'Peaks Slant', 'Peaks', 'Pebbles', 'Pepper', 'Poison', 'Puffy', 'Puzzle', 'Pyramid', 'Rammstein', 'Rectangles', 'Red Phoenix', 'Relief', 'Relief2', 'Reverse', 'Roman', 'Rot13', 'Rot13', 'Rotated', 'Rounded', 'Rowan Cap', 'Rozzo', 'Runic', 'Runyc', 'S Blood', 'SL Script', 'Santa Clara', 'Script', 'Serifcap', 'Shadow', 'Shimrod', 'Short', 'Slant Relief', 'Slant', 'Slide', 'Small Caps', 'Small Isometric1', 'Small Keyboard', 'Small Poison', 'Small Script', 'Small Shadow', 'Small Slant', 'Small Tengwar', 'Small', 'Soft', 'Speed', 'Spliff', 'Stacey', 'Stampate', 'Stampatello', 'Standard', 'Star Strips', 'Star Wars', 'Stellar', 'Stforek', 'Stick Letters', 'Stop', 'Straight', 'Stronger Than All', 'Sub-Zero', 'Swamp Land', 'Swan', 'Sweet', 'THIS', 'Tanja', 'Tengwar', 'Term', 'Test1', 'The Edge', 'Thick', 'Thin', 'Thorned', 'Three Point', 'Ticks Slant', 'Ticks', 'Tiles', 'Tinker-Toy', 'Tombstone', 'Train', 'Trek', 'Tsalagi', 'Tubular', 'Twisted', 'Two Point', 'USA Flag', 'Univers', 'Varsity', 'Wavy', 'Weird', 'Wet Letter', 'Whimsy', 'Wow'];
</script>

<template>
  <c-card style="max-width: 600px;">
    <c-input-text
      v-model:value="input"
      label="Your text:"
      placeholder="Your text to draw"
      raw-text
      multiline
      rows="4"
    />

    <n-divider />

    <n-grid cols="4" x-gap="12" w-full>
      <n-gi span="2">
        <c-select
          v-model:value="font"
          label-position="top"
          label="Font:"
          :options="fonts"
          searchable="true"
          placeholder="Select font to use"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item label="Width:" label-placement="top" label-width="100" :show-feedback="false">
          <n-input-number v-model:value="width" min="0" max="10000" w-full placeholder="Width of the text" />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-divider />

    <div v-if="processing" flex items-center justify-center>
      <n-spin size="medium" />
      <span class="ml-2">Loading font...</span>
    </div>

    <c-alert v-if="errored" mt-1 text-center type="error">
      Current settings resulted in error.
    </c-alert>

    <n-form-item v-if="!processing && !errored" label="Ascii Art text:">
      <TextareaCopyable
        :value="output"
        mb-1 mt-1
        copy-placement="outside"
      />
    </n-form-item>
  </c-card>
</template>
