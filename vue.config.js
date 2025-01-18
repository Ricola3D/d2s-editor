// const { ProvidePlugin } = require('webpack');
const Dotenv = require('dotenv-webpack');
// const GracefulFsPlugin = require('./webpack-plugins/graceful-fs-webpack-plugin')
// const { minimatch } = require('minimatch')

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
  // Will be merged with default webpack config with webpack-merge
  configureWebpack: {
    entry: {
      app: './src/main.mjs',
    },
    devServer: {
      compress: true, // Enables gzip compression for everything served
      // historyApiFallback: false, // Error URL doesn't redirect to index app page, creating errors if globals from index.html are missing
    },
    devtool: 'source-map',
    plugins: [
      new Dotenv(), // Use .env files. Otherwise could use webpack.DefinePlugin.
      // new ProvidePlugin({
      //   $: 'jquery',
      //   jquery: 'jquery',
      //   'window.jQuery': 'jquery',
      //   jQuery: 'jquery',
      // }),
      // new GracefulFsPlugin(), // If we have a ton of files (for instance item pictures), it may pop "EMFILE: Too many open files" errors with the default memfs
    ],
  },
  // A function that will receive an instance of ChainableConfig powered by webpack-chain. Allows for more fine-grained modification of the internal webpack config. Often used to modify/add loaders.
  chainWebpack: (config) => {
    // console.log(config)
    // Optimize the CopyWebpackPlugin that copies static files
    config.plugin('copy').tap(([options]) => {
      // console.log(options)
      // CopyWebpackPlugin. Pattern 0 is copying public/ to dist/
      // To gain build time & avoid "EMFILE: Too many open files" errors: Do not copy dc6/sprite files, we already have generated PNGs
      options.patterns[0].globOptions.ignore.push(
        '**/d2/game_data/**/*.dc6',
        '**/d2/game_data/**/*.DC6', // Globs are case sensitive
        '**/d2/game_data/**/*.sprite',
      );
      options.options = { concurrency: 100 }; // To avoid "EMFILE: Too many open files" errors, limit concurrency calls to fs

      return [options];
    });
  },
};
