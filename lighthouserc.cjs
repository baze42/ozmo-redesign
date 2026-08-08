module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview -- --host 127.0.0.1',
      url: [
        'http://127.0.0.1:4321/',
        'http://127.0.0.1:4321/services',
        'http://127.0.0.1:4321/free-site-audit',
        'http://127.0.0.1:4321/schedule',
      ],
      numberOfRuns: 1,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'total-byte-weight': ['error', { maxNumericValue: 1048576 }],
      },
    },
  },
};
