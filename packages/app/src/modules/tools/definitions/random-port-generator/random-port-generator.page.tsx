import type { Component } from 'solid-js';
import { CopyButton } from '@/modules/shared/copy/copy-button';
import { createRefreshableSignal } from '@/modules/shared/signals';
import { Button } from '@/modules/ui/components/button';
import { useCurrentTool } from '../../tools.provider';
import defaultDictionary from './locales/en.json';
import { generateRandomPort } from './random-port-generator.services';

const RandomPortGenerator: Component = () => {
  const [getPort, refreshPort] = createRefreshableSignal(generateRandomPort);
  const { t } = useCurrentTool({ defaultDictionary });

  return (
    <div class="mx-auto max-w-1200px p-6">
      <div>
        {getPort()}
      </div>

      <div class="flex gap-4 mt-4">
        <Button onClick={refreshPort} variant="outline">
          <div class="i-tabler-refresh mr-2 text-base text-muted-foreground" />
          {t('refresh')}
        </Button>

        <CopyButton textToCopy={getPort} toastMessage={t('copy-toast')} />
      </div>
    </div>
  );
};

export default RandomPortGenerator;
