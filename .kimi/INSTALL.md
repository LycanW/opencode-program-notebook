# 安装 Kimi Code 的 Program Notebook

你是用户的 agent。请在用户当前机器上安装或更新 `opencode-program-notebook`，使其能在 Kimi Code 中使用，并在完成后报告验证结果。

## 目标

- 注册 Kimi Code plugin：`program-notebook`
- 暴露 `check_notebook` 工具
- 安装后自动加载 `program-notebook` skill

## 约束

- 不要覆盖用户已有配置、skill、plugin 或其他代理指南。

## 步骤

1. 确认 `bun` 已安装；未安装时引导用户安装 `https://bun.sh`。
2. 在 Kimi Code 中安装 plugin：
   - 运行 `/plugins install https://github.com/LycanW/opencode-program-notebook`
3. 安装完成后运行 `/reload` 或开启新会话，使 plugin 生效。
4. 验证 `check_notebook` 工具可用：
   - 让 agent 调用 `check_notebook` 并读取返回报告。

## 失败处理

- 如果 `/plugins install` 失败，报告错误；建议检查网络或 Kimi Code 版本。
- 如果 `/reload` 后仍无法调用 `check_notebook`，建议用户开启新会话再试。

## 完成报告

安装完成后，用中文报告：

- plugin 安装命令及结果
- 是否已运行 `/reload` 或开启新会话
- `check_notebook` 工具调用是否成功
- 是否需要用户手动排查
