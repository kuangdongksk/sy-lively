import { SY块 } from "@/class/思源/块";
import { message } from "@/components/base/rc/Message";
import { $ } from "@/constant/三方库";
import { App, Dialog } from "siyuan";
import type { AIChatContext } from "./types";
import { AIProviderService } from "./AIProviderService";
import { AIResponseRenderer } from "./AIResponseRenderer";

/**
 * AI聊天对话框管理器
 * 管理AI聊天对话框的创建、交互和销毁
 */
export class AIChatDialogManager {
  private app: App;
  private providerService: AIProviderService;
  private responseRenderer: AIResponseRenderer;

  private dialog: Dialog | null = null;
  private context: AIChatContext | null = null;
  private isSending: boolean = false;
  private hasResponse: boolean = false;

  private getData: (key: string) => Promise<any>;
  private putData: (key: string, value: any) => Promise<boolean>;

  constructor(config: {
    app: App;
    getData: (key: string) => Promise<any>;
    putData: (key: string, value: any) => Promise<boolean>;
  }) {
    this.app = config.app;
    this.getData = config.getData;
    this.putData = config.putData;

    this.providerService = new AIProviderService({
      getData: this.getData,
      putData: this.putData,
    });

    this.responseRenderer = new AIResponseRenderer({
      app: this.app,
      getData: this.getData,
      putData: this.putData,
    });
  }

  /**
   * 打开AI聊天对话框
   */
  async open(context: AIChatContext): Promise<void> {
    // 初始化提供商服务
    await this.providerService.init();

    // 检查是否有可用的提供商
    const enabledProviders = this.providerService.getEnabledProviders();
    if (enabledProviders.length === 0) {
      message.error("请先在设置中配置AI提供商");
      return;
    }

    this.context = context;

    // 创建对话框
    this.dialog = new Dialog({
      title: "AI聊天",
      content: "",
      width: "700px",
      height: "600px",
      hideCloseIcon: false,
      disableClose: false,
      destroyCallback: () => {
        this.onDialogClose();
      },
    });

    // 创建UI
    this.createUI();
  }

  /**
   * 创建对话框UI
   */
  private createUI(): void {
    if (!this.dialog) return;

    const $body = $(this.dialog.element).find(".b3-dialog__body");
    $body.css({
      display: "flex",
      "flex-direction": "column",
      gap: "12px",
      padding: "16px",
    });

    // 创建提供商选择器
    const $providerSection = this.createProviderSelector();
    $body.append($providerSection);

    // 创建上下文显示区
    const $contextSection = this.createContextDisplay();
    $body.append($contextSection);

    // 创建用户输入区
    const $inputSection = this.createUserInput();
    $body.append($inputSection);

    // 创建发送按钮
    const $sendButton = this.createSendButton();
    $body.append($sendButton);

    // 创建响应预览区（初始隐藏）
    const $responseSection = this.createResponsePreview();
    $body.append($responseSection);

    // 创建操作按钮区（初始隐藏）
    const $actionSection = this.createActionButtons();
    $body.append($actionSection);
  }

