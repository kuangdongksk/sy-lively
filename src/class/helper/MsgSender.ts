import { EAPI } from "@/constant/API路径";
import { fetchPost } from "siyuan";

export default class MsgSender {
  static desktopMsg(params: { msg: string; onClick?: () => void }) {
    const { msg, onClick } = params;
    const notification = new Notification("思源-喧嚣", {
      body: msg,
      icon: "/favicon.ico",
    });
    notification.onclick = () => {
      window.focus();
      onClick?.();
    };
  }

  static sySendError(options: { msg: string; timeout: number }) {
    fetchPost(EAPI.推送错误消息, options);
  }

  static sySendMsg(options: { msg: string; timeout: number }) {
    fetchPost(EAPI.推送消息, options);
  }
}
