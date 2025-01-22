import SYFile from "@/class/思源/file";
import { EStoreKey } from "@/constant/系统码";
import { Dialog } from "siyuan";

export default class UpdateNotice {
  private latestVersion: string = "P0.2.4-6";

  private EUpdateType = {
    功能: "功能",
    优化: "优化",
    修复: "修复",
    移除: "移除",
  };

  async showUpdateNotice() {
    const data = await SYFile.getFile(EStoreKey.currentVersion);
    if (data === this.latestVersion) return;

    new Dialog({
      title: `更新公告：${this.latestVersion}`,
      content: `
        <h3>${this.EUpdateType.修复}</h3>
        <ul>
          <li>搜索后不能跳转</li>
        </ul>
      `,
    });
  }
}
