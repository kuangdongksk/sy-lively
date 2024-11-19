import { EAPI } from "@/constant/API路径";
import { fetchSyncPost } from "siyuan";

export async function 异步请求(
  API: EAPI,
  options: any
): Promise<{
  success: boolean;
  data: any;
}> {
  const 结果 = await fetchSyncPost(API, options);

  return {
    success: 结果.code === 0,
    data: 结果.data,
  };
}
