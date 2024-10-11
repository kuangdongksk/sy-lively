import { fetchPost } from "siyuan";

export function 系统推送错误消息(options: { msg: string; timeout: number }) {
  fetchPost("/api/notification/pushErrMsg", options);
}

export function 系统推送消息(options: { msg: string; timeout: number }) {
  fetchPost("/api/notification/pushMsg", options);
}

