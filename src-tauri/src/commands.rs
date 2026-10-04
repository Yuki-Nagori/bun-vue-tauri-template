//! 命令层：解参数、调逻辑、回包，只做转发；领域逻辑进 `src-rust/` 业务 crate（见 ts-rust-boundary.md）。

use template_core::greeting_text;

/// 示例命令：前端 `invoke("greet", { name })` 调用。
#[tauri::command]
pub fn greet(name: &str) -> String {
    greeting_text(name)
}

#[cfg(test)]
mod tests {
    use super::greet;

    #[test]
    fn forwards_to_core() {
        assert_eq!(
            greet("Tauri"),
            "Hello, Tauri! You've been greeted from Rust!"
        );
    }
}
