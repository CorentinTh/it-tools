import { get } from '@vueuse/core';
import _ from 'lodash';
import { reactive, watch } from 'vue';

function isFalsyOrHasThrown(cb) {
  try {
    const returnValue = cb();
    if (_.isNil(returnValue)) {
      return true;
    }
    return returnValue === false;
  } catch (_2) {
    return true;
  }
}
function useValidation({
  source,
  rules,
  watch: watchRefs = []
}) {
  const state = reactive({
    message: "",
    status: void 0,
    isValid: false,
    attrs: {
      validationStatus: void 0,
      feedback: ""
    }
  });
  watch(
    [source, ...watchRefs],
    () => {
      state.message = "";
      state.status = void 0;
      for (const rule of get(rules)) {
        if (isFalsyOrHasThrown(() => rule.validator(source.value))) {
          state.message = rule.message;
          state.status = "error";
        }
      }
      state.isValid = state.status !== "error";
      state.attrs.feedback = state.message;
      state.attrs.validationStatus = state.status;
    },
    { immediate: true }
  );
  return state;
}

export { useValidation as u };
