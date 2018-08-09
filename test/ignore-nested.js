const {test} = require('ava')
const ignore_nested = require('../src')
const log = require('util').debuglog('ignore-nested')

test('description', t => {
  t.is(true, true)
})
