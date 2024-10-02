import type { Component } from 'solid-js';
import { A } from '@solidjs/router';
import { useCommandPalette } from '../command-palette/command-palette.provider';
import { useI18n } from '../i18n/i18n.provider';
import { useToolsStore } from '../tools/tools.store';
import { Badge } from '../ui/components/badge';
import { Button } from '../ui/components/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/components/card';
import { cn } from '../ui/utils/cn';

export const HomePage: Component = () => {
  const { t } = useI18n();
  const { getTools } = useToolsStore();
  const { openCommandPalette } = useCommandPalette();

  return (
    <div>
      <div class="w-full bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:48px_48px] pt-20">

        <div class="flex justify-center gap-24 items-center p-6">
          <div class="max-w-xl flex flex-col gap-6 ">
            <div class="flex items-center gap-2">
              <Badge class="text-primary bg-primary/10 hover:bg-primary/10">
                {t('home.open-source')}
              </Badge>

              <Badge class="text-primary bg-primary/10 hover:bg-primary/10">
                {t('home.free')}
              </Badge>

              <Badge class="text-primary bg-primary/10 hover:bg-primary/10">
                {t('home.self-hostable')}
              </Badge>
            </div>
            <h1 class="text-5xl font-semibold border-b border-transparent hover:no-underline h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250">
              <span class="font-bold ">IT</span>
              <span class="text-90% text-primary font-extrabold border border-5px leading-none border-current rounded-xl px-2 py-0.5 ml-3">TOOLS</span>
            </h1>

            <p class="text-xl text-muted-foreground">
              {t('app.description')}
            </p>

            <div class="flex items-center gap-4">
              <Button variant="default" as={A} href="tools">
                {t('home.all-tools')}
                <div class="i-tabler-arrow-right ml-2 text-base"></div>
              </Button>

              <Button variant="outline" onClick={openCommandPalette}>
                <div class="i-tabler-search mr-2 text-base" />
                {t('home.search-tools')}
              </Button>
            </div>
          </div>

          <div class="relative hidden md:block">
            <div class="absolute top-4 left-0 w-full h-full flex items-center justify-center blur-2xl rounded-full opacity-20 bg-gradient-to-br from-primary to-transparent" />
            <div class="i-tabler-terminal text-9xl text-primary m-8" />
          </div>
        </div>

        <div class="bg-gradient-to-t dark:from-background to-transparent h-24 mt-24"></div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-1200px mx-auto p-6">
        {getTools().map(tool => (
          <A href={tool.slug} class="h-full">
            <Card class="hover:(shadow-md transform scale-101) transition-transform h-full">
              <CardHeader>
                <div class={cn(tool.icon, 'size-12 text-muted-foreground/60')} />

                <CardTitle class="text-base font-semibold">
                  {tool.name}
                </CardTitle>

                <CardDescription>
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </A>
        ))}
      </div>
    </div>
  );
};
