const webpack = require('webpack');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: () => {
    return {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'APPLICATION_VERSION': JSON.stringify(require('./package.json').version),
          }
        })
      ]
    }
  }
}