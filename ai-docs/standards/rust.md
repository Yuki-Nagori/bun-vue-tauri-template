# Rust / Tauri 约定

更新日期：2026-10-04。除标注官方依据外均为项目约定。

## 命令层

`#[tauri::command]` 只做解参数、调逻辑、回包，命令集中在 `src-tauri/src/commands.rs`；单个命令超过一屏就把逻辑抽成普通函数或独立 crate。新命令三步：定义 → `generate_handler![]`（`lib.rs`）注册 → 用到插件 / 系统能力时在 `capabilities/default.json` 加权限（模板默认只有 `core:default`）。

invoke 的 args 对象按 camelCase 匹配 Rust snake_case 形参（[Tauri 命令文档](https://tauri.app/develop/calling-rust/)，2026-10-04 查阅）：单词形参无感，多词形参（`case_dir` ↔ `caseDir`）留意。参数与返回类型在 Rust 定型后，TS 侧立即声明同型——`invoke` 是无校验透传，两端口径漂移是最常见的静默 bug。

错误处理模板未定全局契约；建议命令返回 `Result<T, E>` 且 `E` 序列化为可判别结构（如 `{ code, message }`），前端按 `code` 分支，不文本匹配 message。

## Cargo 工作区

根 `Cargo.toml` 是虚拟 manifest：只放 `members`、`[workspace.dependencies]` 与 profile，依赖版本统一在 workspace 声明、成员以 `xxx.workspace = true` 继承。根 `Cargo.lock` 全工作区唯一，提交并保持同步。业务 crate 加入 `members` 即插即用。

## 性能 profile（改前先读）

`[profile.dev.package."*"]` 的 `opt-level = 1` + 行表级调试信息：tauri 系依赖在 O0 下运行明显卡顿，此设置同时让 app crate 全量重编译更快；改动本节会使依赖缓存整体失效，下一次构建为一次性全量重编译。`[profile.release]` 用 LTO + `opt-level = "s"` + strip + panic abort，安装包体积优先。profile 只能定义在工作区根 manifest，成员内的会被忽略（[Cargo book](https://doc.rust-lang.org/cargo/reference/profiles.html)，2026-10-04 查阅）。
