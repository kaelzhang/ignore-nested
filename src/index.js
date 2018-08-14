const Nested = require('./nested')
const {
  Walker,
  SyncWalker
} = require('./walker')

exports.nested = options => new Nested(options)
exports.walk = options => new Walker(options).walk()
exports.walkSync = options => new SyncWalker(options).walk()
