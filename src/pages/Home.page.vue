<script setup lang="ts">
import { Heart } from '@vicons/tabler';
import { useHead } from '@vueuse/head';
import ColoredCard from '../components/ColoredCard.vue';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/tools/tools.store';
import { config } from '@/config';

const toolStore = useToolStore();

useHead({ title: 'IT Tools - Handy online tools for developers' });
const { t } = useI18n();
</script>

<template>
  <div class="pt-50px">
    <div class="grid-wrapper">
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ColoredCard v-if="config.showBanner" :title="$t('home.follow.title')" :icon="Heart">
          {{ $t('home.follow.p1') }}
          <a
            href="https://github.com/CorentinTh/it-tools"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.githubRepository')"
          >GitHub</a>
          {{ $t('home.follow.p2') }}
          <a
            href="https://twitter.com/ittoolsdottech"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.twitterAccount')"
          >Twitter</a>.
          {{ $t('home.follow.thankYou') }}
          <n-icon :component="Heart" />
        </ColoredCard>

        <a href="https://bit.ly/3zBl7DG" target="_blank" rel="noopener" class="text-current decoration-none">
          <c-card v-if="config.showSponsorBanner" class="cursor-pointer !border-2px !hover:border-primary">
            <div class="dark:hidden">
              <svg width="40" height="40" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M458.592 250.639C425.688 222.824 376.118 211.673 332.186 244.145C330.164 245.615 327.651 243.103 329.183 241.143C339.6 227.725 351.67 213.266 361.413 198.746C371.339 183.858 386.167 173.198 403.262 167.99C494.253 140.42 466.925 6 466.925 6C466.925 6 326.365 15.0675 343.705 136.315C346.585 156.594 341.193 177.241 328.509 193.354C312.946 213.021 294.87 231.83 281.758 245.431C279.001 248.25 274.344 245.554 275.447 241.755C288.13 199.052 297.383 133.007 253.45 90.4259L191.625 39.0842L179.738 54.7685C144.384 101.393 154.739 167.132 201.429 202.422C228.205 222.64 240.337 244.635 238.438 268.774C237.274 283.233 230.718 296.773 220.914 307.495C202.471 327.713 185.253 349.402 171.957 374.521C170.119 378.013 164.788 376.665 164.972 372.683C166.871 331.205 162.888 237.712 93.037 204.321L14.8527 174.117L8.78665 192.19C-10.882 250.517 21.2863 312.825 79.557 332.614C130.23 349.83 148.305 382.486 136.112 431.438C135.561 433.215 126.737 483.638 127.963 506H184.15C186.049 471.323 222.446 448.532 254.001 462.684C262.886 466.667 272.016 472.364 281.39 479.717C331.634 519.295 405.652 509.921 445.173 459.621L456.447 445.284L385.371 394.249C336.597 355.896 271.525 373.234 223.365 406.074C219.321 408.831 214.174 404.419 216.441 400.008C274.65 285.806 350.322 286.051 379.979 311.416C415.946 342.172 470.418 336.658 500.932 300.572L509.694 290.218L458.531 250.639H458.592Z" fill="#aaaaaa" />
              </svg>
            </div>

            <div class="hidden dark:block">
              <svg width="40" height="40" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M458.592 250.639C425.688 222.824 376.118 211.673 332.186 244.145C330.164 245.615 327.651 243.103 329.183 241.143C339.6 227.725 351.67 213.266 361.413 198.746C371.339 183.858 386.167 173.198 403.262 167.99C494.253 140.42 466.925 6 466.925 6C466.925 6 326.365 15.0675 343.705 136.315C346.585 156.594 341.193 177.241 328.509 193.354C312.946 213.021 294.87 231.83 281.758 245.431C279.001 248.25 274.344 245.554 275.447 241.755C288.13 199.052 297.383 133.007 253.45 90.4259L191.625 39.0842L179.738 54.7685C144.384 101.393 154.739 167.132 201.429 202.422C228.205 222.64 240.337 244.635 238.438 268.774C237.274 283.233 230.718 296.773 220.914 307.495C202.471 327.713 185.253 349.402 171.957 374.521C170.119 378.013 164.788 376.665 164.972 372.683C166.871 331.205 162.888 237.712 93.037 204.321L14.8527 174.117L8.78665 192.19C-10.882 250.517 21.2863 312.825 79.557 332.614C130.23 349.83 148.305 382.486 136.112 431.438C135.561 433.215 126.737 483.638 127.963 506H184.15C186.049 471.323 222.446 448.532 254.001 462.684C262.886 466.667 272.016 472.364 281.39 479.717C331.634 519.295 405.652 509.921 445.173 459.621L456.447 445.284L385.371 394.249C336.597 355.896 271.525 373.234 223.365 406.074C219.321 408.831 214.174 404.419 216.441 400.008C274.65 285.806 350.322 286.051 379.979 311.416C415.946 342.172 470.418 336.658 500.932 300.572L509.694 290.218L458.531 250.639H458.592Z" fill="#505050" />
              </svg>
            </div>

            <div class="my-5px flex items-baseline gap-4 text-lg text-black dark:text-white">
              Fern <div class="rounded-full bg-#eeeeee px-10px py-2px text-xs text-black dark:bg-#333333 dark:text-white">
                Sponsor
              </div>
            </div>

            <div class="text-neutral-500 dark:text-neutral-400">
              Offer developer documentation that looks as good as Stripe's using Fern. <a href="https://bit.ly/3zBl7DG" target="_blank" rel="noopener" class="font-bold text-current transition hover:text-primary">Request a preview</a> of your docs on Fern.
            </div>
          </c-card>
        </a>
      </div>

      <transition name="height">
        <div v-if="toolStore.favoriteTools.length > 0">
          <h3 class="mb-5px mt-25px font-500 text-neutral-400">
            {{ $t('home.categories.favoriteTools') }}
          </h3>
          <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
            <ToolCard v-for="tool in toolStore.favoriteTools" :key="tool.name" :tool="tool" />
          </div>
        </div>
      </transition>

      <div v-if="toolStore.newTools.length > 0">
        <h3 class="mb-5px mt-25px font-500 text-neutral-400">
          {{ t('home.categories.newestTools') }}
        </h3>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in toolStore.newTools" :key="tool.name" :tool="tool" />
        </div>
      </div>

      <h3 class="mb-5px mt-25px font-500 text-neutral-400">
        {{ $t('home.categories.allTools') }}
      </h3>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in toolStore.tools" :key="tool.name" :tool="tool" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}
</style>
