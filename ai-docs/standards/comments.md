# 注释规范

更新 / 查阅日期：2026-10-05。适用于所有自有代码（Rust / TypeScript / Vue）。与仓库其他标准同源；文档生成工具尚未配置，注释格式本身仍是契约。

## 官方依据

Rust 使用 `///` 记录条目文档、`//!` 记录包含它的模块或 crate 文档，支持 Markdown 与示例。[rustdoc](https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html)

TypeScript / Vue 使用 TSDoc 风格（JSDoc 子集）的 `/** ... */` 记录导出 API。[TSDoc](https://tsdoc.org/)

## 注释写什么

- 解释代码不容易表达的原因、约束和取舍：单位、路径分隔符、字节序、索引起点、平台差异（如 Windows 对混合分隔符 / 保留名的行为）。避免把代码逐句翻译成自然语言。
- 公共 API 说明输入输出、可恢复失败（Rust 用 `# Errors` 节）、panic 前提（`# Panics`）、unsafe 义务（`# Safety`）；只写与该接口实际相关的条目，不为简单 getter 填满空字段。
- 平台 quirk 与临时 workaround 说明触发条件、出处（上游 issue / task）与可移除条件，如「Windows 对被占用目标的 rename 报 ACCESS_DENIED，桌面前提下两者都视为占用」。
- 修改行为时同步注释与示例；删除无效注释、被注释掉的旧代码、作者 / 日期流水账——历史由 Git 与 task 记录保存。
- 项目文档与解释性注释默认中文，标识符与 API 名保留原文。

## Rust

- `///` 用于 pub 条目；`//!` 用于模块 / crate 头。按需增加 `# Errors` / `# Panics` / `# Safety` 节。
- 公开 unsafe 接口必须解释调用方义务；每处 unsafe 块用 `// SAFETY:` 说明前提为何在此成立，不能只写「这是安全的」。
- 错误映射等一行体委托**用具名函数**（如 `err_open`），不写 `map_err(|e| …)` 闭包——闭包体的错误分支几乎不可触达，会把 llvm-cov 行覆盖拖成永远差几个百分点；具名函数可直接单测。
- 示例代码有环境要求时明确说明，不为让测试变绿随意标 `ignore`。

## TypeScript / Vue

- 导出函数、组合式函数（`use*`）用 TSDoc：一句摘要；`@param` / `@returns` 仅在语义不明显时写。类型注解已有的信息不重复。
- 组件内用 `//` 说明局部原因；模板逻辑复杂到需要注释段时，先抽到 `<script setup>` 具名函数。

## TODO / FIXME 与评审

- 仅对明确的后续工作保留标记，格式 `TODO(task NNN): 原因；完成条件`；NNN 必须指向真实任务，尚无编号先建 task。
- 阻塞当前验收的缺陷必须修复或把 task 标 blocked，不能靠 TODO 伪装完成。
- 评审时检查：注释是否仍准确、契约（所有权 / 线程 / 单位 / 错误码）是否完整、任务引用是否有效。注释不能替代类型约束与边界检查。
