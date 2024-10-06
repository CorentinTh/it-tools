import { CopyButton } from '@/modules/shared/copy/copy-button';
import { createRefreshableSignal } from '@/modules/shared/signals';
import { Button } from '@/modules/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/modules/ui/components/card';
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from '@/modules/ui/components/switch';
import { TextArea } from '@/modules/ui/components/textarea';
import { TextFieldRoot } from '@/modules/ui/components/textfield';
import { type Component, createSignal } from 'solid-js';
import { ToolHeader } from '../../components/tool-header';
import { useCurrentTool } from '../../tools.provider';
import defaultDictionary from './locales/en.json';
import { createToken } from './token-generator.models';

const TokenGeneratorTool: Component = () => {
  const [getUseUpperCase, setUseUpperCase] = createSignal(true);
  const [getUseLowerCase, setUseLowerCase] = createSignal(true);
  const [getUseNumbers, setUseNumbers] = createSignal(true);
  const [getUseSpecialCharacters, setUseSpecialCharacters] = createSignal(false);
  const [getLength] = createSignal(64);

  const { t, getTool } = useCurrentTool({ defaultDictionary });

  const [getToken, refreshToken] = createRefreshableSignal(() => createToken({
    withUppercase: getUseUpperCase(),
    withLowercase: getUseLowerCase(),
    withNumbers: getUseNumbers(),
    withSymbols: getUseSpecialCharacters(),
    length: getLength(),
  }));

  return (
    <div>
      <ToolHeader {...getTool()} />

      <div class="mx-auto max-w-1200px p-6 flex flex-col gap-4 md:flex-row items-start">
        <Card>
          <CardHeader class="border-b border-border">
            <CardTitle class="text-muted-foreground">
              Configuration
            </CardTitle>
          </CardHeader>

          <CardContent class="pt-6 flex flex-col gap-2">
            <Switch class="flex items-center gap-2" checked={getUseUpperCase()} onChange={setUseUpperCase}>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
                {t('uppercase')}
              </SwitchLabel>
            </Switch>

            <Switch class="flex items-center gap-2" checked={getUseLowerCase()} onChange={setUseLowerCase}>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
                {t('lowercase')}
              </SwitchLabel>
            </Switch>

            <Switch class="flex items-center gap-2" checked={getUseNumbers()} onChange={setUseNumbers}>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
                {t('numbers')}
              </SwitchLabel>
            </Switch>

            <Switch class="flex items-center gap-2" checked={getUseSpecialCharacters()} onChange={setUseSpecialCharacters}>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
                {t('symbols')}
              </SwitchLabel>
            </Switch>
          </CardContent>

        </Card>

        <Card class="flex-1">
          <CardHeader class="border-b border-border flex justify-between flex-row py-3 items-center">
            <CardTitle class="text-muted-foreground">
              Your token
            </CardTitle>

            <div class="flex justify-center items-center gap-2">
              <Button onClick={refreshToken} variant="outline">
                <div class="i-tabler-refresh mr-2 text-base text-muted-foreground" />
                Refresh token
              </Button>

              <CopyButton textToCopy={getToken} toastMessage={t('copy-toast')} />
            </div>
          </CardHeader>

          <CardContent class="pt-6 text-center">
            {getToken()}
          </CardContent>

        </Card>
      </div>
    </div>
  );
};

export default TokenGeneratorTool;
