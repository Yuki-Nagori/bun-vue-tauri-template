# 前端约定

更新日期：2026-10-04。除标注官方依据外均为项目约定。

## 逻辑归属

组件只做编排与渲染；可复用、可测试的逻辑放 `src-web/utils/` 并配单测，`<script setup>` 顶层不堆过程式逻辑，超过十行就抽函数。全局状态与路由在需求真实出现前不引入（当前模板无 pinia / vueuse / vue-router）。TS 侧只做 UI：领域与系统能力归 Rust，跨界规则见[职责边界](../architecture/ts-rust-boundary.md)。

## SFC 与类型

组件一律 `<script setup lang="ts">`；类型导入用 inline 形态 `import { type Foo }`（ESLint `consistent-type-imports` 强制）；函数写显式返回类型，ref 给显式初值。模板内避免 `<img src="/...">` 这类运行时资产解析——happy-dom 测试环境会踩 vite 资产解析错误，需要图形就用内联 SVG。

## 测试

测试目录镜像 `src-web`：`tests/web/utils/greet.test.ts` 对应 `src-web/utils/greet.ts`。mock IPC 统一写法：

```ts
vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));
```

完整示例见 `tests/web/App.test.ts`。异步 UI 断言用 `vi.waitFor`，不用 sleep 凑等待。门槛与口径见[测试规范](testing.md)。

## 排版分工

Prettier 独占排版，ESLint 只管质量规则：Vue 排版类规则（`max-attributes-per-line` 等）已关闭，`eslint-config-prettier` 兜底关停冲突项。格式争议以 `bun run format` 的输出为准，不手调。
