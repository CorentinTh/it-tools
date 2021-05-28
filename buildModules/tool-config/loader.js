const YAML = require('yaml')

const loader = function (source, map) {
  this.callback(
    null,
    `export default function (Component) {
      Component.options.__toolConfig = ${JSON.stringify(YAML.parse(source))}
    }`,
    map
  )
}

module.exports = loader
