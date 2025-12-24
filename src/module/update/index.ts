import SYFile from "@/class/思源/file";
import { EStoreKey } from "@/constant/系统码";
import { Dialog } from "siyuan";

export default class UpdateNotice {
  private latestVersion: string = "P0.2.6";

  private EUpdateType = {
    功能: "功能",
    优化: "优化",
    修复: "修复",
    移除: "移除",
  };

  async showUpdateNotice() {
    const data = await SYFile.getFile(EStoreKey.currentVersion);
    if (data.currentVersion === this.latestVersion) return;

    new Dialog({
      title: `更新公告：${this.latestVersion}`,
      content: `
      <div style="padding: 12px;">
        <h3>${this.EUpdateType.功能}</h3>
        <ul>
          <li>创建卡片默认在光标所在块的下方</li>
        </ul>
      <div>
      `,
    });

    SYFile.putFile({
      path: EStoreKey.currentVersion,
      file: JSON.stringify({ currentVersion: this.latestVersion }),
      isDir: false,
    });
  }
}
