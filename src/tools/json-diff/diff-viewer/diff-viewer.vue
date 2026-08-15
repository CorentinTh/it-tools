<script lang="ts" setup>
import type { Difference } from '../json-diff.types';
import { DiffRootViewer } from './diff-viewer.models';
import { useAppTheme } from '@/ui/theme/themes';

const props = defineProps<{ difference?: Difference }>();
const difference = computed(() => props.difference);
const appTheme = useAppTheme();

const jsonAreTheSame = computed(() => difference.value?.status === 'unchanged');
</script>

<template>
  <div v-if="difference">
    <c-card data-test-id="diff-result">
      <div v-if="jsonAreTheSame" text-center op-70>
        The provided JSONs are the same
      </div>
      <DiffRootViewer v-else :diff="difference" />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.diffs-viewer) {
  color: v-bind('appTheme.text.mutedColor');

  & > ul {
    padding-left: 0 !important;
  }

  .diff-toggle,
  .diff-show-more {
    appearance: none;
    border: 0;
    background: transparent;
    color: v-bind('appTheme.primary.color');
    cursor: pointer;
    font: inherit;
  }

  .diff-toggle {
    width: 1.4rem;
    padding: 0;
    text-align: left;
  }

  .diff-show-more {
    padding: 4px 0;
    font-weight: 600;
  }

  .diff-toggle:hover,
  .diff-show-more:hover {
    color: v-bind('appTheme.primary.colorHover');
  }

  .diff-toggle:focus-visible,
  .diff-show-more:focus-visible {
    border-radius: 4px;
    outline: 2px solid v-bind('appTheme.primary.color');
    outline-offset: 2px;
  }

  .collapsed-summary {
    margin: 0 0.35rem;
    opacity: 0.7;
  }

  ul {
    list-style: none;
    padding-left: 20px;
    margin: 0;

    li {
      .updated-line {
        padding: 3px 0;
      }

      .result,
      .array,
      .object,
      .value {
        &:not(:last-child) {
          margin-right: 4px;
        }

        &.added {
          padding: 3px 5px;
          border-radius: 4px;
          background-color: v-bind('appTheme.success.colorFaded');
          color: v-bind('appTheme.success.color');
          .key {
            color: inherit;
          }
        }

        &.removed {
          padding: 3px 5px;
          border-radius: 4px;
          background-color: v-bind('appTheme.error.colorFaded');
          color: v-bind('appTheme.error.color');

          .key {
            color: inherit;
          }
        }
      }

      .value {
        cursor: pointer;
        border: 1px solid transparent;
        transition: border-color 0.2s ease-in-out;

        &.added:hover {
          border-color: v-bind('appTheme.success.color');
        }

        &.removed:hover {
          border-color: v-bind('appTheme.error.color');
        }
      }

      .added .added,
      .removed .removed {
        background-color: transparent;
        color: inherit;
      }

      .key {
        font-weight: 500;
        color: v-bind('appTheme.text.baseColor');
      }
    }
  }
}
</style>
