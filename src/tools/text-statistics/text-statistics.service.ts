export function getStringSizeInBytes(text: string) {
  return new TextEncoder().encode(text).buffer.byteLength;
}
