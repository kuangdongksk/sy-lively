import { Setting, showMessage, Dialog } from "siyuan";
import { $ } from "@/constant/三方库";
import { EStoreKey } from "@/constant/系统码";
import { 校验卡片文档是否存在 } from "@/tools/卡片";
import type { IAIProvider, EAPIFormat } from "@/module/aiChat/types";

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 设置管理器
 */
export class SettingManager {
  private getData: (key: string) => Promise<any>;
  private putData: (key: string, value: any) => Promise<boolean>;

  constructor(
    getData: (key: string) => Promise<any>,
    putData: (key: string, value: any) => Promise<boolean>,
  ) {
    this.getData = getData;
    this.putData = putData;
  }

  /**
   * 初始化设置面板
   * @returns 配置好的Setting对象
   */
  init(): Setting {
    const setting = new Setting({
      height: "400px",
      width: "600px",
      destroyCallback: () => {
        showMessage("设置面板已关闭", 2000, "info");
      },
      confirmCallback: () => {
        showMessage("设置已保存", 2000, "info");
      },
    });

    // 添加卡片文档ID设置项
    setting.addItem({
      title: "卡片文档ID",
      description: "手动输入卡片文档ID",
      direction: "row",
      createActionElement: () => {
        const inputElement = document.createElement("input");
        inputElement.className = "b3-text-field";
        inputElement.style.flex = "1";
        inputElement.placeholder = "请输入卡片文档ID";
        let savedId = "";

        // 加载已保存的卡片文档ID
        this.getData(EStoreKey.卡片文档ID).then(async (CardId: string) => {
          savedId = CardId;
          if (CardId) {
            // 验证已保存的文档是否仍然存在
            const 是否存在 = await 校验卡片文档是否存在(CardId);
            if (是否存在) {
              inputElement.value = CardId;
            } else {
              // 文档已不存在，清除无效的ID
              await this.putData(EStoreKey.卡片文档ID, "");
              showMessage("之前保存的卡片文档已不存在，设置已清除", 3000, "info");
            }
          }
        });

        // 监听输入变化并保存
        inputElement.addEventListener("blur", async () => {
          const value = inputElement.value.trim();

          // 验证值是否变化
          if (value === savedId) {
            return;
          }

          if (value) {
            // 验证文档是否存在
            const 是否存在 = await 校验卡片文档是否存在(value);
            if (是否存在) {
              await this.putData(EStoreKey.卡片文档ID, value);
              showMessage("卡片文档ID已保存", 3000, "info");
            } else {
              showMessage("文档不存在，请输入有效的文档ID", 3000, "error");
            }
          } else {
            await this.putData(EStoreKey.卡片文档ID, "");
            showMessage("卡片文档ID已清空", 3000, "info");
          }
        });

        return inputElement;
      },
    });

    // 添加AI提供商设置项
    setting.addItem({
      title: "AI提供商设置",
      description: "配置AI服务提供商",
      direction: "row",
      createActionElement: () => {
        // 保存this上下文，避免在嵌套函数中丢失
        const self = this;

        const container = document.createElement("div");
        container.className = "ai-provider-settings";
        container.style.cssText = `
          width: 100%;
        `;

        // 提供商列表区域
        const listContainer = document.createElement("div");
        listContainer.className = "ai-provider-list";
        listContainer.style.cssText = `
          margin-bottom: 12px;
          max-height: 200px;
          overflow-y: auto;
        `;

        // 按钮区域
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "ai-provider-buttons";
        buttonContainer.style.cssText = ``;

        const addButton = document.createElement("button");
        addButton.className = "b3-button b3-button--outline";
        addButton.textContent = "添加提供商";
        addButton.onclick = () => openProviderDialog();

        buttonContainer.appendChild(addButton);
        container.appendChild(listContainer);
        container.appendChild(buttonContainer);

        // 加载并显示提供商列表
        loadProviders();

        /**
         * 加载提供商列表
         */
        async function loadProviders() {
          try {
            const providers: IAIProvider[] = (await self.getData(EStoreKey.AI提供商)) || [];
            listContainer.innerHTML = "";

            if (providers.length === 0) {
              listContainer.innerHTML =
                '<div style="padding:12px;text-align:center;color:var(--b3-theme-on-surface);">暂无AI提供商</div>';
              return;
            }

            providers.forEach((provider) => {
              const item = createProviderItem(provider);
              listContainer.appendChild(item);
            });
          } catch (e) {
            console.error("加载AI提供商失败:", e);
          }
        }

        /**
         * 创建提供商列表项
         */
        function createProviderItem(provider: IAIProvider): HTMLElement {
          const item = document.createElement("div");
          item.className = "ai-provider-item";
          item.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            margin-bottom: 8px;
            background-color: var(--b3-theme-background);
            border: 1px solid var(--b3-theme-surface);
            border-radius: 4px;
          `;

          const info = document.createElement("div");
          info.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
          `;

          const name = document.createElement("div");
          name.className = "ai-provider-name";
          name.style.cssText = `
            font-weight: 500;
            display: flex;
            align-items: center;
          `;

          name.textContent = provider.name;

          if (provider.isDefault) {
            const badge = document.createElement("span");
            badge.className = "b3-chip";
            badge.textContent = "默认";
            badge.style.cssText = `
              font-size: 10px;
              padding: 2px 6px;
              margin-left: 8px;
              background-color: var(--b3-theme-primary);
              color: var(--b3-theme-primary-on);
              border-radius: 10px;
            `;
            name.appendChild(badge);
          }

          if (!provider.enabled) {
            const disabledBadge = document.createElement("span");
            disabledBadge.className = "b3-chip";
            disabledBadge.textContent = "已禁用";
            disabledBadge.style.cssText = `
              font-size: 10px;
              padding: 2px 6px;
              margin-left: 8px;
              background-color: var(--b3-theme-surface);
              color: var(--b3-theme-on-surface);
              border-radius: 10px;
            `;
            name.appendChild(disabledBadge);
          }

          const details = document.createElement("div");
          details.className = "ai-provider-details";
          details.style.cssText = `
            font-size: 12px;
            color: var(--b3-theme-on-surface);
            margin-top: 4px;
          `;
          details.textContent = `${provider.model} | ${provider.apiFormat}`;

          info.appendChild(name);
          info.appendChild(details);

          const actions = document.createElement("div");
          actions.className = "ai-provider-actions";
          actions.style.cssText = `
            display: flex;
          `;

          const editButton = document.createElement("button");
          editButton.className = "b3-button b3-button--text";
          editButton.textContent = "编辑";
          editButton.style.marginRight = "4px";
          editButton.onclick = () => openProviderDialog(provider);

          const deleteButton = document.createElement("button");
          deleteButton.className = "b3-button b3-button--text";
          deleteButton.textContent = "删除";
          deleteButton.style.color = "var(--b3-theme-on-error)";
          deleteButton.style.marginLeft = "4px";
          deleteButton.onclick = () => deleteProvider(provider.id);

          const setDefaultButton = document.createElement("button");
          setDefaultButton.className = "b3-button b3-button--text";
          setDefaultButton.textContent = "设为默认";
          setDefaultButton.style.marginLeft = "4px";
          setDefaultButton.style.marginRight = "4px";
          setDefaultButton.onclick = () => setDefaultProvider(provider.id);

          actions.appendChild(editButton);
          actions.appendChild(setDefaultButton);
          actions.appendChild(deleteButton);

          item.appendChild(info);
          item.appendChild(actions);

          return item;
        }

        /**
         * 打开提供商编辑对话框
         */
        function openProviderDialog(provider?: IAIProvider) {
          const isEdit = !!provider;

          // 使用SiYuan的Dialog类
          const dialog = new Dialog({
            title: isEdit ? "编辑AI提供商" : "添加AI提供商",
            content: "",
            width: "500px",
            hideCloseIcon: false,
            disableClose: false,
          });

          const $body = $(dialog.element).find(".b3-dialog__body");
          $body.css({
            padding: "16px",
          });

          const form = document.createElement("form");
          form.style.cssText = `
            display: flex;
            flex-direction: column;
          `;

          const formItems = [
            { label: "名称", field: "name", type: "text", placeholder: "例如: OpenAI GPT-4" },
            { label: "API密钥", field: "apiKey", type: "password", placeholder: "sk-..." },
            {
              label: "基础URL",
              field: "baseUrl",
              type: "text",
              placeholder: "https://api.openai.com/v1",
            },
            {
              label: "API格式",
              field: "apiFormat",
              type: "select",
              options: [
                { value: "openai-compatible", label: "OpenAI兼容" },
                { value: "anthropic-native", label: "Anthropic原生" },
              ],
            },
            {
              label: "模型",
              field: "model",
              type: "text",
              placeholder: "gpt-4 或 claude-3-sonnet",
            },
            {
              label: "系统提示词",
              field: "systemPrompt",
              type: "textarea",
              placeholder: "你是一个有帮助的助手...",
            },
          ];

          formItems.forEach((item) => {
            const formItem = document.createElement("div");
            formItem.style.cssText = `
              display: flex;
              flex-direction: column;
              margin-bottom: 16px;
            `;

            const label = document.createElement("label");
            label.textContent = item.label;
            label.style.cssText = `
              font-size: 12px;
              font-weight: 500;
              margin-bottom: 4px;
              display: block;
            `;

            let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            if (item.type === "textarea") {
              input = document.createElement("textarea");
              (input as HTMLTextAreaElement).rows = 3;
            } else if (item.type === "select") {
              input = document.createElement("select");
              item.options!.forEach((opt) => {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.label;
                (input as HTMLSelectElement).appendChild(option);
              });
            } else {
              input = document.createElement("input");
              (input as HTMLInputElement).type = item.type;
            }

            // 设置field属性，用于后续查找
            input.setAttribute("field", item.field);
            input.className = "b3-text-field";

            // Set placeholder for input and textarea only
            if ("placeholder" in item && item.placeholder) {
              if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                input.placeholder = item.placeholder;
              }
            }

            // 设置初始值
            if (provider) {
              (input as any).value = provider[item.field as keyof IAIProvider] || "";
            }

            formItem.appendChild(label);
            formItem.appendChild(input);
            form.appendChild(formItem);
          });

          // 复选框区域
          const checkboxContainer = document.createElement("div");
          checkboxContainer.style.cssText = `
            display: flex;
            margin-bottom: 16px;
          `;

          const enabledLabel = document.createElement("label");
          enabledLabel.style.cssText = `
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-right: 16px;
          `;

          const enabledCheckbox = document.createElement("input");
          enabledCheckbox.type = "checkbox";
          enabledCheckbox.checked = provider?.enabled ?? true;
          enabledCheckbox.id = "provider-enabled";
          enabledCheckbox.style.marginRight = "8px";

          enabledLabel.appendChild(enabledCheckbox);
          enabledLabel.appendChild(document.createTextNode("启用"));

          const streamLabel = document.createElement("label");
          streamLabel.style.cssText = `
            display: flex;
            align-items: center;
            cursor: pointer;
          `;

          const streamCheckbox = document.createElement("input");
          streamCheckbox.type = "checkbox";
          streamCheckbox.checked = provider?.streamResponse ?? false;
          streamCheckbox.id = "provider-stream";
          streamCheckbox.style.marginRight = "8px";

          streamLabel.appendChild(streamCheckbox);
          streamLabel.appendChild(document.createTextNode("流式响应"));

          checkboxContainer.appendChild(enabledLabel);
          checkboxContainer.appendChild(streamLabel);
          form.appendChild(checkboxContainer);

          // 按钮区域
          const buttonGroup = document.createElement("div");
          buttonGroup.style.cssText = `
            display: flex;
            justify-content: flex-end;
            margin-top: 8px;
          `;

          const cancelButton = document.createElement("button");
          cancelButton.className = "b3-button";
          cancelButton.textContent = "取消";
          cancelButton.style.marginRight = "8px";
          cancelButton.onclick = () => {
            dialog.destroy();
          };

          const saveButton = document.createElement("button");
          saveButton.className = "b3-button b3-button--primary";
          saveButton.textContent = "保存";
          saveButton.type = "submit";
          saveButton.onclick = (e) => {
            e.preventDefault();
            saveProvider();
          };

          buttonGroup.appendChild(cancelButton);
          buttonGroup.appendChild(saveButton);
          form.appendChild(buttonGroup);

          $body.append(form);

          async function saveProvider() {
            try {
              const newProvider: IAIProvider = {
                id: provider?.id || generateId(),
                name: (form.querySelector('[field="name"]') as HTMLInputElement)?.value || "",
                apiKey: (form.querySelector('[field="apiKey"]') as HTMLInputElement)?.value || "",
                baseUrl: (form.querySelector('[field="baseUrl"]') as HTMLInputElement)?.value || "",
                apiFormat: (form.querySelector('[field="apiFormat"]') as HTMLSelectElement)?.value as EAPIFormat,
                model: (form.querySelector('[field="model"]') as HTMLInputElement)?.value || "",
                systemPrompt: (form.querySelector('[field="systemPrompt"]') as HTMLTextAreaElement)?.value || "",
                enabled: enabledCheckbox.checked,
                isDefault: provider?.isDefault || false,
                streamResponse: streamCheckbox.checked,
              };

              let providers: IAIProvider[] = (await self.getData(EStoreKey.AI提供商)) || [];

              if (isEdit) {
                const index = providers.findIndex((p) => p.id === provider!.id);
                if (index !== -1) {
                  providers[index] = newProvider;
                }
              } else {
                providers.push(newProvider);
              }

              await self.putData(EStoreKey.AI提供商, providers);

              showMessage(isEdit ? "提供商已更新" : "提供商已添加", 3000, "info");
              dialog.destroy();
              loadProviders();
            } catch (e) {
              showMessage("保存失败: " + (e as Error).message, 3000, "error");
            }
          }
        }

        /**
         * 删除提供商
         */
        async function deleteProvider(id: string) {
          if (!confirm("确定要删除此提供商吗？")) {
            return;
          }

          try {
            let providers: IAIProvider[] = (await self.getData(EStoreKey.AI提供商)) || [];
            providers = providers.filter((p) => p.id !== id);
            await self.putData(EStoreKey.AI提供商, providers);
            showMessage("提供商已删除", 3000, "info");
            loadProviders();
          } catch (e) {
            showMessage("删除失败: " + (e as Error).message, 3000, "error");
          }
        }

        /**
         * 设置默认提供商
         */
        async function setDefaultProvider(id: string) {
          try {
            let providers: IAIProvider[] = (await self.getData(EStoreKey.AI提供商)) || [];
            providers = providers.map((p) => ({
              ...p,
              isDefault: p.id === id,
            }));
            await self.putData(EStoreKey.AI提供商, providers);
            await self.putData(EStoreKey.AI默认提供商, id);
            showMessage("已设置默认提供商", 3000, "info");
            loadProviders();
          } catch (e) {
            showMessage("设置失败: " + (e as Error).message, 3000, "error");
          }
        }

        return container;
      },
    });

    // 添加其他设置项（可以根据需要扩展）
    setting.addItem({
      title: "设置说明",
      description: "设置实时保存，立即生效。输入文档ID后请按Tab键或点击其他地方保存。",
      direction: "column",
    });

    return setting;
  }
}
