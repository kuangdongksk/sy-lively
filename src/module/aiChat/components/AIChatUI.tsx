import { message } from "@/components/base/rc/Message";
import { $ } from "@/constant/三方库";
import { Dialog } from "siyuan";
import type { AIChatContext, ChatMessage } from "../types";
import type { AIProviderService } from "../AIProviderService";
import type { PromptTemplateService } from "../PromptTemplateService";
import type { IAIProvider } from "../types";

/**
 * AI聊天对话框UI组件
 * 负责创建对话框中的各个UI部分
 */
export class AIChatUI {
  // 保存当前对话框的回调，用于刷新模板列表和历史列表
  private static currentTemplateDialog: Dialog | null = null;
  private static currentPromptTemplateService: PromptTemplateService | null = null;
  private static currentOnTemplateSelect: ((content: string) => void) | null = null;
  private static currentProviderService: AIProviderService | null = null;
  private static currentHistoryListElement: JQuery<HTMLElement> | null = null;

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
      "margin-bottom": "8px",
    });

    const $label = $('<label style="min-width: 60px; font-size:12px;">AI提供商:</label>');
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

    // 切换提供商时更新思考选项状态
    $select.on("change", () => {
      const providerId = $select.val() as string;
      try {
        providerService.setCurrentProvider(providerId);
        // 更新思考选项的可用状态
        const provider = providerService.getProvider(providerId);
        const $thinkingCheckbox = $(".ai-thinking-checkbox");
        if ($thinkingCheckbox.length) {
          $thinkingCheckbox.prop("disabled", !provider?.thinkingModel);
          if (!provider?.thinkingModel) {
            $thinkingCheckbox.prop("checked", false);
          }
        }
      } catch (e) {
        message.error((e as Error).message);
      }
    });

    $section.append($label);
    $section.append($select);

    return $section;
  }

  /**
   * 创建选项区域（思考模式、流式响应）
   */
  static createOptionsSection(providerService: AIProviderService): JQuery<HTMLElement> {
    const $section = $('<div class="ai-options-section"></div>');
    $section.css({
      display: "flex",
      "align-items": "center",
      gap: "16px",
      "margin-bottom": "8px",
      padding: "8px",
      "background-color": "var(--b3-theme-background)",
      "border-radius": "4px",
    });

    // 获取当前提供商
    const currentProvider = providerService.getCurrentProvider();

    // 思考模式选项
    const $thinkingLabel = $('<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;"></label>');
    const $thinkingCheckbox = $('<input type="checkbox" class="ai-thinking-checkbox" />');
    $thinkingCheckbox.prop("disabled", !currentProvider?.thinkingModel);
    $thinkingCheckbox.css({
      width: "16px",
      height: "16px",
    });
    const $thinkingText = $('<span>思考模式</span>');
    if (!currentProvider?.thinkingModel) {
      $thinkingText.attr("title", "此提供商未配置思考模型").css({ opacity: 0.5 });
    }
    $thinkingLabel.append($thinkingCheckbox);
    $thinkingLabel.append($thinkingText);

    // 流式响应选项
    const $streamingLabel = $('<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;"></label>');
    const $streamingCheckbox = $('<input type="checkbox" class="ai-streaming-checkbox" />');
    $streamingCheckbox.prop("checked", currentProvider?.streamResponse ?? false);
    $streamingCheckbox.css({
      width: "16px",
      height: "16px",
    });
    const $streamingText = $('<span>流式响应</span>');
    $streamingLabel.append($streamingCheckbox);
    $streamingLabel.append($streamingText);

    $section.append($thinkingLabel);
    $section.append($streamingLabel);

    return $section;
  }

  /**
   * 创建提示词模板选择器
   */
  static createPromptTemplateSelector(
    promptTemplateService: PromptTemplateService,
    onTemplateSelect: (content: string) => void
  ): JQuery<HTMLElement> {
    const $section = $('<div class="ai-prompt-templates"></div>');
    $section.css({
      display: "flex",
      "align-items": "center",
      gap: "8px",
      "margin-bottom": "8px",
    });

    const $label = $('<label style="min-width: 60px; font-size:12px;">快捷模板:</label>');

    // 模板按钮容器
    const $templatesContainer = $('<div style="display:flex;gap:4px;flex:1;flex-wrap:wrap;"></div>');

    // 获取快捷模板
    const templates = promptTemplateService.getShortcutTemplates();
    if (templates.length === 0) {
      $templatesContainer.html(
        '<span style="font-size:12px;color:var(--b3-theme-on-surface);">暂无模板</span>'
      );
    } else {
      templates.forEach((template) => {
        const $button = $(`<button class="b3-button b3-button--outline" data-template-id="${template.id}">${template.name}</button>`);
        $button.css({
          padding: "2px 8px",
          "font-size": "12px",
        });
        $button.on("click", () => {
          onTemplateSelect(template.content);
        });
        $templatesContainer.append($button);
      });
    }

    // 更多模板按钮
    const $moreButton = $('<button class="b3-button b3-button--text" title="更多模板">…</button>');
    $moreButton.css({
      "font-size": "12px",
      padding: "0 4px",
    });
    $moreButton.on("click", () => {
      void this.showTemplateDialog(promptTemplateService, onTemplateSelect);
    });

    // 新建模板按钮
    const $newButton = $('<button class="b3-button b3-button--text" title="新建模板">+</button>');
    $newButton.css({
      "font-size": "12px",
      padding: "0 4px",
    });
    $newButton.on("click", () => {
      void this.showNewTemplateDialog(promptTemplateService);
    });

    $section.append($label);
    $section.append($templatesContainer);
    $section.append($moreButton);
    $section.append($newButton);

    return $section;
  }

  /**
   * 显示模板选择对话框
   */
  private static async showTemplateDialog(
    promptTemplateService: PromptTemplateService,
    onTemplateSelect: (content: string) => void
  ): Promise<void> {
    const templates = promptTemplateService.getTemplates();

    const dialog = new Dialog({
      title: "提示词模板",
      content: "",
      width: "500px",
      height: "400px",
      hideCloseIcon: false,
    });

    // 保存当前对话框信息，用于刷新
    this.currentTemplateDialog = dialog;
    this.currentPromptTemplateService = promptTemplateService;
    this.currentOnTemplateSelect = onTemplateSelect;

    const $body = $(dialog.element).find(".b3-dialog__body");
    $body.css({
      padding: "16px",
      display: "flex",
      "flex-direction": "column",
      height: "100%",
    });

    const $container = $('<div style="display:flex;flex-direction:column;gap:12px;height:100%;"></div>');

    // 工具栏
    const $toolbar = $('<div style="display:flex;gap:8px;"></div>');
    const $newButton = $('<button class="b3-button b3-button--outline">新建模板</button>');
    $newButton.on("click", () => {
      void this.showNewTemplateDialog(promptTemplateService);
    });
    $toolbar.append($newButton);
    $container.append($toolbar);

    // 模板列表
    const $list = $('<div style="flex:1;overflow-y:auto;"></div>');

    const renderTemplateList = () => {
      const currentTemplates = promptTemplateService.getTemplates();
      $list.empty();

      if (currentTemplates.length === 0) {
        $list.html('<div style="text-align:center;padding:20px;color:var(--b3-theme-on-surface);">暂无模板，点击"新建模板"创建</div>');
        return;
      }

      currentTemplates.forEach((template) => {
        const $item = $('<div class="template-item" style="padding:8px;border:1px solid var(--b3-theme-surface);border-radius:4px;margin-bottom:8px;"></div>');

        const $header = $('<div style="display:flex;align-items:center;justify-content:space-between;"></div>');

        const $left = $('<div style="display:flex;align-items:center;gap:8px;"></div>');
        const $name = $(`<span style="font-weight:500;">${this.escapeHtml(template.name)}</span>`);
        const $shortcut = template.isShortcut
          ? $('<span class="b3-chip" style="font-size:10px;padding:2px 6px;border-radius:10px;background-color:var(--b3-theme-primary);color:var(--b3-theme-primary-on);">快捷</span>')
          : $();

        $left.append($name);
        if ($shortcut.length > 0) $left.append($shortcut);

        const $actions = $('<div style="display:flex;gap:4px;"></div>');

        // 使用按钮
        const $useButton = $('<button class="b3-button b3-button--text" style="padding:2px 8px;font-size:12px;">使用</button>');
        $useButton.on("click", () => {
          onTemplateSelect(template.content);
          dialog.destroy();
        });

        // 编辑按钮
        const $editButton = $('<button class="b3-button b3-button--text" style="padding:2px 8px;font-size:12px;">编辑</button>');
        $editButton.on("click", () => {
          void this.showEditTemplateDialog(promptTemplateService, template);
        });

        // 删除按钮
        const $deleteButton = $('<button class="b3-button b3-button--text" style="padding:2px 8px;font-size:12px;color:var(--b3-theme-on-error);">删除</button>');
        $deleteButton.on("click", async () => {
          if (confirm(`确定要删除模板"${template.name}"吗？`)) {
            try {
              await promptTemplateService.deleteTemplate(template.id);
              message.success("模板已删除");
              renderTemplateList();
            } catch (e) {
              message.error("删除失败: " + (e as Error).message);
            }
          }
        });

        $actions.append($useButton);
        $actions.append($editButton);
        $actions.append($deleteButton);

        $header.append($left);
        $header.append($actions);

        const $content = $(`<div style="font-size:12px;color:var(--b3-theme-on-surface);margin-top:4px;white-space:pre-wrap;max-height:60px;overflow:hidden;">${this.escapeHtml(template.content)}</div>`);

        $item.append($header);
        $item.append($content);

        $list.append($item);
      });
    };

    renderTemplateList();
    $container.append($list);
    $body.append($container);
  }

  /**
   * 显示新建模板对话框
   */
  private static async showNewTemplateDialog(
    promptTemplateService: PromptTemplateService
  ): Promise<void> {
    const dialog = new Dialog({
      title: "新建提示词模板",
      content: "",
      width: "400px",
      hideCloseIcon: false,
    });

    const $body = $(dialog.element).find(".b3-dialog__body");
    $body.css({
      padding: "16px",
    });

    const $form = $('<form style="display:flex;flex-direction:column;gap:12px;"></form>');

    // 名称输入
    const $nameGroup = $('<div style="display:flex;flex-direction:column;gap:4px;"></div>');
    const $nameLabel = $('<label style="font-size:12px;">模板名称:</label>');
    const $nameInput = $('<input type="text" class="b3-text-field" placeholder="例如：总结内容" />');
    $nameGroup.append($nameLabel);
    $nameGroup.append($nameInput);

    // 内容输入
    const $contentGroup = $('<div style="display:flex;flex-direction:column;gap:4px;"></div>');
    const $contentLabel = $('<label style="font-size:12px;">模板内容:</label>');
    const $contentInput = $('<textarea class="b3-text-field" rows="4" placeholder="请输入提示词内容..."></textarea>');
    $contentGroup.append($contentLabel);
    $contentGroup.append($contentInput);

    // 快捷方式复选框
    const $shortcutGroup = $('<div style="display:flex;align-items:center;gap:8px;"></div>');
    const $shortcutCheckbox = $('<input type="checkbox" id="template-shortcut" />');
    const $shortcutLabel = $('<label for="template-shortcut" style="font-size:12px;">显示为快捷选项</label>');
    $shortcutGroup.append($shortcutCheckbox);
    $shortcutGroup.append($shortcutLabel);

    // 按钮
    const $buttons = $('<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;"></div>');
    const $cancelButton = $('<button class="b3-button">取消</button>');
    const $saveButton = $('<button class="b3-button b3-button--primary">保存</button>');

    $cancelButton.on("click", () => dialog.destroy());
    $saveButton.on("click", async (e) => {
      e.preventDefault();
      const name = $nameInput.val() as string;
      const content = $contentInput.val() as string;
      const isShortcut = $shortcutCheckbox.prop("checked") as boolean;

      if (!name.trim()) {
        message.warning("请输入模板名称");
        return;
      }
      if (!content.trim()) {
        message.warning("请输入模板内容");
        return;
      }

      await promptTemplateService.addTemplate({
        name: name.trim(),
        content: content.trim(),
        isShortcut,
        order: promptTemplateService.getTemplates().length,
      });

      message.success("模板已保存");
      dialog.destroy();

      // 刷新模板列表对话框
      if (this.currentTemplateDialog && this.currentPromptTemplateService) {
        void this.showTemplateDialog(this.currentPromptTemplateService, this.currentOnTemplateSelect!);
      }
    });

    $buttons.append($cancelButton);
    $buttons.append($saveButton);

    $form.append($nameGroup);
    $form.append($contentGroup);
    $form.append($shortcutGroup);
    $form.append($buttons);
    $body.append($form);
  }

  /**
   * 显示编辑模板对话框
   */
  private static async showEditTemplateDialog(
    promptTemplateService: PromptTemplateService,
    template: { id: string; name: string; content: string; isShortcut?: boolean }
  ): Promise<void> {
    const dialog = new Dialog({
      title: "编辑提示词模板",
      content: "",
      width: "400px",
      hideCloseIcon: false,
    });

    const $body = $(dialog.element).find(".b3-dialog__body");
    $body.css({
      padding: "16px",
    });

    const $form = $('<form style="display:flex;flex-direction:column;gap:12px;"></form>');

    // 名称输入
    const $nameGroup = $('<div style="display:flex;flex-direction:column;gap:4px;"></div>');
    const $nameLabel = $('<label style="font-size:12px;">模板名称:</label>');
    const $nameInput = $('<input type="text" class="b3-text-field" placeholder="例如：总结内容" />');
    $nameInput.val(template.name);
    $nameGroup.append($nameLabel);
    $nameGroup.append($nameInput);

    // 内容输入
    const $contentGroup = $('<div style="display:flex;flex-direction:column;gap:4px;"></div>');
    const $contentLabel = $('<label style="font-size:12px;">模板内容:</label>');
    const $contentInput = $('<textarea class="b3-text-field" rows="4" placeholder="请输入提示词内容..."></textarea>');
    $contentInput.val(template.content);
    $contentGroup.append($contentLabel);
    $contentGroup.append($contentInput);

    // 快捷方式复选框
    const $shortcutGroup = $('<div style="display:flex;align-items:center;gap:8px;"></div>');
    const $shortcutCheckbox = $('<input type="checkbox" id="template-shortcut-edit" />');
    $shortcutCheckbox.prop("checked", template.isShortcut ?? false);
    const $shortcutLabel = $('<label for="template-shortcut-edit" style="font-size:12px;">显示为快捷选项</label>');
    $shortcutGroup.append($shortcutCheckbox);
    $shortcutGroup.append($shortcutLabel);

    // 按钮
    const $buttons = $('<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;"></div>');
    const $cancelButton = $('<button class="b3-button">取消</button>');
    const $saveButton = $('<button class="b3-button b3-button--primary">保存</button>');

    $cancelButton.on("click", () => dialog.destroy());
    $saveButton.on("click", async (e) => {
      e.preventDefault();
      const name = $nameInput.val() as string;
      const content = $contentInput.val() as string;
      const isShortcut = $shortcutCheckbox.prop("checked") as boolean;

      if (!name.trim()) {
        message.warning("请输入模板名称");
        return;
      }
      if (!content.trim()) {
        message.warning("请输入模板内容");
        return;
      }

      await promptTemplateService.updateTemplate(template.id, {
        name: name.trim(),
        content: content.trim(),
        isShortcut,
      });

      message.success("模板已更新");
      dialog.destroy();

      // 刷新模板列表对话框
      if (this.currentTemplateDialog && this.currentPromptTemplateService) {
        void this.showTemplateDialog(this.currentPromptTemplateService, this.currentOnTemplateSelect!);
      }
    });

    $buttons.append($cancelButton);
    $buttons.append($saveButton);

    $form.append($nameGroup);
    $form.append($contentGroup);
    $form.append($shortcutGroup);
    $form.append($buttons);
    $body.append($form);
  }

  /**
   * 转义HTML
   */
  private static escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
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
    const $section = $('<div class="ai-user-input"></div>');
    // 移除 flex:1，改为固定高度，避免被压缩
    $section.css({
      flexShrink: "0",
    });

    const $label = $('<label style="display:block;margin-bottom:8px;">你的问题:</label>');

    const $textarea = $(
      '<textarea class="b3-text-field ai-prompt-textarea" placeholder="请输入你的问题..."></textarea>',
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
      flexShrink: "0", // 防止按钮被压缩
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

    const $header = $('<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;"></div>');
    const $label = $('<label style="margin:0;">AI响应:</label>');

    const $copyButton = $('<button class="b3-button b3-button--text" style="padding:2px 8px;font-size:12px;" title="复制响应">复制</button>');
    $copyButton.on("click", () => {
      const $content = $section.find(".ai-response-content");
      const text = $content.text() || "";
      if (text) {
        navigator.clipboard.writeText(text);
        message.success("已复制到剪贴板");
      }
    });

    $header.append($label);
    $header.append($copyButton);

    const $content = $('<div class="ai-response-content"></div>');
    // 设置最大高度和滚动
    $content.css({
      maxHeight: "350px",
      overflow: "auto",
    });

    $section.append($header);
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
      flexShrink: "0", // 防止按钮被压缩
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
   * 创建对话历史侧边栏
   */
  static createConversationHistorySidebar(
    providerService: AIProviderService
  ): JQuery<HTMLElement> {
    const $sidebar = $('<div class="ai-history-sidebar"></div>');
    $sidebar.css({
      width: "280px",
      display: "flex",
      "flex-direction": "column",
      gap: "8px",
      "border-right": "1px solid var(--b3-theme-surface)",
      "padding-right": "12px",
      "flex-shrink": "0",
    });

    // 标题和清空按钮
    const $header = $('<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;"></div>');
    const $title = $('<span style="font-size:13px;font-weight:500;">对话历史</span>');
    const $clearButton = $('<button class="b3-button b3-button--text" title="清空历史" style="padding:2px 6px;font-size:12px;">清空</button>');
    $clearButton.on("click", async () => {
      if (confirm("确定要清空当前提供商的对话历史吗？")) {
        providerService.clearConversationHistory();
        this.refreshConversationHistory(providerService);
        message.success("对话历史已清空");
      }
    });

    $header.append($title);
    $header.append($clearButton);
    $sidebar.append($header);

    // 历史列表
    const $list = $('<div class="ai-history-list" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:4px;"></div>');
    $sidebar.append($list);

    // 保存引用以便刷新
    this.currentHistoryListElement = $list;

    // 初始加载历史
    this.refreshConversationHistory(providerService);

    return $sidebar;
  }

  /**
   * 刷新对话历史列表
   */
  static refreshConversationHistory(providerService: AIProviderService): void {
    if (!this.currentHistoryListElement || this.currentHistoryListElement.length === 0) return;

    const $list = this.currentHistoryListElement;
    $list.empty();

    const history = providerService.getConversationHistory();

    if (history.length === 0) {
      $list.html('<div style="text-align:center;padding:20px;color:var(--b3-theme-on-surface);font-size:12px;">暂无对话历史</div>');
      return;
    }

    history.forEach((msg, index) => {
      const $item = $('<div class="history-item" style="padding:8px;border-radius:4px;background-color:var(--b3-theme-background);border:1px solid var(--b3-theme-surface);transition:background-color 0.2s;"></div>');

      // Hover effect
      $item.on("mouseenter", function() {
        $(this).css({ "background-color": "var(--b3-theme-surface)" });
      });
      $item.on("mouseleave", function() {
        $(this).css({ "background-color": "var(--b3-theme-background)" });
      });

      const $msgHeader = $('<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;"></div>');

      const roleIcon = msg.role === "user" ? "👤" : "🤖";
      const roleName = msg.role === "user" ? "用户" : "助手";

      const $role = $(`<span style="font-size:11px;font-weight:500;color:${msg.role === "user" ? "var(--b3-theme-primary)" : "var(--b3-theme-success)"};">${roleIcon} ${roleName}</span>`);

      // 时间戳
      const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) : "";
      const $time = $(`<span style="font-size:10px;color:var(--b3-theme-on-surface);margin-left:auto;">${timeStr}</span>`);

      $msgHeader.append($role);
      $msgHeader.append($time);

      // 内容预览
      let content = msg.content;
      if (msg.reasoning) {
        content = `[思考过程]\n${msg.reasoning}\n\n[回答]\n${msg.content}`;
      }
      const preview = content.length > 100 ? content.slice(0, 100) + "..." : content;

      const $content = $(`<div style="font-size:12px;color:var(--b3-theme-on-surface);white-space:pre-wrap;line-height:1.4;max-height:80px;overflow:hidden;text-overflow:ellipsis;">${this.escapeHtml(preview)}</div>`);

      // 操作按钮（默认隐藏，hover时显示）
      const $actions = $('<div class="history-actions" style="display:flex;gap:4px;margin-top:6px;opacity:0;transition:opacity 0.2s;"></div>');

      const $copyButton = $('<button class="b3-button b3-button--text" style="padding:2px 6px;font-size:11px;">复制</button>');
      $copyButton.on("click", () => {
        navigator.clipboard.writeText(content);
        message.success("已复制到剪贴板");
      });

      const $deleteButton = $('<button class="b3-button b3-button--text" style="padding:2px 6px;font-size:11px;color:var(--b3-theme-on-error);">删除</button>');
      $deleteButton.on("click", () => {
        if (confirm("确定要删除这条消息吗？")) {
          // 删除这条及之后的所有消息（保持对话连贯性）
          providerService.getConversationHistory().splice(index);
          this.refreshConversationHistory(providerService);
          message.success("消息已删除");
        }
      });

      $actions.append($copyButton);
      $actions.append($deleteButton);

      // Hover显示操作按钮
      $item.on("mouseenter", function() {
        $(this).find(".history-actions").css({ opacity: "1" });
      });
      $item.on("mouseleave", function() {
        $(this).find(".history-actions").css({ opacity: "0" });
      });

      $item.append($msgHeader);
      $item.append($content);
      $item.append($actions);

      $list.append($item);
    });

    // 滚动到底部
    if ($list.length > 0 && $list[0]) {
      $list.scrollTop($list[0].scrollHeight);
    }
  }

  /**
   * 创建完整的对话框UI - 左右分栏布局
   */
  static createDialogUI(
    dialog: Dialog,
    providerService: AIProviderService,
    promptTemplateService: PromptTemplateService,
    context: AIChatContext | null,
    handlers: {
      onSend: () => void;
      onConfirm: () => void;
      onCancel: () => void;
    }
  ): void {
    // 保存providerService引用
    this.currentProviderService = providerService;

    const $body = $(dialog.element).find(".b3-dialog__body");
    $body.css({
      display: "flex",
      "flex-direction": "row",
      gap: "0",
      padding: "0",
      height: "600px",
      overflow: "hidden",
    });

    // 左侧：对话历史
    const $leftPanel = $('<div class="ai-left-panel" style="display:flex;flex-direction:column;padding:12px;"></div>');
    const $historySidebar = this.createConversationHistorySidebar(providerService);
    $leftPanel.append($historySidebar);

    // 右侧：主操作区
    const $rightPanel = $('<div class="ai-right-panel" style="flex:1;display:flex;flex-direction:column;gap:12px;padding:16px;overflow-y:auto;"></div>');

    // 顶部栏：提供商选择 + 选项
    const $topBar = $('<div style="display:flex;gap:12px;align-items:flex-start;flex-shrink:0;"></div>');

    const $providerSection = this.createProviderSelector(providerService);
    $providerSection.css({ flex: "1" });

    const $optionsSection = this.createOptionsSection(providerService);
    $optionsSection.css({ flex: "0" });

    $topBar.append($providerSection);
    $topBar.append($optionsSection);
    $rightPanel.append($topBar);

    // 提示词模板选择器
    const $templateSection = this.createPromptTemplateSelector(
      promptTemplateService,
      (content) => {
        const $textarea = $rightPanel.find(".ai-prompt-textarea");
        const currentValue = $textarea.val() as string;
        if (currentValue && !currentValue.endsWith(content)) {
          $textarea.val(currentValue + "\n" + content);
        } else {
          $textarea.val(content);
        }
        $textarea.trigger("focus");
      }
    );
    $rightPanel.append($templateSection);

    // 上下文显示区（可折叠）
    const $contextSection = this.createContextDisplay(context);
    $rightPanel.append($contextSection);

    // 用户输入区 + 发送按钮
    const $inputContainer = $('<div style="flex-shrink:0;"></div>');
    const $inputSection = this.createUserInput();
    $inputContainer.append($inputSection);

    const $sendButton = this.createSendButton(handlers.onSend);
    $inputContainer.append($sendButton);

    $rightPanel.append($inputContainer);

    // 响应预览区（初始隐藏）
    const $responseSection = this.createResponsePreview();
    $rightPanel.append($responseSection);

    // 操作按钮区（初始隐藏）
    const $actionSection = this.createActionButtons(handlers.onConfirm, handlers.onCancel);
    $rightPanel.append($actionSection);

    $body.append($leftPanel);
    $body.append($rightPanel);
  }

  /**
   * 获取当前对话框的选项设置
   */
  static getDialogOptions(): { useThinking: boolean; useStreaming: boolean } {
    return {
      useThinking: $(".ai-thinking-checkbox").prop("checked") as boolean,
      useStreaming: $(".ai-streaming-checkbox").prop("checked") as boolean,
    };
  }
}
