# 目录与模块规划

[架构总览](README.md)

```text
├── index.html                 # Vite 入口 HTML（挂载点 #app）
├── src-web/                   # 前端：Vue 3 + TypeScript
│   ├── main.ts                # 应用入口：挂载根组件
│   ├── App.vue                # 根组件：greet 示例（IPC 往返 + 浏览器回退）
│   ├── app.css                # 全局样式（无 UI 框架）
│   ├── utils/                 # 纯逻辑函数，配单测（计入覆盖率门槛）
│   └── bench/                 # tinybench 基准示例
├── src-tauri/                 # Tauri 适配层：Rust
│   ├── src/lib.rs             # 应用装配（Builder）；事件循环不可测，不入覆盖门槛
│   ├── src/commands.rs        # #[tauri::command] 命令层与命令单测
│   ├── tauri.conf.json        # 窗口 / 打包 / 开发服务器
│   ├── capabilities/          # IPC 权限声明
│   ├── icons/                 # 平台图标（tauri icon 生成，勿手改）
│   └── build.rs               # tauri-build
├── tests/web/                 # Vitest 单测（目录镜像 src-web）
├── scripts/                   # 仓库脚本（setup.mts 环境配置，bun install 的 postinstall 调用）
├── .github/workflows/ci.yml   # 三平台 CI
├── .husky/pre-commit          # 提交前查双端格式（全量门禁在 CI）
├── ai-docs/                   # 本文档体系
├── public/                    # Vite 静态资产（icon.svg 作 favicon 与图标源）
├── eslint.config.js / knip.json / vite.config.ts / vitest.config.ts
├── rust-toolchain.toml        # Rust 工具链锁定
└── Cargo.toml                 # 虚拟工作区根（members 与 profile 调优）
```

## 归属规则

组件只做编排与渲染，可复用逻辑进 `utils/` 并配单测；`commands.rs` 只做解参数、调逻辑、回包，业务长大后在根 `Cargo.toml` 的 `members` 新增独立 crate，命令层只做转发。全局状态、路由、UI 组件库在需求真实出现前不引入，也不建占位目录。

新增文件的归属按职责判断，不按语言堆放；访问私有实现的测试贴近源码（如 `commands.rs` 的 `mod tests`），前端公开行为的测试放 `tests/web/` 并镜像目录结构。

## 命名

仓库 / 包名 `bun-vue-tauri-template`，Rust package 同名、lib 名为下划线形态的 `bun_vue_tauri_template_lib`。启用模板时的统一改名清单见[构建与开发](build-and-development.md)。
