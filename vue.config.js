const Dotenv = require('dotenv-webpack');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new Dotenv()
    ]
  }
}
