import { Setting, showMessage } from "siyuan";
import { EStoreKey } from "@/constant/系统码";
import { 校验卡片文档是否存在 } from "@/tools/卡片";

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

    // 添加其他设置项（可以根据需要扩展）
    setting.addItem({
      title: "设置说明",
      description: "设置实时保存，立即生效。输入文档ID后请按Tab键或点击其他地方保存。",
      direction: "column",
    });

    return setting;
  }
}
