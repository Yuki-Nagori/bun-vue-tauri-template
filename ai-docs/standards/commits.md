# 提交规范

更新日期：2026-10-05。均为项目约定，不依赖特定 Git 客户端；husky pre-commit 只做双端格式检查，全量 verify 由推送前自查与 CI 承担。

## 一个 commit 是一个可验证的行为单元

每次 commit 表达一个清楚的目的，包含实现它所需的代码、测试、配置、锁文件、文档与 task 更新；不提交已知损坏的中间状态等下一个 commit 修。允许按可构建、可验证的纵向小步骤多次提交，每一步上已有功能继续成立。跨端契约（命令签名、TS 类型）变更时，同一 commit 更新全部消费方与对应验证。

提交前过一遍：行为与标题一致；替换实现时旧代码、调用点、依赖、文档一并清理；在最终将提交的状态上跑过 `bun run verify` 并记录结果；受影响的 task 与索引同 commit 更新；暂存 diff 里没有无关改动和临时产物。

## 消息格式

```text
<type>(<scope>): <具体行为>

说明触发条件、结果与必要取舍；简单变更可省略。

Task: NNN
Validation: 实际检查及结果；不能只写 tested
Cleanup: 删除项，或写无废弃项
```

正文可中文，type / scope 用简短英文。type 取：feat / fix / refactor / cleanup / build / test / docs / ci / chore / revert；scope 取实际模块（如 `tauri`、`web`、`docs`、`repo`）。不用 update、misc、WIP 当行为描述。破坏既有接口时标题冒号前加 `!` 并在正文说明影响与迁移。

## Task 状态同步

开始实现的提交把 task 标 in-progress；中间提交记录本次完成、验证与剩余工作，只勾有证据的验收项；最后完成提交补齐完成摘要并把 task 与索引一起标 done。一个 commit 原则上属于一个 task，跨任务的不可分割改动须列出全部关联编号及原因。
