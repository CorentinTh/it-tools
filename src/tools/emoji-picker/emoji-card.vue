<script setup lang="ts">
import type { EmojiInfo } from './emoji.types';
import { useCopy } from '@/composable/copy';

const props = (defineProps<{ emojiInfo: EmojiInfo }>());
const { emojiInfo } = toRefs(props);

const { copy } = useCopy();
</script>

<template>
  <c-card flex items-center gap-3 important:py-8px important:pl-10px important:pr-5px>
    <div cursor-pointer text-30px @click="copy(emojiInfo.emoji, { notificationMessage: `Emoji ${emojiInfo.emoji} copied to the clipboard` })">
      {{ emojiInfo.emoji }}
    </div>

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
        <span cursor-pointer transition hover:text-primary @click="copy(emojiInfo.codePoints, { notificationMessage: `Code points '${emojiInfo.codePoints}' copied to the clipboard` })">
          {{ emojiInfo.codePoints }}
        </span>
        <span cursor-pointer truncate transition hover:text-primary @click="copy(emojiInfo.unicode, { notificationMessage: `Unicode '${emojiInfo.unicode}' copied to the clipboard` })">
          {{ emojiInfo.unicode }}
        </span>
      </div>
    </div>
  </c-card>
</template>
