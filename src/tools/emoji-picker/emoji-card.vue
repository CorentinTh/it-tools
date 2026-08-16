<script setup lang="ts">
import type { EmojiInfo } from './emoji.types';
import { useCopy } from '@/composable/copy';

const props = withDefaults(defineProps<{
  emojiInfo: EmojiInfo
  position?: number
  total?: number
  virtualIndex?: number
}>(), {
  position: undefined,
  total: undefined,
  virtualIndex: undefined,
});
const { emojiInfo } = toRefs(props);

const { copy } = useCopy();
</script>

<template>
  <c-card
    role="listitem"
    :aria-posinset="position"
    :aria-setsize="total"
    data-test-id="emoji-card"
    flex items-center gap-3 important:py-8px important:pl-10px important:pr-5px
  >
    <button
      type="button"
      :data-emoji-index="virtualIndex"
      :aria-label="`Copy ${emojiInfo.title} emoji`"
      class="emoji-copy-button"
      text-30px
      @click="copy(emojiInfo.emoji, { notificationMessage: `Emoji ${emojiInfo.emoji} copied to the clipboard` })"
    >
      {{ emojiInfo.emoji }}
    </button>

    <div min-w-0 flex-1>
      <div truncate font-bold>
        {{ emojiInfo.title }}
      </div>

      <!-- <div>
        <c-link>
          {{ emojiInfo.codePoints }}
        </c-link>
      </div>
      <div />
      <div rounded op-70>
        Unicode:  <span border="1px solid current op-30" b-rd-xl px-12px py-4px>{{ emojiInfo.unicode }}</span>
      </div> -->

      <div flex gap-2 text-xs font-mono op-70>
        <button
          type="button"
          :aria-label="`Copy code points for ${emojiInfo.title}`"
          class="emoji-copy-button"
          transition hover:text-primary
          @click="copy(emojiInfo.codePoints, { notificationMessage: `Code points '${emojiInfo.codePoints}' copied to the clipboard` })"
        >
          {{ emojiInfo.codePoints }}
        </button>
        <button
          type="button"
          :aria-label="`Copy Unicode escape for ${emojiInfo.title}`"
          class="emoji-copy-button"
          truncate transition hover:text-primary
          @click="copy(emojiInfo.unicode, { notificationMessage: `Unicode '${emojiInfo.unicode}' copied to the clipboard` })"
        >
          {{ emojiInfo.unicode }}
        </button>
      </div>
    </div>
  </c-card>
</template>

<style scoped>
.emoji-copy-button {
  appearance: none;
  border: 0;
  padding: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.emoji-copy-button:focus-visible {
  border-radius: 2px;
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
