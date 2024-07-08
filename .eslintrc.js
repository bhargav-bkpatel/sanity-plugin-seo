module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: ['prettier', '@typescript-eslint', 'jest'],
  extends: [
    'prettier',
    'airbnb',
    'airbnb-typescript',
    '@sanity/eslint-config-studio',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true, optionalDependencies: true, peerDependencies: true }
    ],
    'react/prop-types': 'off', // Since we do not use prop-types
    'react/require-default-props': 'off', // Since we do not use prop-types
    'no-underscore-dangle': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: ['arrow-function', 'function-declaration'],
        unnamedComponents: 'arrow-function'
      }
    ],
    'no-unused-vars': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        endOfLine: 'auto'
      }
    ]
  }
};
