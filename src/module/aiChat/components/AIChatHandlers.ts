import { SY块 } from "@/class/思源/块";
import { message } from "@/components/base/rc/Message";
import { $ } from "@/constant/三方库";
import { Dialog } from "siyuan";
import Kramdown助手 from "@/class/helper/Kramdown助手";
import type { AIChatContext } from "../types";
import type { AIProviderService } from "../AIProviderService";
import { AIResponseRenderer } from "../AIResponseRenderer";
import { AIChatUI } from "./AIChatUI";

/**
 * AI聊天对话框事件处理器
 * 负责处理用户交互事件
 */
export class AIChatHandlers {
  /**
   * 处理发送消息事件
   */
  static async handleSend(options: {
    dialog: Dialog | null;
    context: AIChatContext | null;
    providerService: AIProviderService;
    responseRenderer: AIResponseRenderer;
    isSending: { value: boolean };
    hasResponse: { value: boolean };
  }): Promise<void> {
    const { dialog, context, providerService, responseRenderer, isSending, hasResponse } =
      options;

    if (isSending.value) return;

    const $dialogBody = $(dialog?.element).find(".b3-dialog__body");
    const $textarea = $dialogBody.find(".ai-user-input textarea");
    const $sendButton = $dialogBody.find(".ai-send-button");
    const $responseSection = $dialogBody.find(".ai-response-preview");
    const $responseContent = $dialogBody.find(".ai-response-content");
    const $actionButtons = $dialogBody.find(".ai-action-buttons");

    const prompt = $textarea.val() as string;
    if (!prompt.trim()) {
      message.warning("请输入你的问题");
      return;
    }

    const kramdownContext = context?.kramdown || "";

    // 获取对话框选项（思考模式、流式响应）
    const dialogOptions = AIChatUI.getDialogOptions();

    // 检查上下文长度
    const contextCheck = providerService.checkContextLength(kramdownContext);
    if (contextCheck.exceeds && contextCheck.maxLength) {
      message.warning(
        `上下文内容较长 (${Math.round(contextCheck.length / 1024)}KB)，可能影响响应质量`
      );
    }

    // 更新UI状态
    isSending.value = true;
    $sendButton.text("发送中...").prop("disabled", true);
    $responseSection.show();
    $responseContent.html(
      '<div style="padding:12px;text-align:center;color:var(--b3-theme-on-surface);">正在生成响应...</div>'
    );

    try {
      // 初始化预览元素（用于实时流式更新）
      const previewElement = await responseRenderer.initPreviewElement();
      $responseContent.empty();
      $responseContent.append(previewElement.element);

      // 累积的响应内容
      let fullContent = "";
      let fullReasoning = "";

      // 获取AI响应（支持流式）
      const response = await providerService.chat(
        prompt,
        kramdownContext,
        // 选项
        {
          useThinking: dialogOptions.useThinking,
          useStreaming: dialogOptions.useStreaming,
          // 流式回调：实时更新预览
          onChunk: dialogOptions.useStreaming ? (chunk, reasoningChunk) => {
            if (reasoningChunk) {
              // 思考过程更新
              fullReasoning += reasoningChunk;
              responseRenderer.updateThinkingPreview(previewElement.element, fullReasoning);
            } else if (chunk) {
              // 正常内容更新
              fullContent += chunk;
              responseRenderer.updateContentPreview(previewElement.element, fullContent, fullReasoning);
            }
          } : undefined,
        }
      );

      // 如果没有流式响应，更新预览为完整响应
      if (!dialogOptions.useStreaming) {
        if (response.reasoning) {
          responseRenderer.updateThinkingPreview(previewElement.element, response.reasoning);
        }
        responseRenderer.updateContentPreview(previewElement.element, response.content, response.reasoning);
      }

      // 最终渲染完整响应
      try {
        await this.renderFinalResponse(dialog, responseRenderer, response, previewElement.blockId);
      } catch (renderError) {
        console.error("Protyle渲染失败，使用备用渲染:", renderError);
        // 备用渲染：直接显示文本内容
        let fallbackContent = response.content;
        if (response.reasoning) {
          fallbackContent = `**思考过程：**\n\n${response.reasoning}\n\n---\n\n**回答：**\n\n${response.content}`;
        }
        $responseContent.html(`
          <div style="padding:12px;">
            <div style="font-size:12px;color:var(--b3-theme-on-surface);margin-bottom:8px;">
              ⚠️ Protyle渲染失败，显示原始内容
            </div>
            <pre style="white-space:pre-wrap;font-family:var(--b3-font-family);line-height:1.6;">${this.escapeHtml(fallbackContent)}</pre>
          </div>
        `);
        // 仍然标记为有响应，允许用户插入内容
        hasResponse.value = true;
        $actionButtons.show();
        return;
      }

      // 显示操作按钮
      $actionButtons.show();
      hasResponse.value = true;

      // 刷新对话历史显示
      AIChatUI.refreshConversationHistory(providerService);
    } catch (e) {
      message.error(`请求失败: ${(e as Error).message}`);
      $responseContent.html(
        `<div style="padding:12px;color:var(--b3-theme-on-error);">请求失败: ${(e as Error).message}</div>`
      );
    } finally {
      isSending.value = false;
      $sendButton.text("重新发送").prop("disabled", false);
    }
  }

