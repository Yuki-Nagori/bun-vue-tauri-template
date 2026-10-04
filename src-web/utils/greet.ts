/** 生成问候语文案；Tauri IPC 不可用（浏览器预览）时作为纯前端回退。 */
export function formatGreeting(name: string): string {
  const trimmed = name.trim();
  const who = trimmed.length > 0 ? trimmed : "world";
  return `Hello, ${who}!`;
}
