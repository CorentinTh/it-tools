import { createSignal } from 'solid-js';

export { createRefreshableSignal };

function createRefreshableSignal<T>(getValue: () => T) {
  const [getState, setState] = createSignal<T>(getValue());

  return [
    getState,
    () => setState(() => getValue()),
    { setState },
  ] as const;
}
