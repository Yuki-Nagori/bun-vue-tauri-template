// tinybench 基准示例：bun run bench:web
import { Bench } from "tinybench";
import { formatGreeting } from "../utils/greet";

const bench = new Bench({ warmupIterations: 100, iterations: 1_000 });
bench.add("formatGreeting", () => formatGreeting("bun-vue-tauri"));

await bench.run();
console.table(bench.table());
