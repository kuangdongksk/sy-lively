import { EAPI } from "@/constant/API路径";
import { fetchSyncPost } from "siyuan";

export function 获取文件(文件路径: string) {
  return fetchSyncPost(EAPI.获取文件, {
    path: 文件路径,
  });
}
