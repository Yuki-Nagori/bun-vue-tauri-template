<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { formatGreeting } from "./utils/greet";

const name = ref("");
const greeting = ref(formatGreeting(""));

async function greet(): Promise<void> {
  try {
    greeting.value = await invoke<string>("greet", { name: name.value });
  } catch {
    // 浏览器预览没有 IPC 通道，回退纯前端问候。
    greeting.value = formatGreeting(name.value);
  }
}
</script>

<template>
  <main class="shell">
    <h1>bun-vue-tauri-template</h1>
    <p class="subtitle">Bun · Vue 3 · TypeScript · Tauri 2</p>
    <form class="row" @submit.prevent="greet">
      <input v-model="name" type="text" placeholder="输入名字试试 IPC…" />
      <button type="submit">Greet</button>
    </form>
    <p class="greeting" data-testid="greeting">{{ greeting }}</p>
  </main>
</template>
