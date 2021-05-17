const downloadBase64File = (dataUrl: string, name = 'file') => {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = name
  a.click()
}

export {
  downloadBase64File
}
