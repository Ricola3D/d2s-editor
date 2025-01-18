const fs = require('graceful-fs')

/*
If we have a ton of static files, it may pop "EMFILE: Too many open files" errors with the default memfs.
This plugin changes the default inputFileSystem from memfs to graceful-fs
*/
class GracefulFsPlugin {
  constructor(/*options*/) {}

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.afterEnvironment.tap('GracefulFsPlugin', () => {
      compiler.inputFileSystem = fs
      // compiler.outputFileSystem = fs
    })
  }
}

module.exports = GracefulFsPlugin
