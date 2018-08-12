const spawn = require('spawn-sync')
const tmp = require('tmp').dirSync
const mkdirp = require('mkdirp').sync
const rm = require('rimraf').sync
const fs = require('fs')
const path = require('path')
const {removeEnding} = require('pre-suf')
const forEach = require('lodash.foreach')

const {sep} = path

const touch = (root, file, content) => {
  const dirs = file.split(sep)
  const basename = dirs.pop()

  const dir = dirs.join(sep)

  if (dir) {
    mkdirp(path.join(root, dir))
  }

  // abc/ -> should not create file, but only dir
  if (basename) {
    fs.writeFileSync(path.join(root, file), content || '')
  }
}

let tmpCount = 0
const tmpRoot = tmp().name

const createUniqueTmp = () => {
  const dir = path.join(tmpRoot, String(tmpCount ++))
  // Make sure the dir not exists,
  // clean up dirty things
  rm(dir)
  mkdirp(dir)
  return dir
}

const parsePaths = pathsMap => {
  const paths = Object.keys(pathsMap).sort()
  const result = paths.filter(p => !pathsMap[p])

  return {
    paths,
    result
  }
}

const prepare = (rules, paths) => {
  const dir = createUniqueTmp()

  forEach(rules, (content, ignore_file) => {
    touch(dir, ignore_file, content)
  })

  paths.forEach(p => {
    touch(dir, p, '')
  })

  return dir
}

const getNativeGitIgnoreResults = (dir, paths) => {
  spawn('git', ['init'], {
    cwd: dir
  })

  spawn('git', ['add', '-A'], {
    cwd: dir
  })

  return paths
  .filter(p => {
    let out = spawn('git', [
      'check-ignore',
      // `spawn` will escape the special cases for us
      p
    ], {
      cwd: dir
    }).stdout.toString()

    out = removeEnding(out, '\n')

    const ignored = out === p
    return !ignored
  })
}

module.exports = {
  parsePaths,
  prepare,
  getNativeGitIgnoreResults
}
