import {readdirSync, readFileSync} from 'fs'
import path, {join} from 'path'
import {Module} from '@nuxt/types'
import {NuxtRouteConfig} from '@nuxt/types/config/router'
import YAML from 'yaml'
import {capitalise} from '../../utils/string'

const toolDirName = 'tools'
const rootDir = join(__dirname, '..', '..')
const toolsDir = join(rootDir, toolDirName)

interface toolConfigModuleOptions {
}

function getTools() {
  const categories = readdirSync(toolsDir)
  const toolList: { [key: string]: any[] } = {}

  for (const category of categories) {
    const categoryDir = join(toolsDir, category)
    const categoryFormatted = capitalise(category)

    toolList[categoryFormatted] = readdirSync(categoryDir).map((toolFileName) => {
      const toolPath = join(categoryDir, toolFileName)
      const contentMatch = readFileSync(toolPath, 'utf8').match(/<tool(\s[^>\s]*)*>([\S\s.]*?)<\/tool>/)

      return contentMatch
        ? {
            ...YAML.parse(contentMatch[2]),
            componentPath: join(toolDirName, category, toolFileName)
          }
        : null
    }).filter(v => v !== null)
  }

  return toolList
}

const toolConfigModule: Module<toolConfigModuleOptions> = function () {
  const {nuxt, extendBuild, addPlugin} = this
  const toolList = getTools()
  const toolListFlat = Object.values(toolList).flat()

  nuxt.hook('build:extendRoutes', (routes: NuxtRouteConfig[]) => {
    toolListFlat.forEach((toolConfig) => {
      const {path = '', title, componentPath} = toolConfig
      const name = title.toLowerCase().split(/\s/).join('-').replace(/\.vue$/, '')

      const newRoute: NuxtRouteConfig = {
        name,
        path,
        component: join(rootDir, componentPath),
        chunkName: componentPath.replace(/\.vue$/, '')
      }

      routes.push(newRoute)
    })

    nuxt.options.publicRuntimeConfig.toolList = toolList
  })

  extendBuild((config) => {
    if (!config.module) {
      // eslint-disable-next-line no-console
      console.warn('Failed to register the tool-config module.')
      return
    }

    config.module.rules.push({
      resourceQuery: /blockType=tool/,
      loader: require.resolve('./loader.js')
    })
  })

  addPlugin({
    src: path.resolve(__dirname, 'plugin.ts'),
    fileName: 'tool-config/plugin.ts',
    options: {
      toolList,
      toolListFlat
    }
  })
}

export default toolConfigModule
