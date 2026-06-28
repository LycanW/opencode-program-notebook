# Agent 指南

本仓库发布 OpenCode 的 `program-notebook` 插件、skill 和命令。内容主体使用中文。

## 工作原则

- 保持固定路径和固定格式，不做插件配置化。
- `docs/program-notebook.md` 是中枢文档。
- `docs/architecture/*.md` 是展开型专题文档。
- 插件只做检查、提醒和工具暴露，不自动写文档。
- 新增行为必须先写测试，再实现。
- 手动编辑文件时使用补丁方式，避免用脚本批量重写文件。

## 目录约定

- `.opencode/plugins/program-notebook.ts` 是唯一 OpenCode 插件入口。
- `.opencode/INSTALL.md` 是给 OpenCode agent 读取并执行的安装说明。
- `.opencode/commands/check-notebook.md` 存放 OpenCode 命令模板。
- `kimi.plugin.json` 是 Kimi Code plugin 清单。
- `.kimi/skills/program-notebook/SKILL.md` 是给 Kimi Code 使用的 skill 正文。
- `.kimi/INSTALL.md` 是给 Kimi Code agent 读取并执行的安装说明。
- `bin/check-notebook.ts` 是命令行检查入口。
- `bin/check-notebook-mcp.ts` 是 Kimi Code MCP server 入口。
- `lib/program-notebook-lib.ts` 存放可测试逻辑。
- `skills/program-notebook/SKILL.md` 存放 OpenCode skill 正文。
- `tests/program-notebook-lib.test.ts` 和 `tests/check-notebook-cli.test.ts` 存放 Bun 测试。

## 重要禁止事项

- 不要把 `lib/program-notebook-lib.ts` 移入 `.opencode/plugins/`。
- 不要在 `.opencode/plugins/` 下放第二个 `.ts` 辅助库文件。
- 不要让插件自动修改用户项目文档。
- 不要在无法验证代码事实时补全文档内容。

## 验证命令

### OpenCode

```bash
bun install
bun test
bun --print "await import('./.opencode/plugins/program-notebook.ts').then((m) => typeof m.default)"
```

测试应全部通过，插件导入应输出 `function`。

### Kimi Code

```bash
bun install
bun test
bun run check-notebook
```

测试应全部通过，CLI 应输出项目 notebook 状态报告。

## 发布流程

1. 修改前确认当前文件布局。
2. 行为变更先更新或新增测试，并确认测试失败原因正确。
3. 实现最小变更。
4. 运行验证命令。
5. 检查 `git status`、`git diff` 和最近提交。
6. 只提交本次意图相关文件。

## 安装给用户时

### OpenCode

1. 优先让用户复制 README 中的 `Fetch and follow instructions...` 提示给 agent。
2. 或直接按 `.opencode/INSTALL.md` 执行安装。
3. 克隆仓库到稳定目录，例如 `~/.config/program-notebook`。
4. 在 OpenCode 配置 `plugin` 数组加入插件入口的绝对 `file://` URL。
5. 复制 `.opencode/commands/check-notebook.md` 到 `~/.config/opencode/commands/` 或项目 `.opencode/commands/`。
6. 运行验证命令。
7. 提醒用户重启 OpenCode，配置、插件、skill 和命令不会热重载。

### Kimi Code

1. 让用户复制 README 中的 Kimi Code 安装提示给 agent。
2. 或直接按 `.kimi/INSTALL.md` 执行安装。
3. 在 Kimi Code 中运行 `/plugins install https://github.com/LycanW/program-notebook` 安装 plugin。
4. 提醒用户运行 `/reload` 或开启新会话，使 plugin 生效。
5. 验证 `check_notebook` 工具可用。

## OpenCode 全局自动部署步骤

1. 确认 `~/.config/opencode` 存在；不存在则创建。
2. 克隆或更新仓库：`https://github.com/LycanW/program-notebook.git`。
3. 推荐克隆路径：`~/.config/program-notebook`。
4. 在 `~/.config/opencode/opencode.jsonc` 或 `~/.config/opencode/opencode.json` 的 `plugin` 数组中加入绝对 `file://` URL，例如 `file:///home/USER/.config/program-notebook/.opencode/plugins/program-notebook.ts`。
5. 如果配置文件不存在，创建带 `$schema` 的最小配置。
6. 如果配置已有 `plugin` 数组，只追加插件路径，不覆盖用户已有插件。
7. 如果已有相同插件路径，不要重复添加。
8. 复制 `.opencode/commands/check-notebook.md` 到 `~/.config/opencode/commands/check-notebook.md`。
9. 在仓库目录运行 `bun install`。
10. 在仓库目录运行 `bun test`。
11. 在仓库目录运行 `bun --print "await import('./.opencode/plugins/program-notebook.ts').then((m) => typeof m.default)"`。
12. 验证输出后，提醒用户重启 OpenCode。

## OpenCode 项目级自动部署步骤

1. 把仓库克隆到项目内稳定目录，例如 `tools/program-notebook`。
2. 在项目 `.opencode/opencode.json` 中加入相对插件路径，例如 `./tools/program-notebook/.opencode/plugins/program-notebook.ts`。
3. 如果项目需要 slash command，复制命令文件到 `.opencode/commands/check-notebook.md`。
4. 在克隆目录运行验证命令。
5. 提醒用户从项目目录重启 OpenCode。

## Kimi Code 全局自动部署步骤

1. 确认 `bun` 已安装；未安装时提示用户安装。
2. 在 Kimi Code 中运行 `/plugins install https://github.com/LycanW/program-notebook`。
3. 提醒用户运行 `/reload` 或开启新会话。
4. 调用 `check_notebook` 工具验证可用性。
5. 不要覆盖用户已有配置、skill、plugin 或代理指南。
