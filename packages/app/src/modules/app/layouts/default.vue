<template>
  <div class="w-full min-h-screen text-sm relative font-sans flex flex-col">
    <app-header />

    <div class="flex-1 pb-6">
      <slot />
    </div>

    <app-footer />
  </div>
</template>
