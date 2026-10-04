# TS / Rust 职责边界

[架构总览](README.md)

更新日期：2026-10-05。项目约定，模板以 `greet` 示例演示该边界（`App.vue` → `commands.rs` → `template-core`）。

## 原则

TypeScript 只做 UI：视图编排、展示状态、调用命令、渲染事件。文件 IO、进程与系统 API、存储、领域状态机、密钥管理等一切领域能力归 Rust；Tauri 命令层必须是薄转发层，领域数据结构常驻 Rust 内存，SQLite / 文件只做持久化。

判定口径：一段逻辑若与「画面怎么显示」无关，就不该出现在 `src-web/`；若它需要系统能力或跨命令共享状态，它属于 `src-rust/` 的业务 crate，而不是某个命令函数里的内联实现。

## 工作区布局与依赖方向

- `src-tauri/` 只有 Tauri 装配与命令层；业务 crate 放 `src-rust/<crate>/`，有真实需求才建。
- 依赖方向单向：`src-tauri` → 业务 crate；业务 crate 之间不得成环。
- 业务 crate 一律不依赖 tauri：保证可独立单测、可脱离窗口复用；对前端的类型经命令层序列化，不经业务 crate。

## 通信契约

- 命令：参数与返回类型在 Rust 定型后 TS 侧立即声明同型（`invoke` 无校验透传，见 [Rust 约定](../standards/rust.md)）。
- 长流程（流式输出、长任务进度）用 Rust 推事件，不用轮询 / `setTimeout` 变通。
- 错误统一 `Result<T, E>`，`E` 序列化为可判别结构（如 `{ code, message }`），前端按 `code` 分支，不文本匹配 message。
- 大数据（文件内容、大集合）经句柄 / 路径 / 摘要传递，不整包塞进 IPC。

## 工程默认

- 文件写入用原子写（tmp + rename）；密钥只留在 Rust 侧，永不进 webview。
- 消耗配额或长时间占用的后台任务默认关闭，由显式用户动作开启。

## 门禁

业务 crate 加入 members 后自动纳入全部门禁：`clippy --workspace`、`cargo test --workspace`、`llvm-cov --workspace --lib` 100% 行覆盖。各 crate 的 `lib.rs` 按装配不计覆盖率，逻辑必须放子模块并足额，口径见[测试规范](../standards/testing.md)。