  /**
   * 创建提供商选择器
   */
  private createProviderSelector() {
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
    const enabledProviders = this.providerService.getEnabledProviders();
    enabledProviders.forEach((provider) => {
      const $option = $("<option></option>");
      $option.val(provider.id);
      $option.text(provider.name);
      if (provider.id === this.providerService["currentProviderId"]) {
        $option.prop("selected", true);
      }
      $select.append($option);
    });

    // 切换提供商
    $select.on("change", () => {
      const providerId = $select.val() as string;
      try {
        this.providerService.setCurrentProvider(providerId);
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
  private createContextDisplay() {
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

    if (this.context) {
      let contextText = "";
      if (this.context.selectedText) {
        contextText += `选中文本:\n${this.context.selectedText}\n\n`;
      }
      if (this.context.kramdown) {
        contextText += `块内容:\n${this.context.kramdown}`;
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
  private createUserInput() {
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
  private createSendButton() {
    const $button = $('<button class="b3-button ai-send-button">发送</button>');
    $button.css({
      width: "100%",
    });

    $button.on("click", () => {
      void this.onSend();
    });

    return $button;
  }

  /**
   * 创建响应预览区
   */
  private createResponsePreview() {
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
  private createActionButtons() {
    const $section = $('<div class="ai-action-buttons" style="display:none;gap:8px;"></div>');
    $section.css({
      display: "none",
      gap: "8px",
    });

    const $confirmButton = $('<button class="b3-button ai-confirm-button">确认插入</button>');
    const $cancelButton = $('<button class="b3-button ai-cancel-button">取消</button>');

    $confirmButton.on("click", () => {
      void this.onConfirm();
    });

    $cancelButton.on("click", () => {
      void this.onCancel();
    });

    $section.append($confirmButton);
    $section.append($cancelButton);

    return $section;
  }

  /**
   * 发送消息
   */
  private async onSend(): Promise<void> {
    if (this.isSending) return;

    const $dialogBody = $(this.dialog?.element).find(".b3-dialog__body");
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
    this.isSending = true;
    $sendButton.text("发送中...").prop("disabled", true);
    $responseSection.show();
    $responseContent.html('<div style="padding:12px;text-align:center;color:var(--b3-theme-on-surface);">等待AI响应...</div>');

    try {
      const context = this.context?.kramdown || "";

      // 显示加载中
      $responseContent.html('<div style="padding:12px;text-align:center;color:var(--b3-theme-on-surface);">正在生成响应...</div>');

      // 获取AI响应（流式或非流式）
      const response = await this.providerService.chat(prompt, context);

      // 渲染最终响应为超级块
      await this.renderResponse(response);

      // 显示操作按钮
      $actionButtons.show();
      this.hasResponse = true;
    } catch (e) {
      message.error(`请求失败: ${(e as Error).message}`);
      $responseContent.html(
        `<div style="padding:12px;color:var(--b3-theme-on-error);">请求失败: ${(e as Error).message}</div>`,
      );
    } finally {
      this.isSending = false;
      $sendButton.text("重新发送").prop("disabled", false);
    }
  }

  /**
   * 渲染响应
   */
  private async renderResponse(kramdown: string): Promise<void> {
    const $dialogBody = $(this.dialog?.element).find(".b3-dialog__body");
    const $responseContent = $dialogBody.find(".ai-response-content");

    $responseContent.empty();

    const { element } = await this.responseRenderer.render(kramdown);
    $responseContent.append(element);
  }

  /**
   * 确认插入
   */
  private async onConfirm(): Promise<void> {
    if (!this.hasResponse || !this.responseRenderer.getBlockId()) {
      message.warning("没有可插入的内容");
      return;
    }

    try {
      // 获取响应内容（已经是超级块格式）
      const kramdown = await this.responseRenderer.getResponseContent();
      const blockId = this.responseRenderer.getBlockId()!;
      // 使用预览时的blockId，保持ID一致
      const preparedKramdown = AIResponseRenderer.prepareForInsert(kramdown, blockId);

      // 使用公共方法插入块（在目标块之后）
      if (this.context?.insertTargetBlockId) {
        await SY块.insertBlockAfter({
          data: preparedKramdown,
          afterBlockId: this.context.insertTargetBlockId,
        });

        // 删除预览块（超级块）
        await this.responseRenderer.cleanup();

        message.success("已插入AI响应");
      } else {
        message.error("无法确定插入位置");
      }
    } catch (e) {
      message.error(`插入失败: ${(e as Error).message}`);
    } finally {
      this.close();
    }
  }

  /**
   * 取消
   */
  private async onCancel(): Promise<void> {
    await this.responseRenderer.cleanup();
    this.close();
  }

  /**
   * 对话框关闭回调
   */
  private async onDialogClose(): Promise<void> {
    if (this.hasResponse) {
      await this.responseRenderer.cleanup();
    }
  }

  /**
   * 关闭对话框
   */
  close(): void {
    this.dialog?.destroy();
    this.dialog = null;
    this.context = null;
    this.hasResponse = false;
  }
}
