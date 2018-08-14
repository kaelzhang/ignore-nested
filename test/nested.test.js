const test = require('ava')
// const log = require('util').debuglog('ignore-nested')
const forEach = require('lodash.foreach')

const CASES = require('./lib/cases')
const {
  parsePaths, prepare, getNativeGitIgnoreResults
} = require('./lib/prepare')

const {nested} = require('..')

const REGEX = /(?:(.+)\/)?\.gitignore$/
const getIgnoreSubPath = p => {
  const match = p.match(REGEX)
  return match
    ? match[1]
    : ''
}

CASES.forEach(([d, rules, pathsMap]) => {
  const {paths, result} = parsePaths(pathsMap)
  const dir = prepare(rules, paths)

  test(`case: ${d}`, t => {
    const git_paths = getNativeGitIgnoreResults(dir, paths)

    t.deepEqual(git_paths.sort(), result)
  })

  test(`nested: ${d}`, t => {
    const ignore = nested()

    forEach(rules, (content, p) => {
      const sub_path = getIgnoreSubPath(p)

      sub_path
        ? ignore.add(content, sub_path)
        : ignore.add(content)
    })

    const filtered = ignore.filter(paths)

    t.deepEqual(filtered, result)
  })
})
