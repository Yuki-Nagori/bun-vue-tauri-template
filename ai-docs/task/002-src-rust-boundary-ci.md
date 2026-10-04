# 002 — src-rust 业务 crate、职责边界与注释规范、CI 优化

- 状态：done
- 依赖：001
- 优先级：P1
- 创建 / 更新：2026-10-05 / 2026-10-05

## 目标与背景

模板在 mythos（Yuki-Nagori/mythos）实际推进中暴露三处不足：纯 Rust 业务无处安放（只能先堆在命令层，与 tauri 耦合）；TS / Rust 职责划分与注释写法无成文规则（靠口头约定，评审无依据）；CI 步骤重复（cargo check 与 clippy、cargo test 与 llvm-cov 各编译一遍）且慢门禁前置浪费失败定位时间。本次把 mythos 的落地经验回灌模板。

## 必读

[架构总览](../architecture/README.md) · [目录规划](../architecture/repository-layout.md) · [Rust 约定](../standards/rust.md) · [测试规范](../standards/testing.md) · [构建与开发](../architecture/build-and-development.md)。

## 范围与非目标

交付：`src-rust/template-core` 纯业务 crate（greet 逻辑迁入，不依赖 tauri）；新文档 `architecture/ts-rust-boundary.md` 与 `standards/comments.md` 并全线接线；ci.yml 优化（快门禁前置、合并 Rust 编译类步骤、doc-only 不触发、cache-on-failure、timeout、permissions）；coverage:rust 输出改 `--show-missing-lines`；受影响文档同步。

非目标：新增业务功能或更多 crate；改 verify 十项构成；移动端 / 发布自动化。

## 前置条件与待决策

- 决策：业务 crate 的 `lib.rs` 只做装配与 re-export——覆盖率忽略正则 `lib\.rs$` 按文件名匹配所有 crate 的 `lib.rs`，逻辑放子模块才足额；不改正则，沿用「lib.rs 是装配」既有口径。
- 决策：CI 不单列 `cargo check` / `cargo test`（clippy `--all-targets` 含类型检查、llvm-cov 带插桩跑测试），本地 verify 仍十项全跑，口径见 tech-stack 的 CI 节。

## 实施步骤

1. 建 `src-rust/template-core`（lib.rs 装配 + greeting.rs 逻辑与单测），加入 members 与 `[workspace.dependencies]`；`commands.rs` 改转发并留命令单测。
2. 写 ts-rust-boundary.md（原则 / 布局与依赖方向 / 通信契约 / 工程默认 / 门禁）与 comments.md（自 mythos 同名规范裁剪）。
3. ci.yml 按「快门禁前置、Rust 编译类在后」重排并补 paths-ignore / permissions / timeout / cache-on-failure。
4. 文档联动：AGENTS 路由与速查、两个 README 索引、repository-layout、rust、frontend、testing、build-and-development、tech-stack、task-index。
5. 全链验证并登记证据。

## 预计改动

新增：`src-rust/template-core/`（Cargo.toml、src/lib.rs、src/greeting.rs）、`ai-docs/architecture/ts-rust-boundary.md`、`ai-docs/standards/comments.md`、`ai-docs/task/002-*.md`。修改：根 `Cargo.toml`、`src-tauri/Cargo.toml`、`src-tauri/src/commands.rs`、`package.json`（coverage:rust 旗标）、`.github/workflows/ci.yml`、上节所列文档、`Cargo.lock`（新成员条目）。

## 验收标准

- [x] `cargo check / clippy / test --workspace` 覆盖新 crate，业务 crate 无 tauri 依赖。
- [x] verify 十项本地全绿；llvm-cov 行覆盖 100%（commands.rs 与 greeting.rs 足额，两处 lib.rs 不计）。
- [x] 新文档彼此链接、无断链、无过期描述；CI 描述与 yml 实际一致。
- [x] 示例行为不变：`invoke("greet")` 与浏览器回退文案一致。

## 验证计划与结果

| 日期       | 命令（Windows 11）                 | 实际结果                             |
| ---------- | ---------------------------------- | ------------------------------------ |
| 2026-10-05 | `cargo check --workspace`          | 过；Cargo.lock 增 template-core 条目 |
| 2026-10-05 | `bun run verify`                   | 十项全过，双端覆盖率 100%            |
| 2026-10-05 | `git grep` 复查 template-core 依赖 | 仅 path 依赖 serde 未引入，无 tauri  |

## 风险与回退

CI 合并步骤后，未来 `tests/` 集成测试与 doc test 不被 `llvm-cov --lib` 执行——引入时需在 CI 补 `cargo test --workspace` 步骤。回退：ci.yml 与 package.json 均为单文件，revert 即恢复。

## 决策与工作记录

- 2026-10-05：创建任务。依据 mythos 的 src-rust/mythos-store 布局、同名 ts-rust-boundary 与 comments 规范、优化后 CI 裁剪回灌；crate 示例取 greet 逻辑保持模板自洽。

## 完成摘要

`src-rust/template-core` 落地并纳入全部门禁，src-tauri 收敛为薄命令层；ts-rust-boundary 与 comments 两份规范成文并接线十处文档；CI 快门禁前置、Rust 编译类步骤合并、doc-only 不触发。verify 十项全过，示例 IPC 行为不变。
