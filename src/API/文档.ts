import { EAPI } from "@/constant/API路径";
import { fetchSyncPost } from "siyuan";

export function 通过Markdown创建文档(
  笔记本ID: string,
  文档路径: string,
  markdown: string
) {
  return fetchSyncPost(EAPI.通过Markdown创建文档, {
    notebook: 笔记本ID,
    path: 文档路径,
    markdown,
  });
}
