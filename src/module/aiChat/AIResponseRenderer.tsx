import { SY块 } from "@/class/思源/块";
import { EStoreKey } from "@/constant/系统码";
import { $ } from "@/constant/三方库";
import Kramdown助手 from "@/class/helper/Kramdown助手";
import { App, Protyle } from "siyuan";
import { 生成块ID } from "@/tools/事项/事项";

/**
 * AI响应渲染器
 * 使用Protyle渲染AI响应的kramdown内容
 * 支持实时流式预览
 */
export class AIResponseRenderer {
  private app: App;
  private tempPreviewDocId: string | null = null;
  private responseBlockId: string | null = null;
  private protyleElement: HTMLElement | null = null;
  private previewElement: HTMLElement | null = null;

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
   * 初始化预览元素（用于流式响应）
   * @returns 预览元素和块ID
   */
  async initPreviewElement(): Promise<{ element: HTMLElement; blockId: string }> {
    const docId = await this.initTempDoc();
    const blockId = 生成块ID();

    // 创建预览容器
    const previewContainer = document.createElement("div");
    previewContainer.className = "ai-response-preview-container";
    previewContainer.style.cssText = `
      min-height: 100px;
      max-height: 500px;
      border: 1px solid var(--b3-theme-surface);
      border-radius: 4px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px;
      background-color: var(--b3-theme-background);
    `;

    // 初始提示
    previewContainer.innerHTML = `
      <div style="color:var(--b3-theme-on-surface);text-align:center;">
        等待AI响应...
      </div>
    `;

    this.responseBlockId = blockId;
    this.previewElement = previewContainer;

    return {
      element: previewContainer,
      blockId: blockId,
    };
  }

  /**
   * 更新思考过程预览（DeepSeek思考模式）
   */
  updateThinkingPreview(element: HTMLElement, reasoning: string): void {
    const thinkingContainer = element.querySelector(".ai-thinking-preview") as HTMLElement;
    if (thinkingContainer) {
      const content = thinkingContainer.querySelector(".ai-thinking-content") as HTMLElement;
      if (content) {
        content.textContent = reasoning;
      }
    } else {
      // 创建思考过程容器
      const newContainer = document.createElement("div");
      newContainer.className = "ai-thinking-preview";
      newContainer.style.cssText = `
        margin-bottom: 16px;
        padding: 12px;
        background-color: var(--b3-theme-surface);
        border-radius: 4px;
        border-left: 3px solid var(--b3-theme-primary);
      `;

      const header = document.createElement("div");
      header.style.cssText = `
        font-size: 12px;
        font-weight: 500;
        color: var(--b3-theme-primary);
        margin-bottom: 8px;
      `;
      header.textContent = "🤔 思考过程";

      const content = document.createElement("div");
      content.className = "ai-thinking-content";
      content.style.cssText = `
        font-size: 12px;
        color: var(--b3-theme-on-surface);
        white-space: pre-wrap;
        font-family: monospace;
      `;
      content.textContent = reasoning;

      newContainer.appendChild(header);
      newContainer.appendChild(content);

      // 插入到内容之前
      const contentContainer = element.querySelector(".ai-content-preview");
      if (contentContainer) {
        element.insertBefore(newContainer, contentContainer);
      } else {
        element.appendChild(newContainer);
      }
    }
  }

  /**
   * 更新内容预览
   */
  updateContentPreview(element: HTMLElement, content: string, reasoning?: string): void {
    let contentContainer = element.querySelector(".ai-content-preview") as HTMLElement;

    if (!contentContainer) {
      contentContainer = document.createElement("div");
      contentContainer.className = "ai-content-preview";
      contentContainer.style.cssText = `
        padding: 8px 0;
      `;
      element.appendChild(contentContainer);
    }

    // 显示内容（简单文本预览，不使用Protyle渲染）
    contentContainer.innerHTML = `
      <div style="font-size:13px;line-height:1.6;white-space:pre-wrap;">${this.escapeHtml(content)}</div>
    `;
  }

  /**
   * 转义HTML
   */
  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 使用指定块ID渲染完整响应
   */
  async renderWithBlockId(kramdown: string, blockId: string): Promise<{
    element: HTMLElement;
    blockId: string;
  }> {
    const docId = await this.initTempDoc();

    // 将AI响应包装在超级块中（使用数组格式）
    const superblockKramdown = Kramdown助手.生成超级块带属性([kramdown], blockId);

    // 检查块是否已存在
    const existingContent = await SY块.获取块Kramdown源码(blockId).catch(() => null);

    if (existingContent) {
      // 如果块已存在，先删除它
      try {
        await SY块.删除块(blockId);
      } catch (e) {
        console.warn("删除旧临时块失败:", e);
      }
    }

    // 插入新的临时块
    try {
      await SY块.插入后置子块({
        parentID: docId,
        dataType: "markdown",
        data: superblockKramdown,
      });

      // 等待一小段时间确保块被完全处理
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.error("插入临时块失败:", e);
      throw new Error("插入临时块失败: " + (e as Error).message);
    }

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
    try {
      new Protyle(this.app, pe, {
        blockId: blockId,
        mode: "wysiwyg",
        rootId: docId,
      });
    } catch (e) {
      console.error("初始化Protyle失败:", e);
      throw new Error("初始化Protyle失败: " + (e as Error).message);
    }

    this.protyleElement = pe;

    return {
      element: pe,
      blockId: blockId,
    };
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
    this.previewElement = null;
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
