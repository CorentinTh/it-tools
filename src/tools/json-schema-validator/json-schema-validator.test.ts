/* eslint-disable vue/one-component-per-file -- Small render-only stubs exercise the tool interactions. */
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import JsonSchemaValidator from './json-schema-validator.vue';
import type { JsonSchemaValidationResult } from './json-schema-validator.worker.protocol';

const mocks = vi.hoisted(() => ({
  cancel: vi.fn(),
  dispose: vi.fn(),
  run: vi.fn(),
}));

vi.mock('./json-schema-validator.worker-client', () => ({
  JsonSchemaWorkerClient: class {
    run = mocks.run;
    cancel = mocks.cancel;
    dispose = mocks.dispose;
  },
}));

const InputStub = defineComponent({
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
    testId: { type: String, default: undefined },
  },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () => h('textarea', {
      ...attrs,
      'data-test-id': props.testId,
      'value': props.value,
      'onInput': (event: Event) => emit('update:value', (event.target as HTMLTextAreaElement).value),
    });
  },
});

const SelectStub = defineComponent({
  inheritAttrs: false,
  props: {
    options: { type: Array, default: () => [] },
    value: { type: String, default: '' },
  },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () => h('select', {
      ...attrs,
      value: props.value,
      onChange: (event: Event) => emit('update:value', (event.target as HTMLSelectElement).value),
    }, (props.options as Array<{ label: string; value: string }>).map(option => h(
      'option',
      { value: option.value },
      option.label,
    )));
  },
});

const ButtonStub = defineComponent({
  inheritAttrs: false,
  props: { disabled: { type: Boolean, default: false } },
  emits: ['click'],
  setup(props, { attrs, emit, slots }) {
    return () => h('button', {
      ...attrs,
      disabled: props.disabled,
      onClick: () => emit('click'),
    }, slots.default?.());
  },
});

const CardStub = defineComponent({
  setup(_props, { attrs, slots }) {
    return () => h('div', attrs, slots.default?.());
  },
});

const AlertStub = defineComponent({
  props: { title: { type: String, default: '' } },
  setup(props, { attrs, slots }) {
    return () => h('div', attrs, [h('strong', props.title), slots.default?.()]);
  },
});

function mountValidator() {
  return mount(JsonSchemaValidator, {
    global: {
      stubs: {
        CAlert: AlertStub,
        CButton: ButtonStub,
        CCard: CardStub,
        CInputText: InputStub,
        CSelect: SelectStub,
      },
    },
  });
}

function validResult(warnings: JsonSchemaValidationResult['warnings'] = []): JsonSchemaValidationResult {
  return {
    valid: true,
    completeErrorList: true,
    warnings,
    errors: [],
  };
}

