const copyToClipboard = (text: string) => {
  const input = document.createElement('textarea')
  input.innerHTML = text
  document.body.appendChild(input)
  input.select()
  const result = document.execCommand('copy')
  document.body.removeChild(input)
  return result
}

export const copyable = {
  methods: {
    copy(text: string, toastText = 'Copied to clipboard !') {
      copyToClipboard(text)
      this.$toast.success(toastText)
    }
  }
}
