import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from '@/modules/ui/components/switch';
import { TextArea } from '@/modules/ui/components/textarea';
import { TextFieldRoot } from '@/modules/ui/components/textfield';
import { type Component, createSignal } from 'solid-js';
import { useCurrentTool } from '../../tools.provider';
import defaultDictionary from './locales/en.json';
import { createToken } from './token-generator.models';

const TokenGeneratorTool: Component = () => {
  const [getUseUpperCase, setUseUpperCase] = createSignal(true);
  const [getUseLowerCase, setUseLowerCase] = createSignal(true);
  const [getUseNumbers, setUseNumbers] = createSignal(true);
  const [getUseSpecialCharacters, setUseSpecialCharacters] = createSignal(false);
  const [getLength] = createSignal(64);

  const { t } = useCurrentTool({ defaultDictionary });

  const getToken = () => createToken({
    withUppercase: getUseUpperCase(),
    withLowercase: getUseLowerCase(),
    withNumbers: getUseNumbers(),
    withSymbols: getUseSpecialCharacters(),
    length: getLength(),
  });

  return (
    <div class="space-y-2 mx-auto max-w-1200px p-6">
      <Switch class="flex items-center space-x-2" checked={getUseUpperCase()} onChange={setUseUpperCase}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
          {t('uppercase')}
        </SwitchLabel>
      </Switch>

      <Switch class="flex items-center space-x-2" checked={getUseLowerCase()} onChange={setUseLowerCase}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
          {t('lowercase')}
        </SwitchLabel>
      </Switch>

      <Switch class="flex items-center space-x-2" checked={getUseNumbers()} onChange={setUseNumbers}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
          {t('numbers')}
        </SwitchLabel>
      </Switch>

      <Switch class="flex items-center space-x-2" checked={getUseSpecialCharacters()} onChange={setUseSpecialCharacters}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
          {t('symbols')}
        </SwitchLabel>
      </Switch>

      <TextFieldRoot>
        <TextArea placeholder="Your token will appear here" value={getToken()} readonly />
      </TextFieldRoot>
    </div>
  );
};

export default TokenGeneratorTool;
