const webpack = require('webpack');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: () => {
    return {
      module:{
        rules: [
          { test: /\.md$/, use: 'raw-loader' }
        ]
      },
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