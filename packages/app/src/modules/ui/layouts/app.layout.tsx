import type { LocaleKey } from '@/modules/i18n/i18n.types';
import type { Component, ParentComponent } from 'solid-js';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { Button } from '@/modules/ui/components/button';
import { A, useLocation, useNavigate } from '@solidjs/router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../components/dropdown-menu';
import { useThemeStore } from '../themes/theme.store';
import { cn } from '../utils/cn';

const ThemeSwitcher: Component = () => {
  const themeStore = useThemeStore();
  const { t } = useI18n();

  return (
    <>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'light' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-sun text-lg"></div>
        {t('navbar.theme.light-mode')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'dark' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-moon text-lg"></div>
        {t('navbar.theme.dark-mode')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => themeStore.setColorMode({ mode: 'system' })} class="flex items-center gap-2 cursor-pointer">
        <div class="i-tabler-device-laptop text-lg"></div>
        {t('navbar.theme.system-mode')}
      </DropdownMenuItem>
    </>
  );
};

const LanguageSwitcher: Component = () => {
  const { t, getLocale, setLocale, locales } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLocale = (locale: LocaleKey) => {
    setLocale(locale);

    const pathWithoutLocale = location.pathname.split('/').slice(2).join('/');
    const newPath = [locale, pathWithoutLocale].filter(Boolean).join('/');
    navigate(`/${newPath}`);
  };

  return (
    <>
      {locales.map(locale => (
        <DropdownMenuItem onClick={() => changeLocale(locale.key)} class={cn('flex items-center gap-2 cursor-pointer', { 'font-semibold': getLocale() === locale.key })}>
          {locale.name}
        </DropdownMenuItem>
      ))}

      <DropdownMenuSeparator />

      <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" rel="noopener noreferrer" href="https://github.com/CorentinTh/it-tools">
        {t('navbar.contribute-to-i18n')}
      </DropdownMenuItem>
    </>
  );
};

export const Navbar: Component = () => {
  const themeStore = useThemeStore();
  const { t } = useI18n();

  return (
    <div class="border-b border-border bg-surface">
      <div class="flex items-center justify-between px-6 py-3 mx-auto max-w-1200px">
        <div class="flex items-baseline gap-4">
          <Button variant="link" class="text-xl font-semibold border-b border-transparent hover:no-underline h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250" as={A} href="/" aria-label="Home">
            <span class="font-bold text-foreground">IT</span>
            <span class="text-80% font-extrabold border border-2px leading-none border-current rounded-md px-1 py-0.5 ml-1 text-lime">TOOLS</span>
          </Button>
        </div>

        <div>

          <Button variant="ghost" class="text-lg px-0 size-9 hidden md:inline-flex" as={A} href="https://github.com/CorentinTh/enclosed" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
            <div class="i-tabler-brand-github"></div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9 hidden md:inline-flex" variant="ghost" aria-label="Change theme">
              <div classList={{ 'i-tabler-moon': themeStore.getColorMode() === 'dark', 'i-tabler-sun': themeStore.getColorMode() === 'light' }}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-42">
              <ThemeSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9 hidden md:inline-flex" variant="ghost" aria-label="Language">
              <div class="i-custom-language size-4"></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <LanguageSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>

            <DropdownMenuTrigger as={Button} class="text-lg px-0 size-9" variant="ghost" aria-label="Menu icon">
              <div class="i-tabler-dots-vertical hidden md:block"></div>
              <div class="i-tabler-menu-2 block md:hidden"></div>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-46">

              {/* Mobile only items */}
              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer md:hidden" target="_blank" href="https://github.com/CorentinTh/enclosed" rel="noopener noreferrer">
                <div class="i-tabler-brand-github text-lg"></div>
                {t('navbar.github')}
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger as="a" class="flex items-center gap-2 md:hidden" aria-label="Change theme">
                  <div class="text-lg" classList={{ 'i-tabler-moon': themeStore.getColorMode() === 'dark', 'i-tabler-sun': themeStore.getColorMode() === 'light' }}></div>
                  {t('navbar.theme.theme')}
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  <ThemeSwitcher />
                </DropdownMenuSubContent>

              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger as="a" class="flex items-center text-medium gap-2 md:hidden" aria-label="Change language">
                  <div class="i-custom-language size-4"></div>
                  {t('navbar.language')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <LanguageSwitcher />
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Default items */}

              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href="https://github.com/CorentinTh/it-tools/issues/new/choose" rel="noopener noreferrer">
                <div class="i-tabler-bug text-lg"></div>
                {t('navbar.report-bug')}
              </DropdownMenuItem>

              <DropdownMenuItem as="a" class="flex items-center gap-2 cursor-pointer" target="_blank" href="https://buymeacoffee.com/cthmsst" rel="noopener noreferrer">
                <div class="i-tabler-pig-money text-lg"></div>
                {t('navbar.support')}
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export const AppLayout: ParentComponent = (props) => {
  return (
    <div class="flex flex-col h-screen min-h-0">

      <Navbar />

      <div class="flex-1 pb-20 ">{props.children}</div>

    </div>
  );
};
