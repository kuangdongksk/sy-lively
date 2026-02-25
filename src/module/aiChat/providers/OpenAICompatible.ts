import type {
  AnthropicRequest,
  AnthropicResponse,
  OpenAIRequest,
  OpenAIResponse,
} from "../types";

/**
 * OpenAI兼容API客户端
 * 支持OpenAI、Azure OpenAI、以及各种兼容OpenAI格式的本地LLM
 */
export class OpenAICompatibleClient {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(config: {
    apiKey: string;
    baseUrl: string;
    model: string;
  }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // 移除末尾的斜杠
    this.model = config.model;
  }

  /**
   * 发送聊天请求
   * @param systemPrompt 系统提示词
   * @param userPrompt 用户提示词
   * @param context 上下文内容
   * @param stream 是否流式响应
   * @param onChunk 流式响应回调函数
   */
  async chat(
    systemPrompt: string,
    userPrompt: string,
    context: string,
    stream: boolean = false,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const messages = this.buildMessages(systemPrompt, userPrompt, context);

    if (stream && onChunk) {
      return this.chatStream(messages, onChunk);
    }

    return this.chatNonStream(messages);
  }

  /**
   * 构建消息数组
   */
  private buildMessages(
    systemPrompt: string,
    userPrompt: string,
    context: string
  ) {
    const messages: OpenAIRequest["messages"] = [];

    // 添加系统提示词
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
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
  private async chatNonStream(messages: OpenAIRequest["messages"]): Promise<string> {
    const requestBody: OpenAIRequest = {
      model: this.model,
      messages,
      stream: false,
    };

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
      throw new Error(
        `API请求失败 (${response.status}): ${errorText}`
      );
    }

    const data: OpenAIResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }

    throw new Error("API返回了无效的响应格式");
  }

  /**
   * 流式聊天
   */
  private async chatStream(
    messages: OpenAIRequest["messages"],
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const requestBody: OpenAIRequest = {
      model: this.model,
      messages,
      stream: true,
    };

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
      throw new Error(
        `API请求失败 (${response.status}): ${errorText}`
      );
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
              const content =
                parsed.choices?.[0]?.delta?.content || "";
              if (content) {
                fullContent += content;
                onChunk(content);
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

    return fullContent;
  }
}
