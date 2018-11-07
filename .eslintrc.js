module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    "jest/globals": true
  },
  extends: ["eslint:recommended", "standard-preact"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "jest"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
};
