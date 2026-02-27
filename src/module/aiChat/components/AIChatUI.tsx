import { message } from "@/components/base/rc/Message";
import { $ } from "@/constant/三方库";
import { Dialog } from "siyuan";
import type { AIChatContext } from "../types";
import type { AIProviderService } from "../AIProviderService";

/**
 * AI聊天对话框UI组件
 * 负责创建对话框中的各个UI部分
 */
export class AIChatUI {
  /**
   * 创建提供商选择器
   */
  static createProviderSelector(
    providerService: AIProviderService
  ): JQuery<HTMLElement> {
    const $section = $('<div class="ai-provider-selector"></div>');
    $section.css({
      display: "flex",
      "align-items": "center",
      gap: "8px",
    });

    const $label = $('<label style="min-width: 60px;">AI提供商:</label>');
    const $select = $('<select class="b3-text-field"></select>');
    $select.css({
      flex: 1,
      padding: "6px 8px",
    });

    // 填充提供商选项
    const enabledProviders = providerService.getEnabledProviders();
    enabledProviders.forEach((provider) => {
      const $option = $("<option></option>");
      $option.val(provider.id);
      $option.text(provider.name);
      if (provider.id === providerService["currentProviderId"]) {
        $option.prop("selected", true);
      }
      $select.append($option);
    });

    // 切换提供商
    $select.on("change", () => {
      const providerId = $select.val() as string;
      try {
        providerService.setCurrentProvider(providerId);
      } catch (e) {
        message.error((e as Error).message);
      }
    });

    $section.append($label);
    $section.append($select);

    return $section;
  }

  /**
   * 创建上下文显示区
   */
  static createContextDisplay(context: AIChatContext | null): JQuery<HTMLElement> {
    const $section = $('<div class="ai-context-display"></div>');

    const $header = $(
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"></div>',
    );
    const $label = $("<label>上下文:</label>");
    const $toggle = $('<button class="b3-button b3-button--text">收起</button>');

    let isExpanded = true;
    $toggle.on("click", () => {
      isExpanded = !isExpanded;
      $content.toggle(isExpanded);
      $toggle.text(isExpanded ? "收起" : "展开");
    });

    $header.append($label);
    $header.append($toggle);

    const $content = $('<div class="ai-context-content"></div>');
    $content.css({
      padding: "8px",
      "background-color": "var(--b3-theme-background)",
      border: "1px solid var(--b3-theme-surface)",
      "border-radius": "4px",
      "max-height": "150px",
      overflow: "auto",
      "font-size": "12px",
      "white-space": "pre-wrap",
    });

    if (context) {
      let contextText = "";
      if (context.selectedText) {
        contextText += `选中文本:\n${context.selectedText}\n\n`;
      }
      if (context.kramdown) {
        contextText += `块内容:\n${context.kramdown}`;
      }
      $content.text(contextText || "(无上下文)");
    }

    $section.append($header);
    $section.append($content);

    return $section;
  }

  /**
   * 创建用户输入区
   */
  static createUserInput(): JQuery<HTMLElement> {
    const $section = $('<div class="ai-user-input" style="flex:1;"></div>');

    const $label = $('<label style="display:block;margin-bottom:8px;">你的问题:</label>');

    const $textarea = $(
      '<textarea class="b3-text-field" placeholder="请输入你的问题..."></textarea>',
    );
    $textarea.css({
      width: "100%",
      height: "100px",
      resize: "vertical",
    });

    $section.append($label);
    $section.append($textarea);

    return $section;
  }

  /**
   * 创建发送按钮
   */
  static createSendButton(onClick: () => void): JQuery<HTMLElement> {
    const $button = $('<button class="b3-button ai-send-button">发送</button>');
    $button.css({
      width: "100%",
    });

    $button.on("click", () => {
      void onClick();
    });

    return $button;
  }

  /**
   * 创建响应预览区
   */
  static createResponsePreview(): JQuery<HTMLElement> {
    const $section = $('<div class="ai-response-preview" style="display:none;"></div>');

    const $label = $('<label style="display:block;margin-bottom:8px;">AI响应:</label>');
    const $content = $('<div class="ai-response-content"></div>');

    $section.append($label);
    $section.append($content);

    return $section;
  }

  /**
   * 创建操作按钮
   */
  static createActionButtons(
    onConfirm: () => void,
    onCancel: () => void
  ): JQuery<HTMLElement> {
    const $section = $('<div class="ai-action-buttons" style="display:none;gap:8px;"></div>');
    $section.css({
      display: "none",
      gap: "8px",
    });

    const $confirmButton = $('<button class="b3-button ai-confirm-button">确认插入</button>');
    const $cancelButton = $('<button class="b3-button ai-cancel-button">取消</button>');

    $confirmButton.on("click", () => {
      void onConfirm();
    });

    $cancelButton.on("click", () => {
      void onCancel();
    });

    $section.append($confirmButton);
    $section.append($cancelButton);

    return $section;
  }

  /**
   * 创建完整的对话框UI
   */
  static createDialogUI(
    dialog: Dialog,
    providerService: AIProviderService,
    context: AIChatContext | null,
    handlers: {
      onSend: () => void;
      onConfirm: () => void;
      onCancel: () => void;
    }
  ): void {
    const $body = $(dialog.element).find(".b3-dialog__body");
    $body.css({
      display: "flex",
      "flex-direction": "column",
      gap: "12px",
      padding: "16px",
    });

    // 创建提供商选择器
    const $providerSection = this.createProviderSelector(providerService);
    $body.append($providerSection);

    // 创建上下文显示区
    const $contextSection = this.createContextDisplay(context);
    $body.append($contextSection);

    // 创建用户输入区
    const $inputSection = this.createUserInput();
    $body.append($inputSection);

    // 创建发送按钮
    const $sendButton = this.createSendButton(handlers.onSend);
    $body.append($sendButton);

    // 创建响应预览区（初始隐藏）
    const $responseSection = this.createResponsePreview();
    $body.append($responseSection);

    // 创建操作按钮区（初始隐藏）
    const $actionSection = this.createActionButtons(handlers.onConfirm, handlers.onCancel);
    $body.append($actionSection);
  }
}
