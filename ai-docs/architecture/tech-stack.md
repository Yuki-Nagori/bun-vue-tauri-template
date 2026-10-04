# 技术栈

[架构总览](README.md)

精确小版本以 `bun.lock` 与根 `Cargo.lock` 为准，本文只维护主版本口径；升级后同步本表。

| 层                | 选型                                 | 版本口径                             | 职责                                   | 配置位置                    |
| ----------------- | ------------------------------------ | ------------------------------------ | -------------------------------------- | --------------------------- |
| 包管理 / 脚本聚合 | Bun                                  | ^1                                   | 依赖管理与全部命令入口                 | `package.json`              |
| UI 框架           | Vue                                  | ^3.5                                 | 视图与 UI 编排（`<script setup>`）     | `src-web/`                  |
| 语言              | TypeScript                           | ^5.9（strict 全开）                  | 前端类型安全                           | `tsconfig.json`             |
| 构建              | Vite                                 | ^8                                   | dev server（端口 1420 固定）与生产构建 | `vite.config.ts`            |
| 桌面壳            | Tauri                                | ^2                                   | 窗口、系统集成、跨平台打包             | `src-tauri/tauri.conf.json` |
| 系统语言          | Rust                                 | 1.99.0（`rust-toolchain.toml` 锁定） | 命令层与未来业务 crate                 | `src-tauri/`                |
| 前端测试          | Vitest + happy-dom + @vue/test-utils | ^5                                   | 单测与覆盖率门槛                       | `vitest.config.ts`          |
| Rust 测试         | cargo test / cargo-llvm-cov          | 工具链 + 独立子命令                  | 单测与覆盖率门槛                       | `package.json`              |
| 格式化            | Prettier / rustfmt                   | ^3 / 工具链内置                      | 排版唯一权威                           | `.prettierrc.json`          |
| Lint              | ESLint / clippy                      | ^10 / 工具链内置                     | 质量规则（不管排版）                   | `eslint.config.js`          |
| 死代码检查        | knip                                 | ^6                                   | 未用依赖、导出与文件                   | `knip.json`                 |
| 基准              | tinybench                            | ^6                                   | 前端微基准示例                         | `src-web/bench/`            |

TypeScript 停在 5.x：TypeScript 7 尚无 typescript-eslint 支持，等工具链跟上再升。npm 镜像可能缺失部分包的 `latest` dist-tag，`bun update --latest` 报 tag not found 时按 `bun outdated` 的具体版本号手动写入 `package.json`。

## IPC 通道

前端 `@tauri-apps/api/core` 的 `invoke(name, args)` ↔ Rust `#[tauri::command]`，命令注册在 `src-tauri/src/lib.rs` 的 `generate_handler![]`；插件与系统能力经 `src-tauri/capabilities/default.json` 声明权限，模板默认只有 `core:default`。可运行示例：`commands::greet` ↔ `src-web/App.vue`。

## CI

`.github/workflows/ci.yml` 在 push main 与 PR 时于三平台（macOS / Windows / Ubuntu）逐步执行与 verify 相同的十项检查——拆成具名步骤而非聚合调用，失败直接定位到具体门禁；Linux 额外安装 Tauri 系统依赖，三平台均安装 cargo-llvm-cov。
