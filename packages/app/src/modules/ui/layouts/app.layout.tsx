import type { Component, ParentComponent } from 'solid-js';
import { useCommandPalette } from '@/modules/command-palette/command-palette.provider';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { Button } from '@/modules/ui/components/button';
import { A } from '@solidjs/router';
import { Badge } from '../components/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../components/dropdown-menu';
import { useThemeStore } from '../themes/theme.store';
import { cn } from '../utils/cn';
import { socialLinks } from './app.layouts.constants';

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
  const { t, getLocale, changeLocale, locales } = useI18n();

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
  const { openCommandPalette } = useCommandPalette();
  const getIsMacOs = () => navigator?.userAgent?.match(/Macintosh;/);

  return (
    <div class="border-b border-border bg-surface">
      <div class="flex items-center justify-between px-6 py-3 mx-auto max-w-1200px">
        <div class="flex items-center gap-4">
          <Button variant="link" class="text-xl font-semibold border-b border-transparent hover:no-underline h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250" as={A} href="/" aria-label="Home">
            <span class="font-bold text-foreground">IT</span>
            <span class="text-80% font-extrabold border border-2px leading-none border-current rounded-md px-1 py-0.5 ml-1 text-primary">TOOLS</span>
          </Button>

          <Button size="sm" variant="outline" class="bg-card transition flex items-center gap-2 text-muted-foreground" onClick={openCommandPalette}>
            <div class="i-tabler-search text-base"></div>
            {t('commandPalette.trigger.search')}
            <Badge variant="secondary" class="text-muted-foreground text-10px!">
              {getIsMacOs() ? '⌘ + K' : 'Ctrl + K'}
            </Badge>
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

const Footer: Component = () => {
  const { t, createLocalizedUrl } = useI18n();

  const getFooterSections = () => [
    {
      title: t('footer.resources.title'),
      items: [
        { label: t('footer.resources.all-tools'), to: createLocalizedUrl({ path: '/tools' }) },
        { label: t('footer.resources.github'), href: 'https://github.com/CorentinTh/it-tools' },
        { label: t('footer.resources.support'), href: 'https://buymeacoffee.com/cthmsst' },
        { label: 'Humans.txt', href: '/humans.txt' },
        { label: t('footer.resources.license'), href: 'https://github.com/CorentinTh/it-tools/blob/main/LICENSE' },
      ],
    },
    {
      title: t('footer.support.title'),
      items: [
        { label: t('footer.support.report-bug'), href: 'https://github.com/CorentinTh/it-tools/issues/new/choose' },
        { label: t('footer.support.request-feature'), href: 'https://github.com/CorentinTh/it-tools/issues/new/choose' },
        { label: t('footer.support.contribute'), href: 'https://github.com/CorentinTh/it-tools/blob/main/CONTRIBUTING.md' },
        { label: t('footer.support.contact'), href: 'https://github.com/CorentinTh/it-tools/issues/new/choose' },
      ],
    },
    {
      title: t('footer.friends.title'),
      items: [
        { label: 'Jugly.io', href: 'https://jugly.io' },
        { label: 'Enclosed.cc', href: 'https://enclosed.cc' },
      ],
    },

  ];

  return (
    <footer class="bg-card border-t border-border">
      <div class="py-12 px-6 mx-auto max-w-1200px">

        <div class="flex items-start justify-between flex-col md:flex-row gap-12">
          <div>
            <div class="flex items-center gap-2">
              <A href="/" class="text-2xl font-semibold border-b border-transparent hover:no-underline h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250 group text-muted-foreground flex items-center gap-1">
                <span class="font-bold group-hover:text-foreground transition">IT</span>
                <span class="text-80% font-extrabold border border-2px leading-none border-current rounded-md px-1 py-0.5 ml-1 group-hover:text-primary transition">TOOLS</span>
              </A>
            </div>

            <div class="flex items-center gap-2 mt-4">
              {socialLinks.map(({ icon, href, label }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" class="text-2xl text-muted-foreground hover:text-primary transition" aria-label={label}>
                  <div class={icon}></div>
                </a>
              ))}
            </div>

            <div class="text-muted-foreground mt-2">
              Crafted with
              {' '}
              <span class="i-tabler-heart inline-block text-base mb--0.5"></span>
              {' '}
              by
              {' '}
              <a href="https://corentin.tech" target="_blank" rel="noopener" class="hover:text-primary transition">
                Corentin Thomasset
              </a>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {getFooterSections().map(({ title, items }) => (
              <div>
                <h4 class="font-semibold text-foreground">{title}</h4>
                <ul class="mt-4">
                  {items.map(({ label, to, href }) => (
                    <li class="mt-1">
                      {to
                        ? (
                            <A href={to} class="text-muted-foreground hover:text-primary transition">
                              {label}
                            </A>
                          )
                        : (
                            <a href={href} target="_blank" rel="noopener" class="text-muted-foreground hover:text-primary transition">
                              {label}
                            </a>
                          )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div class="text-xs text-muted-foreground border-t border-border pt-4 mt-12">
          <span>
            &copy;
            {new Date().getFullYear()}
            {' '}
            Corentin Thomasset
          </span>
        </div>
        <div class="text-xs text-foreground opacity-80%">
        </div>
      </div>
    </footer>
  );
};

export const AppLayout: ParentComponent = (props) => {
  return (
    <div class="flex flex-col h-screen min-h-0">

      <Navbar />

      <div class="flex-1 pb-20 ">{props.children}</div>

      <Footer />
    </div>
  );
};
