import type { Component } from 'solid-js';
import { CopyButton } from '@/modules/shared/copy/copy-button';
import { createRefreshableSignal } from '@/modules/shared/signals';
import { Button } from '@/modules/ui/components/button';
import { Card, CardContent, CardHeader } from '@/modules/ui/components/card';
import { ToolHeader } from '../../components/tool-header';
import { useCurrentTool } from '../../tools.provider';
import defaultDictionary from './locales/en.json';
import { generateRandomPort } from './random-port-generator.services';

const RandomPortGenerator: Component = () => {
  const [getPort, refreshPort] = createRefreshableSignal(generateRandomPort);
  const { t, getTool } = useCurrentTool({ defaultDictionary });

  return (
    <div>
      <ToolHeader {...getTool()} />

      <div class="max-w-600px mx-auto px-6">
        <Card>
          <CardHeader class="flex justify-between items-center">
            <div class="my-6 text-center">

              <div class="text-base text-muted-foreground mb-2">
                Random port:
              </div>

              <div class="text-4xl font-mono">

                {getPort()}
              </div>
            </div>

            <div class="flex gap-2 md:gap-4 mt-4 flex-col md:flex-row w-full justify-center">
              <Button onClick={refreshPort} variant="outline">
                <div class="i-tabler-refresh mr-2 text-base text-muted-foreground" />
                {t('refresh')}
              </Button>

              <CopyButton textToCopy={getPort} toastMessage={t('copy-toast')} />
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default RandomPortGenerator;
