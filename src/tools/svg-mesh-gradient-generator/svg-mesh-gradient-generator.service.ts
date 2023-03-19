// A function that generates a blurry mesh gradient background image in a canvas from multiple colors
export function generateMeshGradient(colors: string[], canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  const meshGradient = ctx.createLinearGradient(0, 0, width, height);
  meshGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  meshGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
  meshGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = meshGradient;
  ctx.fillRect(0, 0, width, height);
}
