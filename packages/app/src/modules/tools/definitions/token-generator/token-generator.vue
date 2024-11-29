<script setup lang="ts">
import { times } from 'lodash-es';
import { useRefreshableState } from '~/src/modules/shared/composables/useRefreshableState';
import { cn } from '~/src/modules/shared/style/cn';
import { Button } from '~/src/modules/ui/components/button';
import { Checkbox } from '~/src/modules/ui/components/checkbox';
import NumberField from '~/src/modules/ui/components/number-field/NumberField.vue';
import NumberFieldContent from '~/src/modules/ui/components/number-field/NumberFieldContent.vue';
import NumberFieldDecrement from '~/src/modules/ui/components/number-field/NumberFieldDecrement.vue';
import NumberFieldIncrement from '~/src/modules/ui/components/number-field/NumberFieldIncrement.vue';
import NumberFieldInput from '~/src/modules/ui/components/number-field/NumberFieldInput.vue';
import Slider from '~/src/modules/ui/components/slider/Slider.vue';
import { Textarea } from '~/src/modules/ui/components/textarea';
import ToggleGroup from '~/src/modules/ui/components/toggle-group/ToggleGroup.vue';
import ToggleGroupItem from '~/src/modules/ui/components/toggle-group/ToggleGroupItem.vue';
import { createToken } from './token-generator.models';

definePageMeta({
  layout: 'sidenav',
});

const formats = {
  raw: {
    label: 'Raw',
    format: ({ tokens }: { tokens: string[] }) => tokens.join('\n'),
  },
  JSON: {
    label: 'JSON',
    format: ({ tokens }: { tokens: string[] }) => JSON.stringify(tokens),
  },
};
const similarChars = ['I', 'l', '1', 'O', '0'];

const withUppercase = ref(true);
const withLowercase = ref(true);
const withNumbers = ref(true);
const withSymbols = ref(false);
const excludeSimilar = ref(false);
const length = ref(64);

const format = ref<keyof typeof formats>('raw');
const quantity = ref(1);
const tab = ref<'generator' | 'about'>('generator');

function reset() {
  withUppercase.value = true;
  withLowercase.value = true;
  withNumbers.value = true;
  withSymbols.value = false;
  excludeSimilar.value = false;
  length.value = 64;
  format.value = 'raw';
  quantity.value = 1;
}

function generateToken() {
  return createToken({
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: withSymbols.value,
    length: length.value,
    exclude: excludeSimilar.value ? similarChars : [],
  });
}

const [token, refreshToken] = useRefreshableState(
  'token-generator:token',
  () => {
    const tokens = times(
      quantity.value,
      generateToken,
    );

    return formats[format.value].format({ tokens });
  },
);

watch([
  withUppercase,
  withLowercase,
  withNumbers,
  withSymbols,
  length,
  format,
  quantity,
  excludeSimilar,
], refreshToken);

