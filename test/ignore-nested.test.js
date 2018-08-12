const {test} = require('ava')
const log = require('util').debuglog('ignore-nested')

const CASES = require('./lib/cases')
const {
  parsePaths, prepare, getNativeGitIgnoreResults
} = require('./lib/prepare')

CASES.forEach(([d, rules, pathsMap]) => {
  const {paths, result} = parsePaths(pathsMap)
  const dir = prepare(rules, paths)

  test(`case: ${d}`, t => {
    const git_paths = getNativeGitIgnoreResults(dir, paths)

    t.deepEqual(result.sort(), git_paths.sort())
  })
})
