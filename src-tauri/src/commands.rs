//! 命令层：解参数、调逻辑、回包；逻辑文件计入覆盖率门禁（装配 lib.rs 不计）。

/// 示例命令：前端 `invoke("greet", { name })` 调用。
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {name}! You've been greeted from Rust!")
}

#[cfg(test)]
mod tests {
    use super::greet;

    #[test]
    fn greets_the_given_name() {
        assert_eq!(
            greet("Tauri"),
            "Hello, Tauri! You've been greeted from Rust!"
        );
    }
}
