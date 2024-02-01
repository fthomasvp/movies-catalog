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
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'drizzle'],
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

    // See https://eslint.org/docs/latest/rules/sort-imports
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],

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
