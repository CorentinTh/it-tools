import { reactive, watch, type Ref } from 'vue';

type UseValidationRule<T> = {
  validator: (value: T) => boolean
  message: string
}

export function useValidation<T>({ source, rules }: { source: Ref<T>; rules: UseValidationRule<T>[] }) {
  const state = reactive<{
    message: string,
    status: undefined | 'error'
  }>({
    message: '',
    status: undefined
  })

  watch([source], () => {
    for(const rule of rules) {
      if(!rule.validator(source.value)){
        state.message = rule.message
        state.status = 'error'
      }
    }
  })

  return state;
}
