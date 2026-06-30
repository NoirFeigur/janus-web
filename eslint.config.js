import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import configPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  globalIgnores(['dist', 'node_modules', 'coverage', 'src/api/generated']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      pluginQuery.configs['flat/recommended'],
      configPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { import: pluginImport },
    rules: {
      // 类型安全硬约束（设计规范 §类型安全）：禁 any / 禁忽略指令。
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // import 排序，便于 review。
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // 模块边界（设计规范 §模块边界）—— feature 隔离 + 依赖只向下。
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/features/*/**',
              from: './src/features',
              except: ['./*/**'],
              message: 'feature 之间禁止直接 import；复用请下沉到 components/hooks/utils。',
            },
            {
              target: [
                './src/api',
                './src/stores',
                './src/lib',
                './src/components',
                './src/utils',
                './src/hooks',
              ],
              from: './src/features',
              message: '下层不得反向依赖 features。',
            },
            {
              target: './src/features',
              from: './src/pages',
              message: 'features 不得 import pages（页面是顶层编排层）。',
            },
            {
              target: './src/api/generated',
              from: ['./src/features', './src/app', './src/pages', './src/stores', './src/lib'],
              message: 'api/generated 是叶子，codegen 产物只被依赖、不依赖业务。',
            },
          ],
        },
      ],
    },
  },
  // 配置文件与测试放宽 type-checked 规则。
  {
    files: ['**/*.test.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
]);
