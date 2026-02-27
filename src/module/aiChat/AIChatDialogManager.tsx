import { message } from "@/components/base/rc/Message";
import { App, Dialog } from "siyuan";
import type { AIChatContext } from "./types";
import { AIProviderService } from "./AIProviderService";
import { AIResponseRenderer } from "./AIResponseRenderer";
import { AIChatUI } from "./components/AIChatUI";
import { AIChatHandlers } from "./components/AIChatHandlers";

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

  // 用于与事件处理器共享状态
  private stateRefs = {
    isSending: { value: false },
    hasResponse: { value: false },
  };

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
        void this.onDialogClose();
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

    AIChatUI.createDialogUI(this.dialog, this.providerService, this.context, {
      onSend: () => void this.onSend(),
      onConfirm: () => void this.onConfirm(),
      onCancel: () => void this.onCancel(),
    });
  }

  /**
   * 发送消息
   */
  private async onSend(): Promise<void> {
    // 同步状态到stateRefs
    this.stateRefs.isSending.value = this.isSending;
    this.stateRefs.hasResponse.value = this.hasResponse;

    await AIChatHandlers.handleSend({
      dialog: this.dialog,
      context: this.context,
      providerService: this.providerService,
      responseRenderer: this.responseRenderer,
      isSending: this.stateRefs.isSending,
      hasResponse: this.stateRefs.hasResponse,
    });

    // 同步状态回实例
    this.isSending = this.stateRefs.isSending.value;
    this.hasResponse = this.stateRefs.hasResponse.value;
  }

  /**
   * 确认插入
   */
  private async onConfirm(): Promise<void> {
    await AIChatHandlers.handleConfirm({
      context: this.context,
      responseRenderer: this.responseRenderer,
      hasResponse: this.stateRefs.hasResponse,
      close: () => this.close(),
    });

    // 同步状态回实例
    this.hasResponse = this.stateRefs.hasResponse.value;
  }

  /**
   * 取消
   */
  private async onCancel(): Promise<void> {
    await AIChatHandlers.handleCancel({
      responseRenderer: this.responseRenderer,
      close: () => this.close(),
    });
  }

  /**
   * 对话框关闭回调
   */
  private async onDialogClose(): Promise<void> {
    await AIChatHandlers.handleDialogClose({
      responseRenderer: this.responseRenderer,
      hasResponse: this.stateRefs.hasResponse,
    });

    // 同步状态回实例
    this.hasResponse = this.stateRefs.hasResponse.value;
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
