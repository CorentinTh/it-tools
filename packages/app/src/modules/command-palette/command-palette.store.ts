export const useCommandPaletteStore = defineStore('command-palette', () => {
  const isCommandPaletteOpen = ref(false);

  return {
    isCommandPaletteOpen,
    toggleCommandPalette() {
      isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
    },
    closeCommandPalette() {
      isCommandPaletteOpen.value = false;
    },
    openCommandPalette() {
      isCommandPaletteOpen.value = true;
    },
  };
});
