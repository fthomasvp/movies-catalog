module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:drizzle/recommended',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['**/**/*.test.ts'],
      env: {
        jest: true,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'drizzle', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // Enforce using "type" instead of "interface"
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    // Sort imports - See https://github.com/lydell/eslint-plugin-simple-import-sort/
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // [Drizzle] - See https://www.npmjs.com/package/eslint-plugin-drizzle
    'drizzle/enforce-delete-with-where': [
      'error',
      { drizzleObjectName: ['db'] },
    ],
    'drizzle/enforce-update-with-where': [
      'error',
      { drizzleObjectName: ['db'] },
    ],
  },
};
