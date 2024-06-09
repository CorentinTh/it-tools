<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';

const url = useStorage('utm-generator:url', '');
const utmSource = useStorage('utm-generator:source', '');
const utmMedium = useStorage('utm-generator:medium', '');
const utmCampaign = useStorage('utm-generator:campaign', '');
const utmContent = useStorage('utm-generator:content', '');
const utmTerm = useStorage('utm-generator:term', '');
const utmifiedUrl = computed(() => {
  try {
    const utmUrl = new URL(url.value);
    utmUrl.searchParams.set('utm_source', utmSource.value);
    utmUrl.searchParams.set('utm_medium', utmMedium.value);
    utmUrl.searchParams.set('utm_campaign', utmCampaign.value);
    if (utmContent.value) {
      utmUrl.searchParams.set('utm_content', utmContent.value);
    }
    if (utmContent.value) {
      utmUrl.searchParams.set('utm_term', utmTerm.value);
    }
    return utmUrl.href;
  }
  catch {
    return '# invalid inputs';
  }
});

const urlValidation = useValidation({
  source: url,
  rules: [
    {
      message: 'Invalid url string',
      validator: (value) => {
        try {
          const _ = (new URL(value));
          return true;
        }
        catch {
          return false;
        }
      },
    },
  ],
});
const utmMediumValidation = useValidation({
  source: utmMedium,
  rules: [
    {
      message: 'UTM Medium is required',
      validator: value => value !== '',
    },
  ],
});
const utmSourceValidation = useValidation({
  source: utmSource,
  rules: [
    {
      message: 'UTM Source is required',
      validator: value => value !== '',
    },
  ],
});
const utmCampaignValidation = useValidation({
  source: utmCampaign,
  rules: [
    {
      message: 'UTM Campaign is required',
      validator: value => value !== '',
    },
  ],
});
const { copy } = useCopy({ source: utmifiedUrl, text: 'UTMified url copied.' });
</script>

<template>
  <div>
    <n-p>
      For more info about UTM, see <n-a href="https://en.wikipedia.org/wiki/UTM_parameters" target="_blank" rel="noopener noreferrer">
        UTM Parameters
      </n-a>
    </n-p>

    <c-input-text
      v-model:value="url"
      label="Website url"
      placeholder="Put your website url here..."
      clearable
      mb-2
      :validation="urlValidation"
    />
    <c-input-text
      v-model:value="utmSource"
      label="UTM Source (Identifies which site sent the traffic)"
      placeholder="Put your UTM Source here..."
      clearable
      mb-2
      :validation="utmSourceValidation"
    />
    <c-input-text
      v-model:value="utmMedium"
      label="UTM Medium (Identifies what type of link was used)"
      placeholder="Put your UTM Medium here..."
      clearable
      mb-2
      :validation="utmMediumValidation"
    />
    <c-input-text
      v-model:value="utmCampaign"
      label="UTM Campaign (Identifies a specific product promotion or strategic campaign)"
      placeholder="Put your UTM Campaign here..."
      clearable
      mb-2
      :validation="utmCampaignValidation"
    />
    <c-input-text
      v-model:value="utmContent"
      label="UTM Content (Identifies search terms)"
      placeholder="Put your UTM Content here..."
      clearable
      mb-2
    />
    <c-input-text
      v-model:value="utmTerm"
      label="UTM Term (Identifies what specifically was clicked to bring the user to the site)"
      placeholder="Put your UTM Term here..."
      clearable
      mb-2
    />

    <div v-if="utmifiedUrl">
      <div mb-2>
        Your url with UTM parameters added
      </div>
      <c-card>
        {{ utmifiedUrl }}
      </c-card>

      <div mt-3 flex justify-center>
        <c-button autofocus @click="copy()">
          Copy url
        </c-button>
      </div>
    </div>
  </div>
</template>
