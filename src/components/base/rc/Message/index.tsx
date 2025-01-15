import { $ } from "@/constant/三方库";

function showMessage(
  type: "success" | "error" | "warning" | "info" | "loading",
  msg: string
) {
  const $message = $(document.createElement("div"));
  $message.text(msg);
  $message.css({
    display: "inline-block",
    padding: "9px 12px",
    background: "var(--b3-theme-surface)",
    borderRadius: "8px",
    boxShadow:
      "0 6px 16px 0 rgba(0, 0, 0, 0.08),0 3px 6px -4px rgba(0, 0, 0, 0.12),0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    pointerEvents: "all",
  });
  document.body.appendChild($message[0]);

  setTimeout(() => {
    $message.remove();
  }, 3000);
}

export const message = {
  success: (msg: string) => showMessage("success", msg),
  error: (msg: string) => showMessage("error", msg),
  warning: (msg: string) => showMessage("warning", msg),
  info: (msg: string) => showMessage("info", msg),
  loading: (msg: string) => showMessage("loading", msg),
};
