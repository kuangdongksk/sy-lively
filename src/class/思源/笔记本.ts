import { EAPI } from "@/constant/API路径";
import { fetchSyncPost } from "siyuan";

export class SY笔记本 {
  public static 列出笔记本() {
    return fetchSyncPost(EAPI.列出笔记本);
  }

  public static 获取笔记本配置(笔记本ID: string): Promise<{
    data: {
      conf: {
        dailyNoteSavePath: string;
      };
    };
  }> {
    return fetchSyncPost(EAPI.获取笔记本配置, {
      notebook: 笔记本ID,
    });
  }
}
