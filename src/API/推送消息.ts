import { EAPI } from "@/constant/API路径";
import { fetchPost } from "siyuan";

export function 系统推送错误消息(options: { msg: string; timeout: number }) {
  fetchPost(EAPI.推送错误消息, options);
}

export function 系统推送消息(options: { msg: string; timeout: number }) {
  fetchPost(EAPI.推送消息, options);
}
