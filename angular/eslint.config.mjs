import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  { ignores: ['dist/**', '.angular/**', 'coverage/**'] },
  {
    files: ['**/*.ts'],
    extends: [...angular.configs.tsRecommended],
    languageOptions: { parser: tseslint.parser },
    processor: angular.processInlineTemplates,
    plugins: { 'unused-imports': unusedImports },
    rules: {
      '@angular-eslint/prefer-inject': 'off',
      // Preserve existing subscription-based components during the Angular upgrade.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/directive-selector': ['error', {
        type: 'attribute', prefix: 'shpp', style: 'camelCase'
      }],
      '@angular-eslint/component-selector': ['error', {
        type: 'element', prefix: 'shpp', style: 'kebab-case'
      }],
      'unused-imports/no-unused-imports': 'error'
    }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended]
  }
);
