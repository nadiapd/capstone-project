// import js from "@eslint/js";
// import globals from "globals";
// import json from "@eslint/json";
// import css from "@eslint/css";

// export default [
//   // 1. Konfigurasi untuk file ESM (termasuk config ini sendiri)
//   {
//     files: ["**/*.mjs"],
//     languageOptions: {
//       sourceType: "module",
//       globals: {
//         ...globals.node,
//       },
//     },
//   },

//   // 2. Konfigurasi utama untuk kode Express Anda (CommonJS)
//   {
//     files: ["src/**/*.js", "app.js", "server.js", "seed-admin.js"],
//     ...js.configs.recommended,
//     languageOptions: {
//       sourceType: "commonjs", 
//       globals: {
//         ...globals.node,
//         ...globals.browser,
//       },
//     },
//     rules: {
//       "no-unused-vars": "warn",
//     },
//   },

//   // 3. Konfigurasi JSON
//   {
//     files: ["**/*.json"],
//     plugins: { json },
//     language: "json/json",
//     rules: {
//       ...json.configs.recommended.rules,
//     },
//   },

//   // 4. Konfigurasi CSS
//   {
//     files: ["**/*.css"],
//     plugins: { css },
//     language: "css/css",
//     rules: {
//       ...css.configs.recommended.rules,
//     },
//   },

//   {
//     ignores: [
//       "node_modules/",
//       "bin/",
//       "src/views/**/*.hbs",
//     ],
//   },
// ];

import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'

const isProduction = process.env.NODE_ENV === 'production'

export default [
  {
    // Terapkan ke semua file JS
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      // Aturan Dasar (Logika)
      'no-console': isProduction ? 'error' : 'warn',
      'no-debugger': isProduction ? 'error' : 'warn',
      'no-unused-vars': isProduction ? 'error' : 'warn',

      // Aturan Style (Mirip konfigurasi Nuxt kamu)
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always'
        }
      ]
    }
  },
  {
    // Khusus file config agar tidak error pakai 'import'
    files: ['eslint.config.mjs'],
    languageOptions: { sourceType: 'module' }
  },
  {
    // Abaikan HBS (Karena ESLint tidak bisa handle indentasi HBS)
    ignores: [
      'node_modules/',
      'bin/',
      'src/views/**/*.hbs'
    ]
  }
]