  /**
   * 渲染最终响应
   */
  private static async renderFinalResponse(
    dialog: Dialog | null,
    responseRenderer: AIResponseRenderer,
    response: { content: string; reasoning?: string },
    previewBlockId: string
  ): Promise<void> {
    const $dialogBody = $(dialog?.element).find(".b3-dialog__body");
    const $responseContent = $dialogBody.find(".ai-response-content");

    // 构建完整的kramdown（包含思考过程）
    let fullKramdown = response.content;
    if (response.reasoning) {
      fullKramdown = `**思考过程：**\n\n${response.reasoning}\n\n---\n\n**回答：**\n\n${response.content}`;
    }

    // 使用预览时的blockId渲染完整响应
    const { element } = await responseRenderer.renderWithBlockId(fullKramdown, previewBlockId);
    $responseContent.empty();
    $responseContent.append(element);
  }

  /**
   * 处理确认插入事件
   */
  static async handleConfirm(options: {
    context: AIChatContext | null;
    responseRenderer: AIResponseRenderer;
    hasResponse: { value: boolean };
    close: () => void;
  }): Promise<void> {
    const { context, responseRenderer, hasResponse, close } = options;

    if (!hasResponse.value || !responseRenderer.getBlockId()) {
      message.warning("没有可插入的内容");
      return;
    }

    try {
      // 获取响应内容（已经是超级块格式）
      const kramdown = await responseRenderer.getResponseContent();
      const blockId = responseRenderer.getBlockId()!;
      // 使用预览时的blockId，保持ID一致
      const preparedKramdown = AIResponseRenderer.prepareForInsert(kramdown, blockId);

      // 使用公共方法插入块（在目标块之后）
      if (context?.insertTargetBlockId) {
        await SY块.insertBlockAfter({
          data: preparedKramdown,
          afterBlockId: context.insertTargetBlockId,
        });

        // 删除预览块（超级块）
        await responseRenderer.cleanup();

        message.success("已插入AI响应");
      } else {
        message.error("无法确定插入位置");
      }
    } catch (e) {
      message.error(`插入失败: ${(e as Error).message}`);
    } finally {
      close();
    }
  }

  /**
   * 处理取消事件
   */
  static async handleCancel(options: {
    responseRenderer: AIResponseRenderer;
    close: () => void;
  }): Promise<void> {
    const { responseRenderer, close } = options;
    await responseRenderer.cleanup();
    close();
  }

  /**
   * 处理对话框关闭事件
   */
  static async handleDialogClose(options: {
    responseRenderer: AIResponseRenderer;
    hasResponse: { value: boolean };
  }): Promise<void> {
    const { responseRenderer, hasResponse } = options;
    if (hasResponse.value) {
      await responseRenderer.cleanup();
    }
  }

  /**
   * 转义HTML
   */
  private static escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
