import { EStoreKey } from "@/constant/系统码";
import type { IAIProvider } from "./types";
import { createProviderClient } from "./providers";

/**
 * AI提供商服务
 * 管理AI提供商的加载、保存、切换和调用
 */
export class AIProviderService {
  private providers: IAIProvider[] = [];
  private currentProviderId: string | null = null;

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
    await this.loadProviders();
    await this.loadDefaultProvider();
  }

  /**
   * 加载提供商列表
   */
  private async loadProviders(): Promise<void> {
    try {
      const data = await this.getData(EStoreKey.AI提供商);
      this.providers = data || [];
    } catch (e) {
      console.error("加载AI提供商失败:", e);
      this.providers = [];
    }
  }

  /**
   * 加载默认提供商
   */
  private async loadDefaultProvider(): Promise<void> {
    try {
      const defaultId = await this.getData(EStoreKey.AI默认提供商);
      if (defaultId && this.providers.some((p) => p.id === defaultId)) {
        this.currentProviderId = defaultId;
      } else if (this.providers.length > 0) {
        // 如果没有设置默认提供商，使用第一个启用的提供商
        const firstEnabled = this.providers.find((p) => p.enabled);
        if (firstEnabled) {
          this.currentProviderId = firstEnabled.id;
        }
      }
    } catch (e) {
      console.error("加载默认AI提供商失败:", e);
    }
  }

  /**
   * 保存提供商列表
   */
  private async saveProviders(): Promise<boolean> {
    try {
      return await this.putData(EStoreKey.AI提供商, this.providers);
    } catch (e) {
      console.error("保存AI提供商失败:", e);
      return false;
    }
  }

  /**
   * 获取所有提供商
   */
  getProviders(): IAIProvider[] {
    return [...this.providers];
  }

  /**
   * 获取启用的提供商
   */
  getEnabledProviders(): IAIProvider[] {
    return this.providers.filter((p) => p.enabled);
  }

  /**
   * 根据ID获取提供商
   */
  getProvider(id: string): IAIProvider | undefined {
    return this.providers.find((p) => p.id === id);
  }

  /**
   * 获取当前提供商
   */
  getCurrentProvider(): IAIProvider | undefined {
    if (!this.currentProviderId) {
      return undefined;
    }
    return this.getProvider(this.currentProviderId);
  }

  /**
   * 设置当前提供商
   */
  setCurrentProvider(id: string): void {
    const provider = this.getProvider(id);
    if (provider && provider.enabled) {
      this.currentProviderId = id;
    } else {
      throw new Error("提供商不存在或未启用");
    }
  }

  /**
   * 添加提供商
   */
  async addProvider(provider: IAIProvider): Promise<boolean> {
    // 检查ID是否已存在
    if (this.providers.some((p) => p.id === provider.id)) {
      throw new Error("提供商ID已存在");
    }

    this.providers.push(provider);

    // 如果是第一个提供商或者是默认提供商，设置为当前提供商
    if (this.providers.length === 1 || provider.isDefault) {
      this.currentProviderId = provider.id;
      await this.putData(EStoreKey.AI默认提供商, provider.id);
    }

    return await this.saveProviders();
  }

  /**
   * 更新提供商
   */
  async updateProvider(
    id: string,
    updates: Partial<Omit<IAIProvider, "id">>
  ): Promise<boolean> {
    const index = this.providers.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("提供商不存在");
    }

    // 更新提供商
    this.providers[index] = {
      ...this.providers[index],
      ...updates,
    };

    // 如果设置为默认提供商，更新默认提供商
    if (updates.isDefault) {
      // 取消其他提供商的默认状态
      this.providers.forEach((p) => {
        if (p.id !== id) {
          p.isDefault = false;
        }
      });
      this.currentProviderId = id;
      await this.putData(EStoreKey.AI默认提供商, id);
    }

    return await this.saveProviders();
  }

  /**
   * 删除提供商
   */
  async removeProvider(id: string): Promise<boolean> {
    const index = this.providers.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("提供商不存在");
    }

    this.providers.splice(index, 1);

    // 如果删除的是当前提供商，重新选择当前提供商
    if (this.currentProviderId === id) {
      const firstEnabled = this.providers.find((p) => p.enabled);
      if (firstEnabled) {
        this.currentProviderId = firstEnabled.id;
      } else {
        this.currentProviderId = null;
      }
    }

    return await this.saveProviders();
  }

  /**
   * 发送聊天请求
   */
  async chat(
    prompt: string,
    context: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const provider = this.getCurrentProvider();
    if (!provider) {
      throw new Error("没有可用的AI提供商");
    }

    const client = createProviderClient(provider);

    return await client.chat(
      provider.systemPrompt,
      prompt,
      context,
      provider.streamResponse,
      onChunk
    );
  }
}
