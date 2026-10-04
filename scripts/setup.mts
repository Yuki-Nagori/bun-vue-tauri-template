// 一次性环境配置（bun install 的 postinstall 也走这里）：按 rust-toolchain.toml 装工具链 + cargo-llvm-cov。
import { readFileSync } from "node:fs";

const run = (cmd: string[]) => Bun.spawnSync(cmd, { stdout: "inherit", stderr: "inherit" }).success;
const ok = (cmd: string[]) => Bun.spawnSync(cmd, { stdout: "ignore", stderr: "ignore" }).success;

// rustup 是硬前置，缺失则 bun install 连带失败，属预期。
if (!ok(["rustup", "--version"])) {
  console.error("未检测到 rustup：请先安装 https://rustup.rs，再重跑 bun install");
  process.exit(1);
}

// rust-toolchain.toml 是受控格式，正则取字段即可。
const config = readFileSync("rust-toolchain.toml", "utf8");
const channel = config.match(/channel\s*=\s*"([^"]+)"/)?.[1];
if (!channel) {
  console.error("rust-toolchain.toml 中没有 channel 字段");
  process.exit(1);
}
const profile = config.match(/profile\s*=\s*"([^"]+)"/)?.[1];
const components =
  (config.match(/components\s*=\s*\[([^\]]*)\]/)?.[1] ?? "")
    .match(/"([^"]+)"/g)
    ?.map((s) => s.slice(1, -1)) ?? [];

const installArgs = ["toolchain", "install", channel];
if (profile) installArgs.push("--profile", profile);
for (const component of components) installArgs.push("--component", component);

// cargo 不可用（未装或半截安装让 rustup 误报已就绪）时卸载重装，宁可重下一次。
if (!ok(["cargo", "--version"])) {
  console.log(`安装/修复 Rust 工具链 ${channel} …`);
  Bun.spawnSync(["rustup", "toolchain", "uninstall", channel], {
    stdout: "ignore",
    stderr: "ignore",
  });
  if (!run(["rustup", ...installArgs])) {
    console.error("工具链安装失败：手动执行 rustup toolchain install 查看原因");
    process.exit(1);
  }
}
if (!ok(["cargo", "--version"])) {
  console.error(
    `工具链 ${channel} 仍不可用：请手动执行 rustup toolchain uninstall ${channel} 后重跑 bun install`,
  );
  process.exit(1);
}

// cargo-llvm-cov 是覆盖率门禁依赖，缺失则源码编译安装（一次性）。
if (!ok(["cargo", "llvm-cov", "--version"]) && !run(["cargo", "install", "cargo-llvm-cov"])) {
  console.error("cargo-llvm-cov 安装失败：可改用 taiki-e/install-action（见 CI 配置）");
  process.exit(1);
}

console.log("环境就绪，可以 bun run verify / tauri:dev 了。");
