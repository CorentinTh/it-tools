<script setup>
const localePath = useLocalePath();

const sections = computed(() => [
  {
    title: 'Lorem',
    items: [
      { label: 'Foo', to: '/foo' },
      { label: 'Bar', to: '/bar' },
      { label: 'Baz', to: '/baz' },
    ],
  },
  {
    title: 'Ipsum',
    items: [
      { label: 'Foo', to: '/foo' },
      { label: 'Bar', to: '/bar' },
      { label: 'Baz', to: '/baz' },
    ],
  },
  {
    title: 'Dolor',
    items: [
      { label: 'Foo', to: '/foo' },
      { label: 'Bar', to: '/bar' },
      { label: 'Baz', to: '/baz' },
    ],
  },

]);

const socialLinks = [
  {
    icon: 'i-tabler-brand-github',
    href: 'https://github.com/CorentinTh/it-tools',
    label: 'GitHub',
  },
  {
    icon: 'i-tabler-brand-x',
    href: 'https://x.com/ittoolsdottech',
    label: 'X',
  },
  {
    icon: 'i-tabler-coffee',
    href: 'https://buymeacoffee.com/cthmsst',
    label: 'Support the project',
  },
];
</script>

<template>
  <footer class="bg-card border-t border-border">
    <div class="py-12 px-6 max-w-screen-xl mx-auto ">
      <div class="flex items-start justify-between flex-col md:flex-row gap-12">
        <div>
          <div class="flex items-center gap-2">
            <NuxtLink :to="localePath('/')" class="text-2xl font-semibold border-b border-transparent hover:no-underline h-auto py-0 px-1 ml--1 rounded-none !transition-border-color-250 group text-muted-foreground flex items-center gap-1">
              <span class="font-bold group-hover:text-foreground transition">IT</span>
              <span class="text-[80%] font-extrabold border-[2px] leading-none border-current rounded-md px-1 pt-0.5 ml-1 group-hover:text-primary transition">TOOLS</span>
            </NuxtLink>
          </div>

          <div class="flex items-center gap-2 mt-4">
            <!-- {socialLinks.map(({ icon, href, label }) => (
            <a href="{href}" target="_blank" rel="noopener noreferrer" class="text-2xl text-muted-foreground hover:text-primary transition" aria-label="{label}">
              <div class="{icon}" />
            </a>
            ))} -->
            <a
              v-for="socialLink in socialLinks" :key="socialLink.label" :href="socialLink.href" target="_blank" rel="noopener noreferrer" class="text-2xl text-muted-foreground hover:text-primary transition" :aria-label="socialLink.label"
            >
              <Icon :name="socialLink.icon" />
            </a>
          </div>

          <div class="text-muted-foreground mt-2">
            Crafted on Earth by
            <a href="https://corentin.tech" target="_blank" rel="noopener" class="hover:text-primary transition">
              Corentin Thomasset
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-12">
          <div v-for="section in sections" :key="section.title">
            <h4 class="font-semibold text-foreground">
              {{ section.title }}
            </h4>
            <ul class="mt-4">
              <li v-for="item in section.items" :key="item.label" class="mt-1">
                <NuxtLink v-if="item.to" :to="localePath(item.to)" class="text-muted-foreground hover:text-primary transition">
                  {{ item.label }}
                </NuxtLink>
                <a v-else :href="item.href" target="_blank" rel="noopener" class="text-muted-foreground hover:text-primary transition">
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="text-xs text-muted-foreground border-t border-border pt-4 mt-12">
        <span>
          &copy;
          {{ new Date().getFullYear() }}
          Corentin Thomasset
        </span>
      </div>
      <div class="text-xs text-foreground opacity-80%" />
    </div>
  </footer>
</template>
