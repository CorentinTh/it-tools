import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface PaletteOption {
  name: string
  description?: string
  icon?: Component
  action?: () => void
  to?: RouteLocationRaw
  category: string
  keywords?: string[]
  href?: string
  closeOnSelect?: boolean
}
