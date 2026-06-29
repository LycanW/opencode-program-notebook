# 安装 Program Notebook for OpenCode

你是用户的 agent。请在用户当前机器上安装或更新 `program-notebook`，并在完成后报告验证结果。

## 目标

- 包名：`program-notebook`（来自 npm）
- 注册插件：在 OpenCode 配置的 `plugin` 数组中追加 `"program-notebook"`
- 安装 slash command：`~/.config/opencode/commands/check-notebook.md`
- 安装后提醒用户重启 OpenCode

## 步骤

1. 确认 `~/.config/opencode` 存在；不存在则创建。
2. 读取 `~/.config/opencode/opencode.jsonc` 或 `~/.config/opencode/opencode.json`。
3. 如果两个文件都不存在，创建 `~/.config/opencode/opencode.jsonc`，内容至少包含 `$schema` 和 `plugin` 数组。
4. 在配置的 `plugin` 数组中追加 `"program-notebook"`。
5. 不要覆盖用户已有配置、provider、agent、permission、mcp 或其他 plugin。
6. 如果已有 `"program-notebook"`，不要重复添加。
7. 复制 `https://raw.githubusercontent.com/LycanW/program-notebook/refs/heads/main/.opencode/commands/check-notebook.md` 的内容到 `~/.config/opencode/commands/check-notebook.md`。

## 配置示例

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["program-notebook"]
}
```

## 完成报告

安装完成后，用中文报告：

- 修改过的 OpenCode 配置文件路径
- slash command 安装路径
- 是否需要用户重启 OpenCode
- 插件将由 OpenCode 在下次启动时自动从 npm 安装

OpenCode 不会热重载配置、插件、skill 或命令；安装或更新后必须重启。
