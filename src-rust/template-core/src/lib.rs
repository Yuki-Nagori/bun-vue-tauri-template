//! 纯业务 crate 的装配：模块声明与 re-export，不放逻辑（lib.rs 不计入覆盖率门禁）。

mod greeting;

pub use greeting::greeting_text;
