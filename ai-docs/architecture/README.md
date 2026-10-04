# 架构总览

[任务索引](../task-index.md) · [规范索引](../standards/README.md)

## 主题导航

| 主题                         | 文档                                   | 范围   |
| ---------------------------- | -------------------------------------- | ------ |
| 选型、版本口径与 IPC         | [技术栈](tech-stack.md)                | 本仓库 |
| 目录与模块归属               | [目录规划](repository-layout.md)       | 本仓库 |
| TS / Rust 职责边界与通信契约 | [职责边界](ts-rust-boundary.md)        | 本仓库 |
| 构建、门禁、打包与模板启用   | [构建与开发](build-and-development.md) | 本仓库 |

## 当前状态

这是一个最小可运行的桌面模板：前端只有 `App.vue` 与 `utils/greet.ts`；Rust 侧一个 `greet` 命令转发到业务 crate `template-core`，演示 `invoke` 往返与 `src-tauri` → `src-rust` 依赖方向。状态管理、路由、更多业务 crate 均未引入，本文档不把它们写成已有能力。clone 后按[构建与开发](build-and-development.md)的启用清单改名、换图标，即可开始真实业务。

## 分层和依赖方向

```text
src-web（Vue + TypeScript，UI 编排与展示逻辑）
  │ invoke()
  ▼
src-tauri（#[tauri::command] 命令层，保持薄）
  ▼
src-rust/（业务 crate：template-core；不依赖 tauri，真实业务在此新建 crate）
```

可复用的前端逻辑放 `src-web/utils/` 并配单测；组件只做编排。跨端类型在 Rust 定型后由 TS 侧同步声明，`invoke` 本身不做校验。边界细则与通信契约见[职责边界](ts-rust-boundary.md)。

## 文档边界

架构文档说明目标与已验证的边界；项目选型与版本口径集中在[技术栈](tech-stack.md)，不另维护第二份版本表；单次工作的范围、决策与验证证据写在对应 task 里。
