//! 问候语文案：模板自带的领域逻辑示例，供命令层与前端浏览器回退共用同一口径。

/// 生成问候语文案；`src-tauri` 的 `greet` 命令只做转发到这里。
pub fn greeting_text(name: &str) -> String {
    format!("Hello, {name}! You've been greeted from Rust!")
}

#[cfg(test)]
mod tests {
    use super::greeting_text;

    #[test]
    fn greets_the_given_name() {
        assert_eq!(
            greeting_text("Tauri"),
            "Hello, Tauri! You've been greeted from Rust!"
        );
    }
}
