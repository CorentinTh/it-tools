export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) {
    return '0 字节';
  }

  const k = 1024;
  const sizes = ['字节', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}
