export enum UNIT_BASE {
  BASE_2 = 1024,
  BASE_10 = 1000,
}

export function formatBytes(bytes: number, decimals = 2, base: UNIT_BASE = UNIT_BASE.BASE_2) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = base;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}
