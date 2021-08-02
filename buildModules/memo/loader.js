const loader = function (source, map) {
  this.callback(
    null,
    `export default function (Component) {
      Component.options.__memo = ${JSON.stringify(source)}
    }`,
    map
  )
}

module.exports = loader
