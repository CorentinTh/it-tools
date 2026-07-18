import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CDiffEditor from './c-diff-editor.vue';

const mocks = vi.hoisted(() => {
  const callbacks: {
    original?: () => void
    modified?: () => void
  } = {};
  const originalListener = { dispose: vi.fn() };
  const modifiedListener = { dispose: vi.fn() };
  const originalModel = {
    dispose: vi.fn(),
    getValue: vi.fn(() => 'original text'),
    onDidChangeContent: vi.fn((callback: () => void) => {
      callbacks.original = callback;
      return originalListener;
    }),
    setValue: vi.fn(),
  };
  const modifiedModel = {
    dispose: vi.fn(),
    getValue: vi.fn(() => 'modified text'),
    onDidChangeContent: vi.fn((callback: () => void) => {
      callbacks.modified = callback;
      return modifiedListener;
    }),
    setValue: vi.fn(),
  };
  const editor = {
    dispose: vi.fn(),
    layout: vi.fn(),
    setModel: vi.fn(),
    updateOptions: vi.fn(),
  };
  const terminate = vi.fn();

  return {
    callbacks,
    editor,
    modifiedListener,
    modifiedModel,
    originalListener,
    originalModel,
    terminate,
  };
});

vi.mock('monaco-editor/esm/vs/editor/editor.api', () => ({
  editor: {
    createDiffEditor: vi.fn(() => mocks.editor),
    createModel: vi
      .fn()
      .mockImplementationOnce(() => mocks.originalModel)
      .mockImplementationOnce(() => mocks.modifiedModel),
    defineTheme: vi.fn(),
    setTheme: vi.fn(),
  },
}));

vi.mock('monaco-editor/esm/vs/editor/editor.worker?worker', () => ({
  default: class WorkerMock {
    terminate = mocks.terminate;
  },
}));

vi.mock('@/stores/style.store', () => ({
  useStyleStore: () => reactive({ isDarkTheme: false }),
}));

describe('c-diff-editor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete window.MonacoEnvironment;
  });

  it('emits model changes and disposes every Monaco resource on unmount', () => {
    const previousEnvironment = { getWorker: vi.fn() };
    window.MonacoEnvironment = previousEnvironment;
    const wrapper = mount(CDiffEditor);

    const worker = window.MonacoEnvironment?.getWorker?.('worker-id', 'editor');
    expect(worker).toBeDefined();

    mocks.originalModel.getValue.mockReturnValue('updated original');
    mocks.modifiedModel.getValue.mockReturnValue('updated modified');
    mocks.callbacks.original?.();
    mocks.callbacks.modified?.();

    expect(wrapper.emitted('update:originalText')).toEqual([['updated original']]);
    expect(wrapper.emitted('update:modifiedText')).toEqual([['updated modified']]);

    wrapper.unmount();

    expect(mocks.originalListener.dispose).toHaveBeenCalledOnce();
    expect(mocks.modifiedListener.dispose).toHaveBeenCalledOnce();
    expect(mocks.editor.setModel).toHaveBeenLastCalledWith(null);
    expect(mocks.originalModel.dispose).toHaveBeenCalledOnce();
    expect(mocks.modifiedModel.dispose).toHaveBeenCalledOnce();
    expect(mocks.editor.dispose).toHaveBeenCalledOnce();
    expect(mocks.terminate).toHaveBeenCalledOnce();
    expect(window.MonacoEnvironment).toBe(previousEnvironment);
  });
});
