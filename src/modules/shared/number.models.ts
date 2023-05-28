function clamp({ value, min = 0, max = 100 }: { value: number; min?: number; max?: number }) {
  return Math.min(Math.max(value, min), max);
}

export { clamp };
