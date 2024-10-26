<script setup lang="ts">
import { Button } from '@/src/modules/ui/components/button';

const localePath = useLocalePath();
</script>

<template>
  <div class="flex justify-center text-center mt-24">
    <div>
      <h1 class="text-3xl font-light text-muted-foreground">
        404
      </h1>
      <h2 class="font-semibold text-lg my-2">
        Page not found
      </h2>

      <p class="text-muted-foreground">
        The page you are looking for does not seem to exist.
      </p>

      <p class="text-muted-foreground">
        Please check the URL and try again.
      </p>

      <Button as-child variant="secondary" class="mt-4">
        <NuxtLink :to="localePath('/')">
          <Icon name="i-tabler-arrow-left" class="mr-2 size-4" />

          Go back home
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
