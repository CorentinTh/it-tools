<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useTracker } from '@/modules/tracker/tracker.services';

useHead({ title: 'About - IT Tools' });
const { tracker } = useTracker();
</script>

<template>
  <div mx-auto mt-50px max-w-600px>
    <h1>About IT-Tools</h1>
    <p text-justify>
      This wonderful website, made with ❤ by
      <c-link href="https://github.com/CorentinTh" target="_blank" rel="noopener">
        Corentin Thomasset
      </c-link>,
      aggregates useful tools for developer and people working in IT. If you find it useful, please feel free to share
      it to people you think may find it useful too and don't forget to bookmark it in your shortcut bar!
    </p>
    <p text-justify>
      IT Tools is open-source (under the MIT license) and free, and will always be, but it costs me money to host and
      renew the domain name. If you want to support my work, and encourage me to add more tools, please consider
      supporting by
      <c-link
        href="https://www.buymeacoffee.com/cthmsst"
        rel="noopener"
        target="_blank"
        @click="() => tracker.trackEvent({ eventName: 'Support button clicked' })"
      >
        sponsoring me
      </c-link>.
    </p>

    <h2>Technologies</h2>
    <p text-justify>
      IT Tools is made in Vue.js (Vue 3) with the the Naive UI component library and is hosted and continuously deployed
      by Vercel. Third-party open-source libraries are used in some tools, you may find the complete list in the
      <c-link href="https://github.com/CorentinTh/it-tools/blob/main/package.json" rel="noopener" target="_blank">
        package.json
      </c-link>
      file of the repository.
    </p>

    <h2>Found a bug? A tool is missing?</h2>
    <p text-justify>
      If you need a tool that is currently not present here, and you think can be useful, you are welcome to submit a
      feature request in the
      <c-link
        href="https://github.com/CorentinTh/it-tools/issues/new/choose"
        rel="noopener"
        target="_blank"
      >
        issues section
      </c-link>
      in the GitHub repository.
    </p>
    <p text-justify>
      And if you found a bug, or something doesn't work as expected, please file a bug report in the
      <c-link
        href="https://github.com/CorentinTh/it-tools/issues/new/choose"
        rel="noopener"
        target="_blank"
      >
        issues section
      </c-link>
      in the GitHub repository.
    </p>
  </div>
</template>
