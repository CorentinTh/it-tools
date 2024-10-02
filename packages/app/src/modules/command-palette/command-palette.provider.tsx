import type { Accessor, ParentComponent } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createContext, createMemo, createSignal, For, onCleanup, onMount, useContext } from 'solid-js';
import { locales } from '../i18n/i18n.constants';
import { useI18n } from '../i18n/i18n.provider';
import { useToolsStore } from '../tools/tools.store';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/components/command';
import { useThemeStore } from '../ui/themes/theme.store';
import { cn } from '../ui/utils/cn';

const CommandPaletteContext = createContext<{
  getIsCommandPaletteOpen: Accessor<boolean>;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
}>();

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);

  if (!context) {
    throw new Error('CommandPalette context not found');
  }

  return context;
}

export const CommandPaletteProvider: ParentComponent = (props) => {
  const [getIsCommandPaletteOpen, setIsCommandPaletteOpen] = createSignal(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsCommandPaletteOpen(true);
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  const { getTools } = useToolsStore();
  const navigate = useNavigate();
  const { t, createLocalizedUrl, changeLocale } = useI18n();
  const { setColorMode } = useThemeStore();

  const getCommandData = createMemo(() => [
    {
      label: t('commandPalette.sections.tools'),
      options: [
        ...getTools().map(tool => ({
          label: tool.name,
          icon: tool.icon,
          action: () => navigate(createLocalizedUrl({ path: tool.slug })),
        })),
      ],
    },
    {
      label: t('commandPalette.sections.navigation'),
      options: [
        {
          label: t('commandPalette.go-home'),
          icon: 'i-tabler-home',
          action: () => navigate(createLocalizedUrl({ path: '' })),
        },
      ],
    },
    {
      label: t('commandPalette.sections.language'),
      options: [
        ...locales.map(locale => ({
          label: locale.switchToLabel,
          icon: 'i-custom-language',
          action: () => changeLocale(locale.key),
          keywords: [locale.name, locale.key],
        })),
      ],
    },
    {
      label: t('commandPalette.sections.theme'),
      options: [
        {
          label: t('commandPalette.theme.switch-to-light'),
          icon: 'i-tabler-sun',
          action: () => setColorMode({ mode: 'light' }),
        },
        {
          label: t('commandPalette.theme.switch-to-dark'),
          icon: 'i-tabler-moon',
          action: () => setColorMode({ mode: 'dark' }),
        },
        {
          label: t('commandPalette.theme.switch-to-system'),
          icon: 'i-tabler-device-laptop',
          action: () => setColorMode({ mode: 'system' }),
        },
      ],
    },
  ]);

  const onCommandSelect = ({ action }: { action: () => void }) => {
    action();
    setIsCommandPaletteOpen(false);
  };

  return (
    <CommandPaletteContext.Provider value={{
      getIsCommandPaletteOpen,
      openCommandPalette: () => setIsCommandPaletteOpen(true),
      closeCommandPalette: () => setIsCommandPaletteOpen(false),
    }}
    >
      <CommandDialog
        class="rounded-lg border shadow-md"
        open={getIsCommandPaletteOpen()}
        onOpenChange={setIsCommandPaletteOpen}
      >
        <CommandInput placeholder={t('commandPalette.input-placeholder')} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <For each={getCommandData()}>
            {section => (
              <CommandGroup heading={section.label}>
                <For each={section.options}>
                  {item => (
                    <CommandItem onSelect={() => onCommandSelect(item)}>
                      <span class={cn('mr-2 ml-1 size-4 text-muted-foreground', item.icon)} />
                      <span>{item.label}</span>
                    </CommandItem>
                  )}
                </For>
              </CommandGroup>
            )}
          </For>
        </CommandList>
      </CommandDialog>

      {props.children}
    </CommandPaletteContext.Provider>
  );
};
