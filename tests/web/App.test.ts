import { mount } from "@vue/test-utils";
import { invoke } from "@tauri-apps/api/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../src-web/App.vue";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

describe("App", () => {
  beforeEach(() => {
    vi.mocked(invoke).mockReset();
  });

  it("显示 Rust 后端经 IPC 返回的问候", async () => {
    vi.mocked(invoke).mockResolvedValue("Hello, Tauri!");
    const wrapper = mount(App);
    await wrapper.find("input").setValue("Tauri");
    await wrapper.find("form").trigger("submit");
    await vi.waitFor(() => {
      expect(wrapper.get("[data-testid='greeting']").text()).toBe("Hello, Tauri!");
    });
    expect(vi.mocked(invoke)).toHaveBeenCalledWith("greet", { name: "Tauri" });
  });

  it("IPC 不可用时回退到纯前端问候", async () => {
    vi.mocked(invoke).mockRejectedValue(new Error("no ipc"));
    const wrapper = mount(App);
    await wrapper.find("input").setValue("Browser");
    await wrapper.find("form").trigger("submit");
    await vi.waitFor(() => {
      expect(wrapper.get("[data-testid='greeting']").text()).toBe("Hello, Browser!");
    });
  });
});