// const { copy: copyToken } = useCopy({ source: token, notificationText: 'Token copied to clipboard' });
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-6 pb-0 bg-white dark:bg-background border-b">
      <h1 class="text-2xl">
        {{ $t('tools.token-generator.title') }}
      </h1>
      <p class="text-muted-foreground">
        {{ $t('tools.token-generator.description') }}
      </p>

      <div class="mt-2 flex gap-4">
        <Button variant="link" :class="cn('text-muted-foreground font-sm pb-0 px-0 rounded-none hover:no-underline', { 'border-b border-b-foreground text-foreground': tab === 'generator' })" @click="tab = 'generator'">
          Generator
        </Button>
        <Button variant="link" :class="cn('border-b border-b-transparent text-muted-foreground font-sm pb-0 px-0 rounded-none hover:no-underline transition', { 'border-b-foreground text-foreground': tab === 'about' })" @click="tab = 'about'">
          About
        </Button>
      </div>
    </div>

    <div v-if="tab === 'about'" class="p-6 bg-white dark:bg-background">
      <div class="prose dark:prose-invert mx-auto mb-20">
        <h2 id="about-the-random-token-generator">
          About The Random Token Generator
        </h2>
        <p>
          The Random Token Generator on Crucials.tools is designed to meet the
          modern developer’s need for quick, secure, and customizable tokens.
          Whether you&#39;re working on web applications, software development, system
          administration, or creating secure passwords, our tool provides a
          straightforward solution to create tokens that fit your specifications
          perfectly.
        </p>
        <h2 id="why-are-tokens-important-">
          Why Are Tokens Important?
        </h2>
        <p>
          In the realm of software development and IT, tokens play a crucial role in
          maintaining security and user authentication. They are essential for:
        </p>
        <ul>
          <li>
            <p>
              <strong>Session Management:</strong> Tokens are used to manage user sessions,
              allowing systems to recognize and verify users over multiple requests.
            </p>
          </li>
          <li>
            <p>
              <strong>API Security:</strong> Securely accessing APIs often requires tokens to
              ensure that the requestor has the necessary permissions.
            </p>
          </li>
          <li>
            <p>
              <strong>Randomized Data Generation:</strong> Tokens can be used in testing
              environments to generate randomized data inputs, helping developers
              identify potential issues.
            </p>
          </li>
        </ul>
        <h2 id="ideal-for-generating-secure-passwords">
          Ideal for Generating Secure Passwords
        </h2>
        <p>
          In addition to creating tokens, our Random Token Generator is an excellent
          tool for generating strong, secure passwords. With options to include a
          mix of uppercase letters, lowercase letters, numbers, and special symbols,
          you can create robust passwords that enhance security for any application
          or service.
        </p>
        <h2 id="how-to-use-the-token-generator">
          How to Use the Token Generator
        </h2>
        <p>Using our Token Generator is simple:</p>
        <ol>
          <li>
            <p>
              <strong>Select the characters you want:</strong> Choose from uppercase letters,
              lowercase letters, numbers, and special symbols based on your token or
              password requirements.
            </p>
          </li>
          <li>
            <p>
              <strong>Choose the length:</strong> Determine how long you want your token or
              password to be, depending on the level of complexity and security needed.
            </p>
          </li>
          <li>
            <p>
              <strong>Generate with a click:</strong> Once your options are set, click &#39;Generate&#39;
              to receive your token or password instantly.
            </p>
          </li>
        </ol>
        <h2 id="benefits-of-using-crucials-tools-token-generator">
          Benefits of Using Crucials.tools Token Generator
        </h2>
        <ul>
          <li>
            <p>
              <strong>Customization:</strong> Our tool allows for extensive customization, ensuring
              you get exactly what you need for your project or personal security.
            </p>
          </li>
          <li>
            <p>
              <strong>Speed:</strong> Generate tokens or passwords in seconds, speeding up your
              development process and enhancing your security posture.
            </p>
          </li>
          <li>
            <p>
              <strong>No Installation Required:</strong> As a web-based tool, there is no need to
              install any software, making it accessible from anywhere at any time.
            </p>
          </li>
        </ul>
        <h2 id="perfect-tool-for-developers-and-people-in-it">
          Perfect Tool For Developers and people in IT
        </h2>
        <p>
          Whether you are developing a new application, testing existing
          functionality, needing to ensure secure access, or generating a strong
          password, our Random Token Generator is the perfect tool. It is built to
          be reliable and secure, providing peace of mind in various development and
          personal security scenarios.
        </p>
      </div>
    </div>

    <div v-if="tab === 'generator'" class="h-full flex-1 flex flex-col md:flex-row">
      <div class="md:max-w-[360px] bg-white dark:bg-background h-full border-b md:border-b-none md:border-r">
        <div class="px-6 pt-4 pb-6 ">
          <div class="text-muted-foreground mb-3">
            Token configuration
          </div>

          <div class="flex gap-2 items-center mb-1">
            <Checkbox id="use-uppercase" v-model:checked="withUppercase" />
            <label for="use-uppercase">
              {{ $t('tools.token-generator.use-uppercase') }}
              <span class="text-muted-foreground">
                (A-Z)
              </span>
            </label>
          </div>

          <div class="flex gap-2 items-center mb-1">
            <Checkbox id="use-lowercase" v-model:checked="withLowercase" />
            <label for="use-lowercase">
              {{ $t('tools.token-generator.use-lowercase') }}
              <span class="text-muted-foreground">
                (a-z)
              </span>
            </label>
          </div>

          <div class="flex gap-2 items-center mb-1">
            <Checkbox id="use-numbers" v-model:checked="withNumbers" />
            <label for="use-numbers">
              {{ $t('tools.token-generator.use-numbers') }}
              <span class="text-muted-foreground">
                (0-9)
              </span>
            </label>
          </div>

          <div class="flex gap-2 items-center mb-1">
            <Checkbox id="use-symbols" v-model:checked="withSymbols" />
            <label for="use-symbols">
              {{ $t('tools.token-generator.use-symbols') }}
              <span class="text-muted-foreground">
                (!@,]*...)
              </span>
            </label>
          </div>

          <div class="flex gap-2 items-center mb-1">
            <Checkbox id="exclude-similar" v-model:checked="excludeSimilar" />
            <label for="exclude-similar">
              {{ $t('tools.token-generator.exclude-similar') }}
              <span class="text-muted-foreground">
                ({{ similarChars.join('') }})
              </span>
            </label>
          </div>

          <div class="flex gap-4 items-center mb-3 mt-4">
            <label for="length" class="w-20 shrink-0">{{ $t('tools.token-generator.length') }}</label>
            <NumberField id="length" v-model="length" :min="1" :max="1024">
              <NumberFieldContent class="flex-1">
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>

          <Slider
            :model-value="[length]"
            :max="512"
            :min="1"
            :step="1"
            @update:model-value="(v) => length = v?.[0] ?? 1"
          />
        </div>

        <hr>

        <div class="px-6 pt-4 pb-6 border-b">
          <div class="text-muted-foreground mb-3">
            Output configuration
          </div>

          <div class="flex items-center mb-2 gap-4">
            <div class="w-20 shrink-0">
              {{ $t('tools.token-generator.format') }}
            </div>
            <ToggleGroup v-model="format" type="single" variant="outline">
              <ToggleGroupItem v-for="({ label }, key) in formats" :key="key" :value="key">
                {{ label }}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-20 shrink-0">
              {{ $t('tools.token-generator.quantity') }}
            </div>

            <NumberField v-model="quantity" :min="1" :max="100">
              <NumberFieldContent class="flex-1">
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
        </div>

        <div class="p-6">
          <Button class="w-full" variant="secondary" @click="reset">
            Reset configuration
          </Button>
        </div>
      </div>

      <div class="flex-1 p-6 pt-4 bg-white dark:bg-background pb-20">
        <div class="text-muted-foreground mb-3">
          Generated token
        </div>

        <Textarea v-model="token" rows="12" class="font-mono" readonly :placeholder="$t('tools.token-generator.placeholder')" />
        <div class="flex md:items-center mt-2 gap-2 flex-col md:flex-row">
          <Button variant="secondary" @click="refreshToken">
            <Icon name="i-tabler-refresh" class="mr-2" />
            {{ $t('tools.token-generator.refresh') }}
          </Button>

          <Button variant="secondary">
            <Icon name="i-tabler-copy" class="mr-2" />
            Copy to clipboard
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
