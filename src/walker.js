const fs = require('fs')
const {
  isFunction, isString, isArray
} = require('core-util-is')

const searchIgnoreFile = ignoreFiles =>
  files => ignoreFiles.find(file => files.indexOf(file) !== - 1)

class Walker {
  constructor ({
    cwd,
    ignoreFile,
    follow
  }) {
    this._cwd = cwd
    this._getIgnoreFileFactory(ignoreFile)
    this._follow = follow
    this._files = []
  }

  _parseIgnoreFile (ignoreFile) {
    if (isFunction(ignoreFile)) {
      this._ignoreFile = ignoreFile
      return
    }

    if (isArray(ignoreFile)) {
      this._ignoreFile = searchIgnoreFile(ignoreFile)
      return
    }

    if (isString(ignoreFile)) {
      this._ignoreFile = () => ignoreFile
      return
    }

    throw new TypeError('options.ignoreFile is invalid')
  }

  walk () {

  }
}


class SyncWalker extends Walker {
  walk () {
    return this._files
  }
}
