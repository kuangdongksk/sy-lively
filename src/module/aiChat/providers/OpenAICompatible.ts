import type {
  ChatMessage,
  OpenAIRequest,
  OpenAIResponse,
  DeepSeekResponse,
} from "../types";

/**
 * OpenAI兼容API客户端
 * 支持OpenAI、Azure OpenAI、DeepSeek、以及各种兼容OpenAI格式的本地LLM
 */
export class OpenAICompatibleClient {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private enableThinking?: boolean; // 是否启用思考模式（DeepSeek等）
  private maxTokens?: number; // 最大token数

  constructor(config: {
    apiKey: string;
    baseUrl: string;
    model: string;
    enableThinking?: boolean;
    maxTokens?: number;
  }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // 移除末尾的斜杠
    this.model = config.model;
    this.enableThinking = config.enableThinking;
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
    const builtMessages = this.buildMessages(systemPrompt, userPrompt, context, messages);

    if (stream && onChunk) {
      return this.chatStream(builtMessages, onChunk);
    }

    return this.chatNonStream(builtMessages);
  }

  /**
   * 构建消息数组
   */
  private buildMessages(
    systemPrompt: string,
    userPrompt: string,
    context: string,
    historyMessages?: ChatMessage[]
  ): OpenAIRequest["messages"] {
    const messages: OpenAIRequest["messages"] = [];

    // 添加系统提示词
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    // 添加对话历史（排除系统消息）
    if (historyMessages && historyMessages.length > 0) {
      for (const msg of historyMessages) {
        if (msg.role !== "system") {
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

    return messages;
  }

  /**
   * 非流式聊天
   */
  private async chatNonStream(
    messages: OpenAIRequest["messages"]
  ): Promise<{ content: string; reasoning?: string }> {
    const requestBody: OpenAIRequest = {
      model: this.model,
      messages,
      stream: false,
    };

    // 添加 max_tokens 参数（DeepSeek 等支持）
    if (this.maxTokens) {
      requestBody.max_tokens = this.maxTokens;
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败 (${response.status}): ${errorText}`);
    }

    const data: OpenAIResponse | DeepSeekResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      const message = data.choices[0].message;
      // DeepSeek思考模式响应
      if ("reasoning" in message && message.reasoning) {
        return {
          content: message.content,
          reasoning: message.reasoning,
        };
      }
      // 标准响应
      return { content: message.content };
    }

    throw new Error("API返回了无效的响应格式");
  }

  /**
   * 流式聊天
   */
  private async chatStream(
    messages: OpenAIRequest["messages"],
    onChunk: (chunk: string, reasoningChunk?: string) => void
  ): Promise<{ content: string; reasoning?: string }> {
    const requestBody: OpenAIRequest = {
      model: this.model,
      messages,
      stream: true,
    };

    // 添加 max_tokens 参数
    if (this.maxTokens) {
      requestBody.max_tokens = this.maxTokens;
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
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
    let fullReasoning = "";

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
              const delta = parsed.choices?.[0]?.delta;

              if (delta) {
                // DeepSeek思考模式 - 推理内容
                if (delta.reasoning && delta.reasoning_content) {
                  fullReasoning += delta.reasoning_content;
                  onChunk("", delta.reasoning_content);
                }
                // 标准内容或思考后的内容
                else if (delta.content) {
                  fullContent += delta.content;
                  onChunk(delta.content);
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

    // 如果有思考过程，返回包含思考的结果
    if (fullReasoning) {
      return { content: fullContent, reasoning: fullReasoning };
    }

    return { content: fullContent };
  }
}
