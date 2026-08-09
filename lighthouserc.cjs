module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build:local && npm run serve:dist',
      startServerReadyPattern: 'Serving dist',
      startServerReadyTimeout: 120000,
      settings: {
        chromeFlags: '--no-sandbox',
      },
      url: [
        'http://127.0.0.1:4321/',
        'http://127.0.0.1:4321/privacy',
        'http://127.0.0.1:4321/terms',
        'http://127.0.0.1:4321/cookie-notice',
      ],
      numberOfRuns: 1,
    },
    assert: {
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
