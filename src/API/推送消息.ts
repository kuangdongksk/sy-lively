import { EAPI } from "@/constant/API路径";
import { fetchPost } from "siyuan";

export function 系统推送错误消息(options: { msg: string; timeout: number }) {
  fetchPost(EAPI.推送错误消息, options);
}

export function 系统推送消息(options: { msg: string; timeout: number }) {
  fetchPost(EAPI.推送消息, options);
  const 桌面通知 = new Notification("思源-喧嚣", {
    body: options.msg,
    icon: "/favicon.ico",
  });
  桌面通知.onclick = () => {
    window.focus();
  };
}
