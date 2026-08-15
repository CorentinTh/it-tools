import type { ComputedRef, InjectionKey } from 'vue';

export const C_CHOICE_GROUP_DISABLED: InjectionKey<ComputedRef<boolean>> = Symbol('c-choice-group-disabled');