function createDeferred<T>() {
  let deferredResolve!: (value: T) => void;
  const promise = new Promise<T>((resolve) => {
    deferredResolve = resolve;
  });

  return { promise, resolve: deferredResolve };
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

beforeEach(() => {
  mocks.cancel.mockReset();
  mocks.dispose.mockReset();
  mocks.run.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});

describe('JSON Schema Validator interactions', () => {
  it('never validates reactively and runs the current snapshots only after Validate', async () => {
    mocks.run.mockResolvedValue({ value: validResult(), elapsedMs: 12 });
    const wrapper = mountValidator();

    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="json-schema-status"]').attributes('aria-live')).toBe('polite');

    await wrapper.get('[data-test-id="json-schema-source"]').setValue('{"type":"integer"}');
    await wrapper.get('[data-test-id="json-schema-instance"]').setValue('42');
    await wrapper.get('[data-test-id="json-schema-draft"]').setValue('draft7');

    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="json-schema-status"]').text()).toContain('Select Validate');

    await wrapper.get('[data-test-id="json-schema-validate"]').trigger('click');
    await flushPromises();

    expect(mocks.run).toHaveBeenCalledOnce();
    expect(mocks.run).toHaveBeenCalledWith({
      schemaSource: '{"type":"integer"}',
      instanceSource: '42',
      draft: 'draft7',
    });
    expect(wrapper.get('[data-test-id="json-schema-status"]').text()).toContain('is valid (12 ms)');
    expect(wrapper.find('[data-test-id="json-schema-errors"]').exists()).toBe(false);
    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);
    wrapper.unmount();
  });

  it('renders bounded structured errors and every returned warning', async () => {
    mocks.run.mockResolvedValue({
      value: {
        valid: false,
        completeErrorList: false,
        warnings: ['format-not-validated', 'ieee-754-numbers', 'incomplete-error-list'],
        errors: [
          {
            instancePath: '/email',
            schemaPath: '#/properties/email/format',
            keyword: 'format',
            message: 'must match format "email"',
            line: 2,
            column: 12,
          },
          {
            instancePath: '',
            schemaPath: '#/required',
            keyword: 'required',
            message: 'must have required property "name"',
            line: 1,
            column: 1,
          },
        ],
      } satisfies JsonSchemaValidationResult,
      elapsedMs: 25,
    });
    const wrapper = mountValidator();

    await wrapper.get('[data-test-id="json-schema-validate"]').trigger('click');
    await flushPromises();

    expect(wrapper.get('[data-test-id="json-schema-status"]').text()).toContain('2 validation errors found (25 ms)');
    const warnings = wrapper.get('[data-test-id="json-schema-warning"]').text();
    expect(warnings).toContain('Format keywords');
    expect(warnings).toContain('IEEE-754');
    expect(warnings).toContain('incomplete');

    const errors = wrapper.get('[data-test-id="json-schema-errors"]');
    expect(errors.findAll('li')).toHaveLength(2);
    expect(errors.text()).toContain('/email — must match format "email"');
    expect(errors.text()).toContain('Line 2, column 12');
    expect(errors.text()).toContain('#/properties/email/format');
    expect(errors.text()).toContain('(root) — must have required property "name"');
    expect(errors.text()).toContain('bounded error list is incomplete');
    wrapper.unmount();
  });

  it('cancels explicitly and prevents edited inputs from receiving stale results', async () => {
    const first = createDeferred<{ value: JsonSchemaValidationResult; elapsedMs: number }>();
    const second = createDeferred<{ value: JsonSchemaValidationResult; elapsedMs: number }>();
    mocks.run.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const wrapper = mountValidator();

    await wrapper.get('[data-test-id="json-schema-validate"]').trigger('click');
    expect(wrapper.get('[data-test-id="json-schema-cancel"]').attributes('disabled')).toBeUndefined();
    await wrapper.get('[data-test-id="json-schema-cancel"]').trigger('click');

    expect(mocks.cancel).toHaveBeenLastCalledWith('JSON Schema validation cancelled.');
    expect(wrapper.get('[data-test-id="json-schema-status"]').text()).toContain('cancelled');
    first.resolve({ value: validResult(), elapsedMs: 5 });
    await flushPromises();
    expect(wrapper.get('[data-test-id="json-schema-status"]').text()).not.toContain('is valid');

    await wrapper.get('[data-test-id="json-schema-validate"]').trigger('click');
    await wrapper.get('[data-test-id="json-schema-instance"]').setValue('{"edited":true}');

    expect(mocks.cancel).toHaveBeenLastCalledWith('JSON Schema validation cancelled because its input or draft changed.');
    expect(wrapper.get('[data-test-id="json-schema-status"]').text()).toContain('input or draft changed');
    second.resolve({ value: validResult(['format-not-validated']), elapsedMs: 7 });
    await flushPromises();
    expect(wrapper.find('[data-test-id="json-schema-warning"]').exists()).toBe(false);
    expect(wrapper.find('[data-test-id="json-schema-errors"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('clears both inputs and all results, then disposes the worker client on unmount', async () => {
    mocks.run.mockResolvedValue({
      value: {
        valid: false,
        completeErrorList: true,
        warnings: [],
        errors: [{
          instancePath: '',
          schemaPath: '#/type',
          keyword: 'type',
          message: 'must be a string',
          line: 1,
          column: 1,
        }],
      } satisfies JsonSchemaValidationResult,
      elapsedMs: 3,
    });
    const wrapper = mountValidator();

    await wrapper.get('[data-test-id="json-schema-validate"]').trigger('click');
    await flushPromises();
    expect(wrapper.find('[data-test-id="json-schema-errors"]').exists()).toBe(true);

    await wrapper.get('[data-test-id="json-schema-clear"]').trigger('click');
    expect((wrapper.get('[data-test-id="json-schema-source"]').element as HTMLTextAreaElement).value).toBe('');
    expect((wrapper.get('[data-test-id="json-schema-instance"]').element as HTMLTextAreaElement).value).toBe('');
    expect((wrapper.get('[data-test-id="json-schema-draft"]').element as HTMLSelectElement).value).toBe('draft2020');
    expect(wrapper.find('[data-test-id="json-schema-errors"]').exists()).toBe(false);
    expect(wrapper.get('[data-test-id="json-schema-status"]').text()).toContain('Inputs cleared');
    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);

    wrapper.unmount();
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });
});
