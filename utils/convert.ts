const base64ToString = (str: string) => Buffer.from(str, 'base64').toString('utf-8')
const stringToBase64 = (str: string) => Buffer.from(str, 'utf-8').toString('base64')

export {
  stringToBase64,
  base64ToString
}
