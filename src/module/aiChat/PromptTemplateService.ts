import { EStoreKey } from "@/constant/系统码";
import type { IPromptTemplate } from "./types";

/**
 * 提示词模板服务
 * 管理AI聊天提示词模板的CRUD操作
 */
export class PromptTemplateService {
  private templates: IPromptTemplate[] = [];

  private getData: (key: string) => Promise<any>;
  private putData: (key: string, value: any) => Promise<boolean>;

  constructor(config: {
    getData: (key: string) => Promise<any>;
    putData: (key: string, value: any) => Promise<boolean>;
  }) {
    this.getData = config.getData;
    this.putData = config.putData;
  }

  /**
   * 初始化服务
   */
  async init(): Promise<void> {
    await this.loadTemplates();
  }

  /**
   * 加载提示词模板
   */
  private async loadTemplates(): Promise<void> {
    try {
      const data = await this.getData(EStoreKey.AI提示词模板);
      this.templates = data || [];
    } catch (e) {
      console.error("加载AI提示词模板失败:", e);
      this.templates = [];
    }
  }

  /**
   * 保存提示词模板
   */
  private async saveTemplates(): Promise<boolean> {
    try {
      return await this.putData(EStoreKey.AI提示词模板, this.templates);
    } catch (e) {
      console.error("保存AI提示词模板失败:", e);
      return false;
    }
  }

  /**
   * 获取所有模板
   */
  getTemplates(): IPromptTemplate[] {
    return [...this.templates].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * 获取快捷模板（isShortcut=true）
   */
  getShortcutTemplates(): IPromptTemplate[] {
    return this.getTemplates().filter((t) => t.isShortcut);
  }

  /**
   * 根据ID获取模板
   */
  getTemplate(id: string): IPromptTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  /**
   * 添加模板
   */
  async addTemplate(template: Omit<IPromptTemplate, "id">): Promise<boolean> {
    const newTemplate: IPromptTemplate = {
      ...template,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    this.templates.push(newTemplate);
    return await this.saveTemplates();
  }

  /**
   * 更新模板
   */
  async updateTemplate(
    id: string,
    updates: Partial<Omit<IPromptTemplate, "id">>
  ): Promise<boolean> {
    const index = this.templates.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("模板不存在");
    }

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
    };

    return await this.saveTemplates();
  }

  /**
   * 删除模板
   */
  async deleteTemplate(id: string): Promise<boolean> {
    const index = this.templates.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("模板不存在");
    }

    this.templates.splice(index, 1);
    return await this.saveTemplates();
  }

  /**
   * 获取默认模板
   */
  getDefaultTemplates(): IPromptTemplate[] {
    return [
      {
        id: "default-1",
        name: "总结内容",
        content: "请用简洁的语言总结以下内容的要点",
        isShortcut: true,
        order: 1,
      },
      {
        id: "default-2",
        name: "翻译成中文",
        content: "请将以下内容翻译成中文",
        isShortcut: true,
        order: 2,
      },
      {
        id: "default-3",
        name: "翻译成英文",
        content: "Please translate the following content into English",
        isShortcut: true,
        order: 3,
      },
      {
        id: "default-4",
        name: "优化润色",
        content: "请优化和润色以下内容，使其更加流畅、专业和易读",
        isShortcut: true,
        order: 4,
      },
      {
        id: "default-5",
        name: "扩展写作",
        content: "请基于以下内容进行扩展写作，添加更多细节和例子",
        isShortcut: false,
        order: 5,
      },
    ];
  }

  /**
   * 初始化默认模板（如果没有模板）
   */
  async initDefaultTemplates(): Promise<void> {
    const existing = await this.getData(EStoreKey.AI提示词模板);
    if (!existing || existing.length === 0) {
      this.templates = this.getDefaultTemplates();
      await this.saveTemplates();
    }
  }
}
