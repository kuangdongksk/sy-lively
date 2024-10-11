import { EAPI } from "@/constant/API路径";
import { fetchSyncPost } from "siyuan";

export function 列出笔记本() {
  return fetchSyncPost(EAPI.列出笔记本);
}

export function 获取笔记本配置(笔记本ID: string) {
  return fetchSyncPost(EAPI.获取笔记本配置, {
    notebook: 笔记本ID,
  });
}
