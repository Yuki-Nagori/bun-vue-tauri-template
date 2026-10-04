# bun-vue-tauri-template

Bun + Vue 3 + TypeScript + Tauri 2 的桌面应用模板，裁剪自实际项目并保持可生长：一条 `bun run verify` 覆盖双端类型检查、ESLint / Clippy、Prettier / rustfmt、双端测试与 100% 覆盖率门槛、knip 死代码检查；husky 在提交前查格式，CI 在三平台跑全量门禁，`bun run tauri:build` 直接出安装包。

## 快速开始

环境：[Bun](https://bun.sh) 与 [rustup](https://rustup.rs)。`bun install` 一次完成全部配置：npm 依赖、husky 钩子，以及 postinstall 里的 Rust 侧自检（按 `rust-toolchain.toml` 装工具链、补装 cargo-llvm-cov）。Windows 一般自带 WebView2，Linux 见 [Tauri 前置要求](https://tauri.app/start/prerequisites/)。

```console
$ bun install            # npm 依赖 + husky + Rust 工具链 + cargo-llvm-cov，一条到位
$ bun run tauri:dev      # 桌面窗口（Vite HMR + cargo 增量编译）
$ bun run dev            # 或：浏览器纯前端预览（无 IPC，示例命令走前端回退）
```

## 常用命令

| 命令                                | 作用                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| `bun run verify`                    | 提交门禁（十项，CI 逐步执行同一组检查）              |
| `bun run tauri:dev` / `tauri:build` | 桌面开发 / 打包安装包（`target/release/bundle/`）    |
| `bun run build`                     | 类型检查 + 前端构建                                  |
| `bun run test` / `test:coverage`    | 测试 / 测试 + 覆盖率门槛                             |
| `bun run lint` / `format`           | ESLint / Prettier（`:rust` 后缀为 Clippy / rustfmt） |
| `bun run bench` / `knip`            | 基准示例 / 死代码检查                                |

## 启用与文档

clone 后的改名、换图标、写第一个命令，见[构建与开发](ai-docs/architecture/build-and-development.md)。完整文档入口是 [AGENTS.md](AGENTS.md)，体系在 [ai-docs/](ai-docs/)：`architecture/` 说明结构与技术栈，`standards/` 是编码与提交规范，`task/` 承载工作记录。

## License

Apache-2.0
