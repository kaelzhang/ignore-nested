// The nested ignore manager

const factory = require('ignore')
const {sep} = require('path')

const EMPTY = ''

class Nested {
  constructor (options) {
    this._options = options
    this._rules = Object.create(null)
  }

  add (pattern, sub = EMPTY) {
    const paths = sub.split(sep)
    const ignore = this._getOrCreateIgnore(paths)

    ignore.add(pattern)

    return this
  }

  _getOrCreateIgnore (paths) {
    const p = paths.join(sep)

    return this._rules[p] || (
      this._rules[p] = factory(this._options)
    )
  }

  _getLatestIgnore (paths) {
    let i = paths.length
    let found = this._rules[EMPTY]
    let rest = paths

    while (i > 0) {
      const p = rest.join(sep)
      const ignore = this._rules[p]

      if (ignore) {
        found = ignore
        break
      }

      rest = paths.slice(0, -- i)
    }

    // [A, B] -> [A, B/]
    // https://github.com/kaelzhang/node-ignore#2-filenames-and-dirnames
    if (rest.length) {
      rest[rest.length - 1] += sep
    }

    return {
      rest,
      paths: paths.slice(i),
      ignore: found
    }
  }

  // ROOT/
  //     |-- .gitignore (x)
  //     |-- A/
  //         |-- B/
  //               |-- .gitignore (y)
  //               |-- a.js

  // ROOT/A/B/a.js ->
  // Round 1: [A, B, a.js]
  // - f: a.js
  // - ignore: y
  // - paths: [] -> file: a.js
  // - rest: [A, B/]
  // Round 2: [A, B/],
  // - f: B/
  // - ignore: x
  // - paths: [A] -> file: A/B/
  // - rest: []
  _test (previous, target, noTestParent) {
    const {
      //
      ignore,
      paths,
      rest
    } = this._getLatestIgnore(previous)

    // No ignore rules found, do not ignore
    if (!ignore) {
      return {
        ignored: false,
        unignored: false
      }
    }

    paths.push(target)
    const pathname = paths.join(sep)

    if (!rest.length) {
      return ignore.test(pathname)
    }

    if (!noTestParent) {
      const parentTestResult = this._test(rest)
      // If the parent directory is ignored, the target is also ignored.
      if (parentTestResult.ignored) {
        return parentTestResult
      }
    }

    const targetTestResult = ignore.test(pathname)
    if (targetTestResult.ignored !== targetTestResult.unignored) {
      return targetTestResult
    }

    const parentDir = rest.pop()
    const largerTarget = parentDir + pathname
    return this._test(rest, largerTarget, true)
  }

  ignores (p, noTestParent) {
    const splitted = p.split(sep)

    // ['foo', '/'] -> ['foo/']
    const last = splitted[splitted.length - 1]
    if (last === EMPTY) {
      splitted.pop()
      splitted[splitted.length - 1] += sep
    }

    const f = splitted.pop()
    return this._test(splitted, f, noTestParent).ignored
  }

  filter (paths) {
    return paths.filter(p => !this.ignores(p))
  }
}

module.exports = Nested
