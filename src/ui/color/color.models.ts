export { lighten, darken, setOpacity };

const clampHex = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

function lighten(color: string, amount: number): string {
  const alpha = color.length === 9 ? color.slice(7) : '';
  const num = Number.parseInt(color.slice(1, 7), 16);

  const r = clampHex(((num >> 16) & 255) + amount);
  const g = clampHex(((num >> 8) & 255) + amount);
  const b = clampHex((num & 255) + amount);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}${alpha}`;
}

function darken(color: string, amount: number): string {
  return lighten(color, -amount);
}

function setOpacity(color: string, opacity: number): string {
  const alpha = clampHex(Math.round(opacity * 255))
    .toString(16)
    .padStart(2, '0');

  if (color.length === 7) {
    return `${color}${alpha}`;
  }

  if (color.length === 9) {
    return `${color.slice(0, 7)}${alpha}`;
  }
  throw new Error('Invalid hex color');
}
