<script lang="ts" setup>
import _ from 'lodash';
import { diff } from '../xml-diff.models';
import { reconcileArrayShapes } from '../xml-diff.reconcile';
import { DiffRootViewer } from './xml-diff-viewer.models';
import { useAppTheme } from '@/ui/theme/themes';

const props = defineProps<{ leftXml: unknown; rightXml: unknown }>();
const onlyShowDifferences = ref(false);
const { leftXml, rightXml } = toRefs(props);
const appTheme = useAppTheme();

const result = computed(() => {
  const [reconciledLeftXml, reconciledRightXml] = reconcileArrayShapes(leftXml.value, rightXml.value);
  return diff(reconciledLeftXml, reconciledRightXml, { onlyShowDifferences: onlyShowDifferences.value });
});

const xmlAreTheSame = computed(() => _.isEqual(leftXml.value, rightXml.value));
const showResults = computed(() => !_.isUndefined(leftXml.value) && !_.isUndefined(rightXml.value));
</script>

<template>
  <div v-if="showResults">
    <div flex justify-center>
      <n-form-item label="Only show differences" label-placement="left">
        <n-switch v-model:value="onlyShowDifferences" />
      </n-form-item>
    </div>

    <c-card data-test-id="diff-result">
      <div v-if="xmlAreTheSame" text-center op-70>
        The provided XMLs are the same
      </div>
      <DiffRootViewer v-else :diff="result" />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.diffs-viewer) {
  color: v-bind('appTheme.text.mutedColor');

  & > ul {
    padding-left: 0 !important;
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
