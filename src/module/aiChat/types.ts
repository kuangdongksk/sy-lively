import { IProtyle } from "siyuan";

/**
 * AI API格式枚举
 */
export enum EAPIFormat {
  OpenAICompatible = "openai-compatible", // OpenAI兼容格式 (OpenAI, Azure, 本地LLM, DeepSeek等)
  AnthropicNative = "anthropic-native", // Anthropic原生API
}

/**
 * AI提供商配置
 */
export interface IAIProvider {
  id: string; // 唯一ID
  name: string; // 显示名称
  apiKey: string; // API密钥
  baseUrl: string; // API基础URL
  apiFormat: EAPIFormat; // API格式
  model: string; // 模型名称（常规模型）
  thinkingModel?: string; // 思考模型名称（可选，如DeepSeek的reasoner模型）
  systemPrompt: string; // 系统提示词
  enabled: boolean; // 是否启用
  isDefault: boolean; // 是否为默认提供商
  streamResponse: boolean; // 是否流式响应
  maxTokens?: number; // 最大token数（用于上下文限制）
}

/**
 * 对话消息
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  reasoning?: string; // 思考过程（DeepSeek思考模式）
  timestamp?: number;
}

/**
 * 块信息
 */
export interface BlockInfo {
  id: string;
  kramdown: string;
}

/**
 * AI聊天上下文
 */
export interface AIChatContext {
  selectedText: string; // 选中的文本
  blocks: BlockInfo[]; // 选中的块或当前块
  insertTargetBlockId: string; // 插入目标块ID（最后一个选中的块）
  kramdown: string; // 所有上下文的kramdown
  rootId: string; // 文档根ID
}

/**
 * AI聊天请求
 */
export interface AIChatRequest {
  providerId: string;
  prompt: string; // 用户输入
  context: string; // kramdown上下文
  messages?: ChatMessage[]; // 对话历史
}

/**
 * AI聊天响应
 */
export interface AIChatResponse {
  content: string; // AI响应内容
  reasoning?: string; // 思考过程（DeepSeek思考模式）
  providerId: string;
}

/**
 * OpenAI兼容格式的消息
 */
export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * OpenAI兼容格式的请求体
 */
export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  stream?: boolean;
  max_tokens?: number;
}

/**
 * DeepSeek思考模式的响应
 */
export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      reasoning?: string; // 思考过程
    };
    finish_reason: string;
  }>;
}

/**
 * OpenAI兼容格式的响应体
 */
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

/**
 * Anthropic原生格式的消息
 */
export interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Anthropic原生格式的请求体
 */
export interface AnthropicRequest {
  model: string;
  messages: AnthropicMessage[];
  system?: string;
  stream?: boolean;
  max_tokens: number;
}

/**
 * Anthropic原生格式的响应体
 */
export interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  stop_reason: string;
  model: string;
}

/**
 * 提示词模板
 */
export interface IPromptTemplate {
  id: string; // 唯一ID
  name: string; // 模板名称
  content: string; // 模板内容
  isShortcut?: boolean; // 是否显示为快捷选项
  order?: number; // 排序
}

/**
 * 上下文收集器配置
 */
export interface ContextCollectorConfig {
  protyle: IProtyle;
  focusedBlockId: string | null;
}
