const base64ToString = (str: string) => Buffer.from(str, 'base64').toString('utf-8')
const stringToBase64 = (str: string) => Buffer.from(str, 'utf-8').toString('base64')

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

export {
  stringToBase64,
  base64ToString,
  formatBytes
}
