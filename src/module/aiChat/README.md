# AI聊天模块文档

## 概述

AI聊天模块为sy-lively插件提供了AI对话功能，允许用户在思源笔记中直接与AI进行交互，并将AI响应插入到文档中。

## 功能特性

- **快捷键触发**: 按 `Alt+Shift+S` (⇧⌥S) 打开AI聊天对话框
- **上下文收集**: 自动收集选中的文本、当前块或选中的多个块
- **多提供商支持**: 支持配置多个AI服务提供商
- **超级块响应**: AI响应自动包装为超级块，便于组织和管理
- **预览确认**: 使用Protyle渲染预览，支持滚动查看完整响应
- **智能插入**: 响应插入到最后一个选中块之后，支持超级块嵌套

## 配置AI提供商

### 步骤

1. 打开思源笔记设置
2. 找到"喧嚣"插件设置
3. 点击"AI提供商设置"
4. 点击"添加提供商"按钮

### 配置选项

| 选项 | 说明 | 示例 |
|------|------|------|
| 名称 | 提供商显示名称 | `OpenAI GPT-4` |
| API密钥 | API密钥 | `sk-...` |
| 基础URL | API端点地址 | `https://api.openai.com/v1` |
| API格式 | API类型 | OpenAI兼容 / Anthropic原生 |
| 模型 | 模型名称 | `gpt-4` / `claude-3-sonnet` |
| 系统提示词 | 自定义系统提示词 | `你是一个有帮助的助手...` |
| 启用 | 是否启用此提供商 | 勾选 |
| 流式响应 | 是否使用流式响应 | 勾选 |

### 支持的API格式

#### OpenAI兼容格式

支持所有兼容OpenAI API格式的服务：
- OpenAI (GPT-3.5, GPT-4系列)
- Azure OpenAI
- 各种本地LLM (如Ollama, LM Studio等)

配置示例：
- 基础URL: `https://api.openai.com/v1`
- 模型: `gpt-4`

#### Anthropic原生格式

支持Anthropic Claude系列：
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku

配置示例：
- 基础URL: `https://api.anthropic.com`
- 模型: `claude-3-sonnet-20240229`

## 使用方法

### 1. 快捷键打开

在思源笔记编辑器中，按 `Alt+Shift+S` 打开AI聊天对话框。

### 2. 选择上下文

AI聊天会自动收集以下上下文：

- **选中文本**: 如果你有选中的文本，会被包含在上下文中
- **当前块**: 光标所在块的内容（kramdown格式）
- **选中的块**: 如果选中了多个块，所有块的内容都会被包含

### 3. 输入问题

在"你的问题"文本框中输入你的问题或提示词。

### 4. 选择提供商（可选）

如果配置了多个提供商，可以从下拉菜单中选择要使用的提供商。

### 5. 发送请求

点击"发送"按钮，AI会根据你的问题和上下文生成响应。

### 6. 预览和确认

- AI响应会以Protyle预览的形式显示
- 点击"确认插入"将响应插入到文档
- 点击"取消"放弃响应并关闭对话框

## 响应插入位置

- **有选中文本/块**: 响应会插入到最后一个选中的块后面
- **无选中**: 响应会插入到当前光标所在块后面
- **超级块支持**: AI响应自动包装为超级块，若目标块在超级块内，响应也会插入到同一超级块中

## 响应格式

AI响应以超级块格式插入，例如：
```
{{{row
AI响应内容...

}}}
{: id="..." updated="..."}
```

## 文件结构

```
src/module/aiChat/
├── plugin/
│   └── index.ts           # 插件入口
├── types.ts               # 类型定义
├── ContextCollector.ts    # 上下文收集
├── AIProviderService.ts   # 提供商管理服务
├── AIResponseRenderer.tsx # 响应渲染器
├── AIChatDialogManager.tsx # 对话框管理
├── providers/
│   ├── OpenAICompatible.ts  # OpenAI兼容API客户端
│   ├── AnthropicNative.ts   # Anthropic原生API客户端
│   └── index.ts             # 提供商工厂
└── README.md              # 本文档
```

### 新增/修改的公共方法

**`src/class/思源/块.ts`**
- `insertBlockAfter()` - 在指定块之后插入新块的公共方法

## 技术实现

### 上下文收集

- 使用 `window.getSelection()` 获取选中文本
- 使用 `protyle.selectElement` 获取选中的块
- 使用 `SY块.获取块Kramdown源码()` 将块转换为kramdown格式

### API调用

支持两种API调用方式：

1. **OpenAI兼容格式**: `/v1/chat/completions`
2. **Anthropic原生格式**: `/v1/messages`

### 响应渲染

1. 创建临时超级块存储响应内容
2. 使用 `Protyle` 类渲染预览（可滚动查看完整内容）
3. 用户确认后使用 `SY块.insertBlockAfter()` 插入到文档
4. 用户取消后删除临时超级块

### 块插入

- 使用 `SY块.insertBlockAfter()` 公共方法插入
- 自动处理超级块等复杂嵌套情况
- 保持预览和插入使用相同的块ID

## 故障排除

### 快捷键没有反应

1. 确认插件已正确加载
2. 尝试重启思源笔记
3. 检查快捷键是否与其他软件冲突

### API请求失败

1. 检查API密钥是否正确
2. 检查基础URL是否正确
3. 检查网络连接
4. 查看浏览器控制台错误信息

### 响应格式异常

1. 确认选择的API格式与提供商匹配
2. 检查模型名称是否正确

## 开发计划

### 待实现功能

- [ ] 上下文长度限制和警告
- [ ] 对话历史记录
- [ ] 流式响应的实时预览

## 更新日志

### v0.2.6-2 (当前版本)

**新增功能**
- ✨ 添加AI聊天功能，支持多种AI服务提供商
- ✨ 支持OpenAI兼容API和Anthropic原生API
- ✨ AI响应自动包装为超级块
- ✨ 可滚动预览完整AI响应

**技术改进**
- 🔧 新增 `SY块.insertBlockAfter()` 公共方法
- 🔧 改进上下文收集机制
- 🔧 优化块插入逻辑，支持超级块嵌套
- 🔧 完善临时块清理机制

## 许可证

MIT License - sy-lively 插件的一部分
