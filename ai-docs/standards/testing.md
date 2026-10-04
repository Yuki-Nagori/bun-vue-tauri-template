# 测试规范

更新日期：2026-10-04。均为项目约定。

## 测试位置与写法

前端测试在 `tests/web/`，目录镜像 `src-web`；组件行为用 `@vue/test-utils` + happy-dom，IPC mock 模式见[前端约定](frontend.md)。Rust 命令的单测贴近源码（`commands.rs` 的 `mod tests`），业务 crate 的公开 API 测试随 crate 走。异步断言用 `vi.waitFor`；Rust 侧失败路径与正常路径都要有断言。

## 覆盖率门槛（verify 两项）

- 前端 `bun run test:coverage`：v8 provider，只统计逻辑层——`src-web/{utils,stores,composables}` 与组件旁 `use*.ts`；行 / 分支 / 函数 / 语句四项 100%。`main.ts` 是装配、api 是薄封装、`bench/` 是基准，均不入门槛。
- Rust `bun run coverage:rust`：`cargo llvm-cov --workspace --lib --show-missing-lines --fail-under-lines 100`，各 crate 的 `lib.rs`（装配：Builder、模块声明与 re-export，不可测）经 `--ignore-filename-regex lib\.rs$` 不计；`commands.rs` 与业务 crate 的逻辑文件（现例 `template-core/src/greeting.rs`）必须足额——业务 crate 的逻辑因此放子模块，不放 `lib.rs`。前置组件与安装见[构建与开发](../architecture/build-and-development.md)。

改门槛口径（include 白名单、忽略正则、阈值数字）属于门禁变更：先在 task 里给出理由与新口径的验证结果，再动配置。

## 死代码检查

`bun run knip` 检查未用依赖、导出与文件，配置在 `knip.json`：entry 是 `index.html`、`tests/web/**/*.test.ts`、`src-web/bench/*.ts`。新依赖装了没用、导出无人消费，knip 会拦下；确属工具链需要而 knip 误报时，在 `knip.json` 的 `ignoreDependencies` 登记并注释原因。

## 基准

`bun run bench` 跑 `src-web/bench/` 下的 tinybench 示例，用于验证基准链路可用。性能结论要可靠对比（同机器、同口径、多次采样），临时性结论写进对应 task，不进规范；需要持续跟踪性能时再登记专门 task 扩建基准集。
