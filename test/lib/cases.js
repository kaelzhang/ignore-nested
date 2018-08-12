module.exports = [
  [
    'a',
    {
      '.gitignore': `*.js`,
      'a/.gitignore': `!a.js`,
      'b.js/.gitignore': `!a.js`
    },
    {
      'a.js': 1,
      'a/a.js': 0,
      'b.js/a.js': 1
    }
  ]
]
