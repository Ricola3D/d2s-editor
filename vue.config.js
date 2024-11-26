const Dotenv = require('dotenv-webpack')

module.exports = {
  pwa: {
    iconPaths: {
      faviconSVG: null,
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: null,
      maskIcon: null,
      msTileImage: null,
    },
  },
  configureWebpack: {
    entry: {
      app: './src/main.mjs',
    },
    devServer: {
      compress: true, // Enables gzip compression for everything served
      // historyApiFallback: false, // Error URL doesn't redirect to index app page, creating errors if globals from index.html are missing
    },
    devtool: 'source-map',
    plugins: [new Dotenv()],
  },
}
