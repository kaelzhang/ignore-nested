module.exports = [
  [
    'ignore rule not found',
    {},
    {
      'a.js': 0,
      'a/a.js': 0,
      'a/a/a.js': 0
    }
  ],
  [
    'ignored by previous rules, not matched by current rules',
    {
      '.gitignore': `*.js`,
      'a/b/.gitignore': `!c`
    },
    {
      'a/b/c.js': 1,
      'a/b/c/d.js': 1
    }
  ],
  [
    'parent directory ignored',
    {
      '.gitignore': `
c
*.js
`,
      'a/.gitignore': `
/b/c/d.js
`
    },
    {
      // c is ignored
      'a/b/c/d.js': 1
    }
  ],
  [
    'deep directories',
    {
      '.gitignore': `*.js`,
      'A/B/.gitignore': `!a.js`,
    },
    {
      'a.js': 1,
      'A/a.js': 1,
      'A/B/a.js': 0,
      'A/B/b.js': 1
    }
  ],
  [
    'parent directory ignored then unignored',
    {
      '.gitignore': 'baz',
      'foo/bar/.gitignore': '!baz'
    },
    {
      'foo/bar/baz/quux/a.js': 0
    }
  ],
]
