import {Module} from '@nuxt/types'

interface MemoModuleOptions {
}

const toolConfigModule: Module<MemoModuleOptions> = function () {
  const {extendBuild} = this

  extendBuild((config) => {
    if (!config.module) {
      // eslint-disable-next-line no-console
      console.warn('Failed to register the memo module.')
      return
    }

    config.module.rules.push({
      resourceQuery: /blockType=memo/,
      loader: require.resolve('./loader.js')
    })
  })
}

export default toolConfigModule
