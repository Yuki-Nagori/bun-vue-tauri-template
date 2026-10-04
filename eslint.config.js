import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

// .ts 与 .vue 的 <script setup> 共用同一套 TS 规则。
const tsRules = {
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { prefer: "type-imports", fixStyle: "inline-type-imports" },
  ],
  "@typescript-eslint/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
  ],
};

export default tseslint.config(
  { ignores: ["dist/**", "coverage/**", "src-tauri/**", "target/**", "node_modules/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["**/*.ts"], rules: tsRules },
  // SFC 脚本块由 TS 解析器接管；no-undef 读不懂 TS 类型，真值检查归 vue-tsc。
  ...pluginVue.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.vue"],
    rules: {
      ...config.rules,
      "no-undef": "off",
      // 排版归 prettier，关掉会打架的 Vue 排版规则。
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/attributes-order": "off",
    },
  })),
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser, extraFileExtensions: [".vue"] },
    },
    rules: tsRules,
  },
  { files: ["src-web/App.vue"], rules: { "vue/multi-word-component-names": "off" } },
  // 必须最后：关停上面全部与 prettier 冲突的规则。
  eslintConfigPrettier,
);
