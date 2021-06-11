import {Component, Vue} from 'nuxt-property-decorator'

const copyToClipboard = (text: string) => {
  const input = document.createElement('textarea')
  input.innerHTML = text
  document.body.appendChild(input)
  input.select()
  const result = document.execCommand('copy')
  document.body.removeChild(input)
  return result
}

@Component
export class CopyableMixin extends Vue {
  copy(text: string|number, toastText = 'Copied to clipboard !') {
    copyToClipboard(String(text))
    this.$toast.success(toastText)
  }
}
