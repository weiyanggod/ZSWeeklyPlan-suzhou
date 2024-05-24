/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    'vue/component-name-in-template-casing': ['warn', 'kebab-case'],
    'vue/multi-word-component-names': 'off',
    'prefer-destructuring': 'off',
    'no-plusplus': 'off',
    'vue/no-multiple-template-root': 0,
  },

  globals: {
    uni: 'readonly',
    plus: 'readonly',
    getCurrentPages: 'readonly',
    getApp: 'readonly',
  },
  ignorePatterns: ['./pages.json', 'uni_modules', 'unpackage'],
}
