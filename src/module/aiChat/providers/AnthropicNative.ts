import type { AnthropicRequest, AnthropicResponse, ChatMessage } from "../types";

/**
 * Anthropic原生API客户端
 * 支持Claude API
 */
export class AnthropicNativeClient {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private version: string;
  private maxTokens?: number;

  constructor(config: {
    apiKey: string;
    baseUrl: string;
    model: string;
    maxTokens?: number;
  }) {
    this.apiKey = config.apiKey;
    // Anthropic API的默认base URL
    this.baseUrl = config.baseUrl.replace(/\/$/, "") || "https://api.anthropic.com";
    this.model = config.model;
    this.version = "2023-06-01"; // API版本
    this.maxTokens = config.maxTokens;
  }

  /**
   * 发送聊天请求
   * @param systemPrompt 系统提示词
   * @param userPrompt 用户提示词
   * @param context 上下文内容
   * @param messages 对话历史
   * @param stream 是否流式响应
   * @param onChunk 流式响应回调函数
   */
  async chat(
    systemPrompt: string,
    userPrompt: string,
    context: string,
    messages?: ChatMessage[],
    stream: boolean = false,
    onChunk?: (chunk: string, reasoningChunk?: string) => void
  ): Promise<{ content: string; reasoning?: string }> {
    const { messages: builtMessages, system } = this.buildMessages(
      systemPrompt,
      userPrompt,
      context,
      messages
    );

    if (stream && onChunk) {
      return this.chatStream(builtMessages, system, onChunk);
    }

    return this.chatNonStream(builtMessages, system);
  }

  /**
   * 构建消息数组和系统提示词
   */
  private buildMessages(
    systemPrompt: string,
    userPrompt: string,
    context: string,
    historyMessages?: ChatMessage[]
  ): { messages: AnthropicRequest["messages"]; system: string } {
    const messages: AnthropicRequest["messages"] = [];

    // 添加对话历史（仅user和assistant消息）
    if (historyMessages && historyMessages.length > 0) {
      for (const msg of historyMessages) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      }
    }

    // 构建用户消息
    let userContent = "";
    if (context) {
      userContent += `以下是相关的上下文内容（kramdown格式）：\n\n${context}\n\n`;
    }
    userContent += userPrompt;

    messages.push({
      role: "user",
      content: userContent,
    });

    return {
      messages,
      system: systemPrompt || "You are a helpful assistant.",
    };
  }

  /**
   * 非流式聊天
   */
  private async chatNonStream(
    messages: AnthropicRequest["messages"],
    system: string
  ): Promise<{ content: string }> {
    const requestBody: AnthropicRequest = {
      model: this.model,
      messages,
      system,
      stream: false,
      max_tokens: this.maxTokens || 4096,
    };

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": this.version,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败 (${response.status}): ${errorText}`);
    }

    const data: AnthropicResponse = await response.json();

    if (data.content && data.content.length > 0) {
      // Anthropic API返回的content是一个数组，找到text类型的
      const textBlock = data.content.find((block) => block.type === "text");
      if (textBlock) {
        return { content: textBlock.text };
      }
    }

    throw new Error("API返回了无效的响应格式");
  }

  /**
   * 流式聊天
   */
  private async chatStream(
    messages: AnthropicRequest["messages"],
    system: string,
    onChunk: (chunk: string, reasoningChunk?: string) => void
  ): Promise<{ content: string }> {
    const requestBody: AnthropicRequest = {
      model: this.model,
      messages,
      system,
      stream: true,
      max_tokens: this.maxTokens || 4096,
    };

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": this.version,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败 (${response.status}): ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法获取响应流");
    }

    const decoder = new TextDecoder();
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta") {
                const content = parsed.delta?.text || "";
                if (content) {
                  fullContent += content;
                  onChunk(content);
                }
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return { content: fullContent };
  }
}
