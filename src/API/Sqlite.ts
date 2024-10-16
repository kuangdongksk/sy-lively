import { fetchSyncPost, IWebSocketData } from "siyuan";

export function 等待持久化完成(): Promise<IWebSocketData> {
  return fetchSyncPost("/api/eilqst/flushTransaction");
}
