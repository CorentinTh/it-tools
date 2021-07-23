import { Plugin } from '@nuxt/types'

const pwaUpdatePlugin: Plugin = async () => {
  // @ts-ignore
  const workbox = await window.$workbox

  if (!workbox) {
    // eslint-disable-next-line no-console
    console.debug("Workbox couldn't be loaded.")
    return
  }

  workbox.addEventListener('installed', (event: { isUpdate: boolean }) => {
    if (!event.isUpdate) {
      // eslint-disable-next-line no-console
      console.debug('The PWA is on the latest version.')
      return
    }

    // eslint-disable-next-line no-console
    console.debug('There is an update for the PWA, reloading...')
    window.location.reload()
  })
}

export default pwaUpdatePlugin
