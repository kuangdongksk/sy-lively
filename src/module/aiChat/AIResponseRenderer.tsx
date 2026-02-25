import { SY块 } from "@/class/思源/块";
import { EStoreKey } from "@/constant/系统码";
import { $ } from "@/constant/三方库";
import Kramdown助手 from "@/class/helper/Kramdown助手";
import { App, Protyle } from "siyuan";
import { 生成块ID } from "@/tools/事项/事项";

/**
 * AI响应渲染器
 * 使用Protyle渲染AI响应的kramdown内容
 */
export class AIResponseRenderer {
  private app: App;
  private tempPreviewDocId: string | null = null;
  private responseBlockId: string | null = null;
  private protyleElement: HTMLElement | null = null;

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
  }

  /**
   * 初始化临时预览文档
   * 创建或获取用于AI响应预览的临时文档
   */
  private async initTempDoc(): Promise<string> {
    // 尝试从存储中获取临时文档ID
    let tempDocId = await this.getData(EStoreKey.AI临时文档ID);

    // 检查文档是否存在
    if (tempDocId) {
      try {
        await SY块.获取块Kramdown源码(tempDocId);
        this.tempPreviewDocId = tempDocId;
        return tempDocId;
      } catch (e) {
        // 文档不存在，需要重新创建
        tempDocId = null;
      }
    }

    // 创建新的临时文档
    // 这里我们需要创建一个隐藏的文档用于预览
    // 由于SiYuan API的限制，我们使用一个临时的方案：
    // 使用用户设置的卡片文档或者创建一个专门的笔记本

    // 暂时使用卡片文档作为临时文档
    const cardDocId = await this.getData(EStoreKey.卡片文档ID);
    if (!cardDocId) {
      throw new Error("请先设置卡片文档ID");
    }

    this.tempPreviewDocId = cardDocId;
    await this.putData(EStoreKey.AI临时文档ID, cardDocId);

    return cardDocId;
  }

  /**
   * 渲染AI响应
   * @param kramdown AI响应的kramdown内容
   * @returns Protyle元素和块ID
   */
  async render(kramdown: string): Promise<{
    element: HTMLElement;
    blockId: string;
  }> {
    const docId = await this.initTempDoc();
    const blockId = 生成块ID();

    // 将AI响应包装在超级块中（使用数组格式）
    const superblockKramdown = Kramdown助手.生成超级块带属性([kramdown], blockId);

    // 插入临时块
    await SY块.插入后置子块({
      parentID: docId,
      dataType: "markdown",
      data: superblockKramdown,
    });

    this.responseBlockId = blockId;

    // 创建Protyle元素
    const pe = document.createElement("div");
    pe.style.cssText = `
      min-height: 100px;
      max-height: 500px;
      border: 1px solid var(--b3-theme-surface);
      border-radius: 4px;
      overflow-y: auto;
      overflow-x: hidden;
    `;

    // 初始化Protyle
    new Protyle(this.app, pe, {
      blockId: blockId,
      mode: "wysiwyg",
      rootId: docId,
    });

    this.protyleElement = pe;

    return {
      element: pe,
      blockId: blockId,
    };
  }

  /**
   * 更新渲染的内容（用于流式响应）
   */
  async update(kramdown: string): Promise<void> {
    if (!this.responseBlockId) {
      throw new Error("没有正在渲染的响应");
    }

    // 更新块内容
    await SY块.更新块({
      id: this.responseBlockId,
      dataType: "markdown",
      data: kramdown,
    });
  }

  /**
   * 获取响应内容
   */
  async getResponseContent(): Promise<string> {
    if (!this.responseBlockId) {
      throw new Error("没有正在渲染的响应");
    }

    const result = await SY块.获取块Kramdown源码(this.responseBlockId);
    return result.data.kramdown;
  }

  /**
   * 清理临时预览块
   * 删除预览时创建的临时块
   */
  async cleanup(): Promise<void> {
    if (this.responseBlockId) {
      try {
        await SY块.删除块(this.responseBlockId);
      } catch (e) {
        console.error("删除临时预览块失败:", e);
      }
      this.responseBlockId = null;
    }

    this.protyleElement = null;
  }

  /**
   * 获取Protyle元素
   */
  getElement(): HTMLElement | null {
    return this.protyleElement;
  }

  /**
   * 获取响应块ID
   */
  getBlockId(): string | null {
    return this.responseBlockId;
  }

  /**
   * 将kramdown转换为适合插入的格式
   * 包装为超级块
   */
  static prepareForInsert(kramdown: string, blockId?: string): string {
    // 如果已经是超级块格式，直接返回
    if (kramdown.trim().startsWith("{{{")) {
      return kramdown.trim();
    }
    // 包装为超级块（使用数组格式）
    const id = blockId || 生成块ID();
    return Kramdown助手.生成超级块带属性([kramdown], id);
  }
}
