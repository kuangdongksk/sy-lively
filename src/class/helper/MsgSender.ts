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
}
