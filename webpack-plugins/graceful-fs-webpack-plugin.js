const fs = require('graceful-fs')

class GracefulFsPlugin {
  constructor(/*options*/) {}

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.afterEnvironment.tap('GracefulFsPlugin', () => {
      compiler.outputFileSystem = fs
    })
  }
}

module.exports = GracefulFsPlugin
