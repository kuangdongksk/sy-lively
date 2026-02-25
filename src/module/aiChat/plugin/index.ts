import type { App, IProtyle, Plugin } from "siyuan";
import { ContextCollector } from "../ContextCollector";
import { AIChatDialogManager } from "../AIChatDialogManager";

/**
 * AI聊天插件
 */
export class AIChatPlugin {
  private app: App;
  private getData: (key: string) => Promise<any>;
  private putData: (key: string, value: any) => Promise<boolean>;
  private dialogManager: AIChatDialogManager | null = null;

  constructor(config: {
    app: App;
    getData: (key: string) => Promise<any>;
    putData: (key: string, value: any) => Promise<boolean>;
  }) {
    this.app = config.app;
    this.getData = config.getData;
    this.putData = config.putData;
  }

  /**
   * 打开AI聊天对话框
   * @param protyle Protyle编辑器实例
   * @param focusedBlockId 当前聚焦的块ID
   */
  async openChat(
    protyle: IProtyle,
    focusedBlockId: string | null
  ): Promise<void> {
    try {
      // 收集上下文
      const contextCollector = new ContextCollector({
        protyle,
        focusedBlockId,
      });

      const context = await contextCollector.collect();

      // 创建对话框管理器
      this.dialogManager = new AIChatDialogManager({
        app: this.app,
        getData: this.getData,
        putData: this.putData,
      });

      // 打开对话框
      await this.dialogManager.open(context);
    } catch (e) {
      console.error("打开AI聊天失败:", e);
    }
  }
}

export default AIChatPlugin;
