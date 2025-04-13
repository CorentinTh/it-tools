export interface Border {
  label: string
  value: number
  max: number
}

export interface Borders {
  [key: string]: Border
}

// Asegúrate de que esta función esté correctamente exportada
export function generateCSSOutput(borders: Borders, borderWidth: number, borderStyle: string, unit: string): string {
  const { topLeft, topRight, bottomRight, bottomLeft } = borders;
  return `border: ${borderWidth}px ${borderStyle} #000000; border-radius: ${topLeft.value}${unit} ${topRight.value}${unit} ${bottomRight.value}${unit} ${bottomLeft.value}${unit};`;
}
