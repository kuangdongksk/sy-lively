import type { EAPIFormat, IAIProvider } from "../types";
import { AnthropicNativeClient } from "./AnthropicNative";
import { OpenAICompatibleClient } from "./OpenAICompatible";

/**
 * AI提供商客户端接口
 */
export interface IAIProviderClient {
  chat(
    systemPrompt: string,
    userPrompt: string,
    context: string,
    stream: boolean,
    onChunk?: (chunk: string) => void
  ): Promise<string>;
}

/**
 * 创建AI提供商客户端
 */
export function createProviderClient(
  provider: IAIProvider
): IAIProviderClient {
  switch (provider.apiFormat) {
    case "openai-compatible":
      return new OpenAICompatibleClient({
        apiKey: provider.apiKey,
        baseUrl: provider.baseUrl,
        model: provider.model,
      });

    case "anthropic-native":
      return new AnthropicNativeClient({
        apiKey: provider.apiKey,
        baseUrl: provider.baseUrl,
        model: provider.model,
      });

    default:
      throw new Error(`不支持的API格式: ${provider.apiFormat}`);
  }
}

// 导出客户端类
export { OpenAICompatibleClient } from "./OpenAICompatible";
export { AnthropicNativeClient } from "./AnthropicNative";
