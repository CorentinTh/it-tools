/* @refresh reload */

import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from '@kobalte/core/color-mode';
import { Router } from '@solidjs/router';
import { render, Suspense } from 'solid-js/web';
import { routes } from './client-routes';
import { CommandPaletteProvider } from './modules/command-palette/command-palette.provider';
import { RootI18nProvider } from './modules/i18n/i18n.provider';
import { Toaster } from './modules/ui/components/sonner';
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './app.css';

render(
  () => {
    const initialColorMode = 'system';
    const colorModeStorageKey = 'it_tools_color_mode';
    const localStorageManager = createLocalStorageManager(colorModeStorageKey);

    return (
      <Router
        children={routes}
        root={props => (
          <Suspense>
            <RootI18nProvider>
              <ColorModeScript storageType={localStorageManager.type} storageKey={colorModeStorageKey} initialColorMode={initialColorMode} />
              <ColorModeProvider
                initialColorMode={initialColorMode}
                storageManager={localStorageManager}
              >
                <CommandPaletteProvider>
                  <Toaster />
                  <div class="min-h-screen font-sans text-sm font-400">{props.children}</div>
                </CommandPaletteProvider>
              </ColorModeProvider>
            </RootI18nProvider>
          </Suspense>
        )}
      />
    );
  },
  document.getElementById('root')!,
);
