# 001 — 模板基线：bun + vue + ts + tauri 最小环境

- 状态：done
- 依赖：无
- 优先级：P0
- 创建 / 更新：2026-10-04 / 2026-10-05

## 目标与背景

自注塑成型 CAE 仓库（kairos）裁剪出一个 bun + vue + ts + tauri 的最小桌面模板：保留其验证过的工具链与质量门禁，移除全部领域代码，使新项目可以此为起点直接开工。本任务同时是本仓库 task 工作方式的示范记录。

## 必读

[架构总览](../architecture/README.md) · [构建与开发](../architecture/build-and-development.md) · [提交规范](../standards/commits.md) · [测试规范](../standards/testing.md)。

## 范围与非目标

交付：最小可运行骨架（`greet` IPC 示例 + 浏览器回退）、bun 聚合命令、verify 十项门禁、husky 格式钩子、三平台 CI、双端 100% 覆盖率门槛、knip、tinybench 基准示例、panta 式分层文档、图标与打包链路。

非目标：业务功能；状态管理 / 路由 / UI 组件库；移动端目标；发布自动化（release workflow）。这些等真实需求出现后各自立 task。

## 前置条件与待决策

- 前置：仓库以全新历史重新初始化，原 kairos 提交不再被引用；本任务记录即新历史的起点。
- 决策：依赖升级到 eslint ^10 / vite ^8 / vitest ^5.0.3 / knip ^6；TypeScript 停在 ^5.9（TS 7 尚无 typescript-eslint 支持）；Rust 工具链升 1.99.0。

## 实施步骤

1. `git rm` 全部领域代码与文档：src-crates、旧 ai-docs、scripts、.github、.husky、knip 配置、tests、src-web 与 src-tauri 的领域模块。
2. 重写最小骨架：`src-web/`（main.ts、App.vue、app.css、utils/greet.ts）与 `src-tauri/`（lib.rs、commands.rs、tauri.conf.json、capabilities）。
3. 重建门禁：vitest 覆盖率门槛、Rust 行覆盖门槛（装配文件不计）、knip.json、husky 格式钩子、拆分步骤的 ci.yml。
4. 文档体系重建为 panta 分层（architecture / standards / task-index / task）。
5. 全链验证并登记证据。

## 预计改动

本任务为仓库初建，改动即整个工作区；无既有接口或持久化兼容负担。

## 清理与兼容例外

删除项：kairos 全部领域代码与文档、旧 comment-style / docs-check 脚本、旧 coverage 脚本、release workflow、bench 旧链、coverage 旧口径。无兼容例外。

## 验收标准

- [x] `bun install` 后 `tauri:dev` 可开发、`dev` 可浏览器预览（浏览器路径实测；桌面路径经 1.98.1 打包验证）。
- [x] verify 十项在本地全绿（见验证记录；Rust 1.98.1 时期全过）。
- [x] Rust 门禁在 1.99.0 上复验通过（cargo check / clippy / test / coverage:rust）。
- [x] `tauri:build` 出包（1.99.0 上 msi + nsis 实测）。
- [x] 文档体系与仓库现状一致，无断链、无过期描述。

## 验证计划与结果

| 日期       | 命令（Windows 11）                                                   | 结果                                        |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------- |
| 2026-10-04 | `bun run verify`（Rust 1.98.1）                                      | 十项全过；前端覆盖率 100%                   |
| 2026-10-04 | `bun run tauri:build`                                                | msi + nsis 出包                             |
| 2026-10-05 | `typecheck` / `lint` / `test:coverage` / `knip` / `bench`（升级后）  | 全过                                        |
| 2026-10-05 | Rust 侧门禁（`cargo check` / clippy / test / coverage:rust，1.99.0） | verify 十项 exit 0；commands.rs 行覆盖 100% |
| 2026-10-05 | `bun run tauri:build`（1.99.0 + tauri 2.12.1）                       | msi 1.56 MiB + nsis 1.08 MiB 出包           |

## 风险与回退

1.99.0 的新 clippy lint 可能以 `-D warnings` 拦下代码。回退：把 `rust-toolchain.toml` 与 ci.yml 的 toolchain 改回 1.98.1（CI 同步两处）。

## 决策与工作记录

- 2026-10-04：创建任务。自 kairos 裁剪骨架；图标换通用立方体；依赖最小化（无状态库 / UI 库 / 额外插件），根 `Cargo.toml` 改虚拟工作区。
- 2026-10-05：依赖升到当前最新（eslint 10、vite 8、knip 6 等；TypeScript 停 5.9，TS 7 无 typescript-eslint 支持）。Rust 工具链升 1.99.0。覆盖率只统计逻辑文件：`greet` 移入 `commands.rs`，装配 `lib.rs` 不计。husky 只查格式，lint / test 归 CI（步骤拆分，不聚合）。
- 2026-10-05：环境配置聚合进 `bun install`（postinstall 执行 scripts/setup.mts）：装工具链、自愈半截安装、补装 cargo-llvm-cov；`bun run setup` 为手动入口。
- 2026-10-05：升 npm 侧 tauri 后须 `cargo update` 对齐 crate 版本，否则 bundler 报 version mismatch 拒绝打包（2.11.5 ↔ api 2.12.1 实测踩中）。对齐后 1.99.0 全链复验通过，任务关闭。

## 完成摘要

最小骨架、bun 聚合命令、十项门禁、husky / CI、panta 式文档与打包链路全部落地；1.99.0 上 verify 十项与 msi / nsis 打包复验通过。限制：浏览器预览路径无 IPC 属设计内回退；跨平台打包仅在 Windows 实测。
