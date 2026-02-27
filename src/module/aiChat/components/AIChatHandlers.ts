import { SY块 } from "@/class/思源/块";
import { message } from "@/components/base/rc/Message";
import { $ } from "@/constant/三方库";
import { Dialog } from "siyuan";
import type { AIChatContext } from "../types";
import type { AIProviderService } from "../AIProviderService";
import { AIResponseRenderer } from "../AIResponseRenderer";

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

    // 更新UI状态
    isSending.value = true;
    $sendButton.text("发送中...").prop("disabled", true);
    $responseSection.show();
    $responseContent.html(
      '<div style="padding:12px;text-align:center;color:var(--b3-theme-on-surface);">正在生成响应...</div>'
    );

    try {
      const kramdownContext = context?.kramdown || "";

      // 获取AI响应
      const response = await providerService.chat(prompt, kramdownContext);

      // 渲染最终响应为超级块
      await this.renderResponse(dialog, responseRenderer, response);

      // 显示操作按钮
      $actionButtons.show();
      hasResponse.value = true;
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
   * 渲染响应
   */
  private static async renderResponse(
    dialog: Dialog | null,
    responseRenderer: AIResponseRenderer,
    kramdown: string
  ): Promise<void> {
    const $dialogBody = $(dialog?.element).find(".b3-dialog__body");
    const $responseContent = $dialogBody.find(".ai-response-content");

    $responseContent.empty();

    const { element } = await responseRenderer.render(kramdown);
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
}
