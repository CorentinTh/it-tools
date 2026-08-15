<script setup lang="ts" generic="T extends unknown">
import { useAppTheme } from '../theme/themes';
import type { CLabelProps } from '../c-label/c-label.types';
import type { CSelectOption } from './c-select.types';
import { useTheme } from './c-select.theme';
import { clamp } from '@/modules/shared/number.models';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { generateRandomId } from '@/utils/random';

const props = withDefaults(
  defineProps<{
    options?: CSelectOption<T>[] | string[]
    value?: T
    placeholder?: string
    size?: 'small' | 'medium' | 'large'
    searchable?: boolean
    disabled?: boolean
  } & CLabelProps >(),
  {
    options: () => [],
    value: undefined,
    placeholder: undefined,
    size: 'medium',
    searchable: false,
    disabled: false,
  },
);

const emits = defineEmits(['update:value']);

const labelProps = props as CLabelProps;
const { disabled, options: rawOptions, placeholder, size: sizeName, searchable } = toRefs(props);

const options = computed(() => {
  return rawOptions.value.map((option: string | CSelectOption<T>) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    }

    return option;
  });
});

const value = useVModel(props, 'value', emits);
const theme = useTheme();
const appTheme = useAppTheme();

const isOpen = ref(false);
const selectedOption = computed(() => options.value.find((option: CSelectOption<T>) => option.value === value.value));
const focusIndex = ref(0);
const elementRef = ref<HTMLElement>();
const controlRef = ref<HTMLElement>();
const generatedId = generateRandomId();
const controlId = computed(() => labelProps.labelFor ?? generatedId);
const listboxId = computed(() => `${controlId.value}-listbox`);

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
const activeOptionId = computed(() => focusIndex.value >= 0 && filteredOptions.value[focusIndex.value]
  ? `${controlId.value}-option-${focusIndex.value}`
  : undefined);

watch(filteredOptions, (newOptions) => {
  if (!isOpen.value) {
    return;
  }

  focusIndex.value = newOptions.length === 0
    ? -1
    : clamp({ value: focusIndex.value, min: 0, max: newOptions.length - 1 });
});

function close() {
  isOpen.value = false;
}

function open() {
  if (disabled.value) {
    return;
  }

  isOpen.value = true;
  const selectedIndex = filteredOptions.value.findIndex(option => option.value === value.value);
  focusIndex.value = filteredOptions.value.length === 0 ? -1 : Math.max(0, selectedIndex);
}

function toggleOpen() {
  if (isOpen.value) {
    close();
  }
  else {
    open();
  }
}

function selectOption({ option }: { option: CSelectOption<T> }) {
  if (disabled.value || !option) {
    return;
  }

  // @ts-expect-error vue template generic is a bit flacky thanks to withDefaults
  value.value = option.value;
  isOpen.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (disabled.value) {
    return;
  }

  const { key } = event;
  const isEnter = key === 'Enter';
  const isArrowUpOrDown = ['ArrowUp', 'ArrowDown'].includes(key);
  const isArrowDown = key === 'ArrowDown';

  if (key === 'Escape' && isOpen.value) {
    close();
    controlRef.value?.focus();
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (isEnter) {
    const focusedOption = filteredOptions.value[focusIndex.value];

    if (isOpen.value && focusedOption) {
      selectOption({ option: focusedOption });
    }
    else if (!isOpen.value) {
      open();
    }

    event.preventDefault();
    return;
  }

  if (isArrowUpOrDown) {
    if (!isOpen.value) {
      open();
      event.preventDefault();
      return;
    }

    if (filteredOptions.value.length === 0) {
      focusIndex.value = -1;
      event.preventDefault();
      return;
    }

    const increment = isArrowDown ? 1 : -1;
    focusIndex.value = clamp({
      value: focusIndex.value + increment,
      min: 0,
      max: filteredOptions.value.length - 1,
    });

    event.preventDefault();
    return;
  }

  if (isOpen.value && ['Home', 'End'].includes(key) && filteredOptions.value.length > 0) {
    focusIndex.value = key === 'Home' ? 0 : filteredOptions.value.length - 1;
    event.preventDefault();
  }
}

function onSearchInput() {
  focusIndex.value = filteredOptions.value.length === 0 ? -1 : 0;
}
</script>

<template>
  <c-label
    :label="labelProps.label"
    :label-align="labelProps.labelAlign"
    :label-for="controlId"
    :label-position="labelProps.labelPosition"
    :label-width="labelProps.labelWidth"
  >
    <div ref="elementRef" relative class="c-select" w-full>
      <div
        :id="controlId"
        ref="controlRef"
        flex flex-nowrap cursor-pointer items-center
        :class="{ 'is-open': isOpen, 'important:border-primary': isOpen, disabled }"
        class="c-select-input"
        role="combobox"
        aria-haspopup="listbox"
        :aria-label="labelProps.label ?? placeholder ?? 'Select an option'"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-activedescendant="isOpen ? activeOptionId : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :tabindex="disabled ? -1 : 0"
        hover:important:border-primary
        @click="toggleOpen"
        @keydown="handleKeydown"
      >
        <div flex-1 truncate>
          <slot name="displayed-value">
            <input
              v-if="searchable && isOpen"
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="search-input"
              w-full
              color-current
              lh-normal
              :aria-label="`Search ${labelProps.label ?? 'options'}`"
              @click.stop
              @input="onSearchInput"
            >
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
        <div
          v-show="isOpen"
          :id="listboxId"
          class="c-select-dropdown"
          role="listbox"
          absolute z-10 mt-1 max-h-312px w-full overflow-y-auto pretty-scrollbar
        >
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
              :id="`${controlId}-option-${index}`"
              :key="option.label"
              cursor-pointer
              px-4
              py-1
              :class="{ active: selectedOption?.label === option.label, hover: focusIndex === index }"
              class="c-select-dropdown-option"
              role="option"
              :aria-selected="option.value === value"
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
    outline: none;

    .placeholder, .chevron {
      color: v-bind('appTheme.text.mutedColor');
    }

    &:focus-visible {
      outline: 2px solid v-bind('appTheme.primary.color');
      outline-offset: 2px;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;

      &:hover {
        border-color: v-bind('theme.borderColor') !important;
      }
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
