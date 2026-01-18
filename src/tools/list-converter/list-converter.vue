<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { ArrowLeft, ArrowRight, Copy } from '@vicons/tabler';
import { convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';
import { useCopy } from '@/composable/copy';
import { useTheme as useInputTheme } from '@/ui/c-input-text/c-input-text.theme';
import { useAppTheme } from '@/ui/theme/themes';

const sortOrderOptions = [
  {
    label: 'Sort ascending',
    value: 'asc',
    disabled: false,
  },
  {
    label: 'Sort descending',
    value: 'desc',
    disabled: false,
  },
];

const conversionConfig = useStorage<ConvertOptions>('list-converter:conversionConfig', {
  direction: 'column-to-list',
  lowerCase: false,
  trimItems: true,
  removeDuplicates: true,
  keepLineBreaks: false,
  itemPrefix: '',
  itemSuffix: '',
  listPrefix: '',
  listSuffix: '',
  reverseList: false,
  sortList: null,
  separator: ', ',
});

if (!conversionConfig.value.direction) {
  conversionConfig.value.direction = 'column-to-list';
}

const columnsInput = ref('');
const listInput = ref('');
const columnsTextarea = ref<HTMLTextAreaElement | null>(null);
const listTextarea = ref<HTMLTextAreaElement | null>(null);

const columnScrollTop = ref(0);
const listScrollTop = ref(0);

const columnLineNumbers = computed(() => getLineNumbers(columnsInput.value));
const listLineNumbers = computed(() => getLineNumbers(listInput.value));

const inputTheme = useInputTheme();
const appTheme = useAppTheme();
const { copy: copyColumns } = useCopy({ source: columnsInput, text: 'Columns copied to clipboard' });
const { copy: copyList } = useCopy({ source: listInput, text: 'List copied to clipboard' });

function getLineNumbers(value: string) {
  const lineCount = Math.max(1, value.split(/\r?\n/).length);
  return Array.from({ length: lineCount }, (_, index) => index + 1);
}

function onColumnScroll(event: Event) {
  columnScrollTop.value = (event.target as HTMLTextAreaElement).scrollTop;
}

function onListScroll(event: Event) {
  listScrollTop.value = (event.target as HTMLTextAreaElement).scrollTop;
}

function convertColumnsToList() {
  listInput.value = convert(columnsInput.value, {
    ...conversionConfig.value,
    direction: 'column-to-list',
  });
  nextTick(() => {
    if (listTextarea.value) {
      listTextarea.value.scrollTop = 0;
      listScrollTop.value = listTextarea.value.scrollTop;
    }
  });
}

function convertListToColumns() {
  columnsInput.value = convert(listInput.value, {
    ...conversionConfig.value,
    direction: 'list-to-column',
  });
  nextTick(() => {
    if (columnsTextarea.value) {
      columnsTextarea.value.scrollTop = 0;
      columnScrollTop.value = columnsTextarea.value.scrollTop;
    }
  });
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">
      <c-card>
        <div flex>
          <div>
            <n-form-item label="Trim list items" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.trimItems" />
            </n-form-item>
            <n-form-item label="Remove duplicates" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.removeDuplicates" data-test-id="removeDuplicates" />
            </n-form-item>
            <n-form-item
              label="Convert to lowercase"
              label-placement="left"
              label-width="150"
              :show-feedback="false"
              mb-2
            >
              <n-switch v-model:value="conversionConfig.lowerCase" />
            </n-form-item>
            <n-form-item label="Keep line breaks" label-placement="left" label-width="150" :show-feedback="false" mb-2>
              <n-switch v-model:value="conversionConfig.keepLineBreaks" />
            </n-form-item>
          </div>
          <div flex-1>
            <c-select
              v-model:value="conversionConfig.sortList"
              label="Sort list"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              :options="sortOrderOptions"
              w-full
              :disabled="conversionConfig.reverseList"
              data-test-id="sortList"
              placeholder="Sort alphabetically"
            />

            <c-input-text
              v-model:value="conversionConfig.separator"
              label="List separator"
              label-position="left"
              label-width="120px"
              label-align="right"
              mb-2
              placeholder=","
            />

            <n-form-item label="Wrap item" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.itemPrefix"
                placeholder="Item prefix"
                test-id="itemPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.itemSuffix"
                placeholder="Item suffix"
                test-id="itemSuffix"
              />
            </n-form-item>
            <n-form-item label="Wrap list" label-placement="left" label-width="120" :show-feedback="false" mb-2>
              <c-input-text
                v-model:value="conversionConfig.listPrefix"
                placeholder="List prefix"
                test-id="listPrefix"
              />
              <c-input-text
                v-model:value="conversionConfig.listSuffix"
                placeholder="List suffix"
                test-id="listSuffix"
              />
            </n-form-item>
          </div>
        </div>
      </c-card>
    </div>
  </div>
  <div class="converter-panels" style="flex: 1 1 100%" mt-6 flex flex-col gap-4 md:flex-row>
    <div flex-1>
      <div mb-2 font-medium>
        Columns
      </div>
      <div class="line-numbered text-sm font-mono">
        <c-button
          class="copy-button"
          circle
          size="small"
          variant="text"
          aria-label="Copy columns to clipboard"
          @click="copyColumns()"
        >
          <n-icon :component="Copy" />
        </c-button>
        <div class="line-numbers">
          <div class="line-numbers__inner" :style="{ transform: `translateY(-${columnScrollTop}px)` }">
            <span v-for="line in columnLineNumbers" :key="line">{{ line }}</span>
          </div>
        </div>
        <textarea
          ref="columnsTextarea"
          v-model="columnsInput"
          class="line-input"
          placeholder="One item per line..."
          rows="25"
          data-test-id="columns-input"
          spellcheck="false"
          wrap="off"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          @scroll="onColumnScroll"
        />
      </div>
    </div>

    <div flex flex-row items-center justify-center gap-2 md:flex-col>
      <c-button circle size="small" aria-label="Convert columns to list" data-test-id="convert-to-list" @click="convertColumnsToList">
        <n-icon :component="ArrowRight" />
      </c-button>
      <c-button circle size="small" aria-label="Convert list to columns" data-test-id="convert-to-columns" @click="convertListToColumns">
        <n-icon :component="ArrowLeft" />
      </c-button>
    </div>

    <div flex-1>
      <div mb-2 font-medium>
        List
      </div>
      <div class="line-numbered text-sm font-mono">
        <c-button
          class="copy-button"
          circle
          size="small"
          variant="text"
          aria-label="Copy list to clipboard"
          @click="copyList()"
        >
          <n-icon :component="Copy" />
        </c-button>
        <div class="line-numbers">
          <div class="line-numbers__inner" :style="{ transform: `translateY(-${listScrollTop}px)` }">
            <span v-for="line in listLineNumbers" :key="line">{{ line }}</span>
          </div>
        </div>
        <textarea
          ref="listTextarea"
          v-model="listInput"
          class="line-input"
          placeholder="Comma-separated list..."
          rows="25"
          data-test-id="list-input"
          spellcheck="false"
          wrap="off"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          @scroll="onListScroll"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.line-numbered {
  display: grid;
  grid-template-columns: auto 1fr;
  border: 1px solid v-bind('inputTheme.borderColor');
  border-radius: 4px;
  background-color: v-bind('inputTheme.backgroundColor');
  overflow: hidden;
  position: relative;
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    border-color: v-bind('appTheme.primary.color');
  }

  &:focus-within {
    border-color: v-bind('appTheme.primary.color');
    background-color: v-bind('inputTheme.focus.backgroundColor');
  }
}

.copy-button {
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 1;
}

.line-numbers {
  min-width: 36px;
  padding: 8px 8px 8px 12px;
  border-right: 1px solid v-bind('inputTheme.borderColor');
  color: v-bind('appTheme.text.mutedColor');
  text-align: right;
  user-select: none;
  overflow: hidden;
  position: relative;
}

.line-numbers__inner {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.line-numbers__inner span {
  display: block;
  line-height: 1.5;
}

.line-input {
  width: 100%;
  min-height: 320px;
  max-height: calc(45em + 16px);
  padding: 8px 40px 8px 12px;
  border: none;
  outline: none;
  background: transparent;
  color: v-bind('appTheme.text.baseColor');
  resize: vertical;
  line-height: 1.5;

  &::placeholder {
    color: v-bind('appTheme.text.mutedColor');
  }
}

.converter-panels {
  flex: 1 1 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
