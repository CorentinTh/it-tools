<script setup lang="ts" generic="T extends unknown">
import { useAppTheme } from '../theme/themes';
import type { CLabelProps } from '../c-label/c-label.types';
import type { CSelectOption } from './c-select.types';
import { useTheme } from './c-select.theme';
import { clamp } from '@/modules/shared/number.models';
import { useFuzzySearch } from '@/composable/fuzzySearch';

const props = withDefaults(
  defineProps<{
    options?: CSelectOption<T>[] | string[]
    value?: T
    placeholder?: string
    size?: 'small' | 'medium' | 'large'
    searchable?: boolean
  } & CLabelProps >(),
  {
    options: () => [],
    value: undefined,
    placeholder: undefined,
    size: 'medium',
    searchable: false,
  },
);

const emits = defineEmits(['update:value']);

const { options: rawOptions, placeholder, size: sizeName, searchable } = toRefs(props);

const options = computed(() => {
  return rawOptions.value.map((option: string | CSelectOption<T>) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    }

    return option;
  });
});

const keys = useMagicKeys();
const value = useVModel(props, 'value', emits);
const theme = useTheme();
const appTheme = useAppTheme();

const isOpen = ref(false);
const selectedOption = shallowRef<CSelectOption<T> | undefined>(options.value.find((option: CSelectOption<T>) => option.value === value.value));
const focusIndex = ref(0);
const elementRef = ref(null);

const size = computed(() => theme.value.sizes[sizeName.value as 'small' | 'medium' | 'large']);

const searchQuery = ref('');
const searchInputRef = ref();

whenever(() => !isOpen.value, () => {
  focusIndex.value = 0;
  searchQuery.value = '';
});

whenever(() => isOpen.value, () => {
  nextTick(() => searchInputRef.value?.focus());
});

onClickOutside(elementRef, close);
whenever(keys.escape, close);

watch(
  value,
  (newValue) => {
    const option = options.value.find((option: CSelectOption<T>) => option.value === newValue);
    if (option) {
      selectedOption.value = option;
    }
  },
);

const { searchResult: filteredOptions } = useFuzzySearch<CSelectOption<T>>({
  search: searchQuery,
  data: options.value,
  options: {
    keys: ['label'],
    shouldSort: false,
    threshold: 0.3,
    filterEmpty: false,
  },
});

function close() {
  isOpen.value = false;
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

function selectOption({ option }: { option: CSelectOption<T> }) {
  selectedOption.value = option;
  // @ts-expect-error vue template generic is a bit flacky thanks to withDefaults
  value.value = option.value;
  isOpen.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  const { key } = event;
  const isEnter = ['Enter'].includes(key);
  const isArrowUpOrDown = ['ArrowUp', 'ArrowDown'].includes(key);
  const isArrowDown = key === 'ArrowDown';

  if (isEnter) {
    const valueCanBeSelected = isOpen.value && focusIndex.value !== -1;

    if (valueCanBeSelected) {
      selectOption({ option: filteredOptions.value[focusIndex.value] });
    }
    else {
      toggleOpen();
    }

    event.preventDefault();
    return;
  }

  if (isArrowUpOrDown) {
    const increment = isArrowDown ? 1 : -1;
    focusIndex.value = clamp({
      value: focusIndex.value + increment,
      min: 0,
      max: options.value.length - 1,
    });

    event.preventDefault();
  }
}

function onSearchInput() {
  focusIndex.value = 0;
}
</script>

<template>
  <c-label v-bind="props">
    <div ref="elementRef" relative class="c-select" w-full>
      <div
        flex flex-nowrap cursor-pointer items-center
        :class="{ 'is-open': isOpen, 'important:border-primary': isOpen }"
        class="c-select-input"
        tabindex="0"
        hover:important:border-primary
        @click="toggleOpen"
        @keydown="handleKeydown"
      >
        <div flex-1 truncate>
          <slot name="displayed-value">
            <input v-if="searchable && isOpen" ref="searchInputRef" v-model="searchQuery" type="text" placeholder="Search..." class="search-input" w-full lh-normal color-current @input="onSearchInput">
            <span v-else-if="selectedOption" lh-normal>
              {{ selectedOption.label }}
            </span>
            <span v-else class="placeholder" lh-normal>
              {{ placeholder ?? 'Select an option' }}
            </span>
          </slot>
        </div>

        <icon-mdi-chevron-down class="chevron" />
      </div>

      <transition name="dropdown">
        <div v-show="isOpen" class="c-select-dropdown" absolute z-10 mt-1 max-h-312px w-full overflow-y-auto pretty-scrollbar>
          <template v-if="!filteredOptions.length">
            <slot name="empty">
              <div px-4 py-1 opacity-70>
                No results found
              </div>
            </slot>
          </template>
          <template v-else>
            <div
              v-for="(option, index) in filteredOptions"
              :key="option.label"
              cursor-pointer
              px-4
              py-1
              :class="{ active: selectedOption?.label === option.label, hover: focusIndex === index }"
              class="c-select-dropdown-option"
              @click="selectOption({ option })"
            >
              {{ option.label }}
            </div>
          </template>
        </div>
      </transition>
    </div>
  </c-label>
</template>

<style lang="less" scoped>
.c-select {
  .search-input{
    all: unset;

    &::placeholder {
      color: v-bind('appTheme.text.mutedColor');
    }
  }

  .c-select-input {
    background-color: v-bind('theme.backgroundColor');
    border: 1px solid v-bind('theme.borderColor');
    border-radius: 4px;
    padding: 0 12px;
    font-family: inherit;
    font-size: v-bind('size.fontSize');
    height: v-bind('size.height');
    transition: border-color 0.2s ease-in-out;

    .placeholder, .chevron {
      color: v-bind('appTheme.text.mutedColor');
    }
  }

  .c-select-dropdown {
    background-color: v-bind('theme.backgroundColor');
    border-radius: 4px;
    // box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    box-shadow: v-bind('theme.dropdownShadow');
    font-family: inherit;
    font-size: inherit;
    line-height: 1;
    padding: 6px;

    .c-select-dropdown-option{
      border-radius: 4px;
      padding: 8px 12px;
      background-color: transparent;
      transition: background-color 0.2s ease-in-out;

      &.active {
        color: v-bind('theme.option.active.textColor');
      }

      &:hover, &.hover {
        background-color: v-bind('theme.option.hover.backgroundColor');
      }
    }
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
