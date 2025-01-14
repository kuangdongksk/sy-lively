import { $ } from "@/constant/三方库";
import { EBtnClass } from "../按钮";

export default class SYFooter {
  cancelBtn: HTMLButtonElement = document.createElement("button");
  confirmBtn: HTMLButtonElement = document.createElement("button");
  footer = document.createElement("div");
  $cancelBtn = $(this.cancelBtn);
  $confirmBtn = $(this.confirmBtn);
  $footer = $(this.footer);

  constructor(
    onCancel: () => void | Promise<void>,
    onConfirm: () => void | Promise<void>
  ) {
    this.$footer.css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });

    this.$cancelBtn.text("取消");
    this.$cancelBtn.css({
      marginRight: "12px",
    });
    this.$cancelBtn.addClass(EBtnClass.取消);
    this.$cancelBtn.on("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await onCancel?.();
    });

    const $confirmBtn = this.$confirmBtn;
    $confirmBtn.text("确认");
    $confirmBtn.on("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await onConfirm?.();
    });
    $confirmBtn.addClass(EBtnClass.默认);

    this.$footer.append(this.$cancelBtn);
    this.$footer.append(this.$confirmBtn);
  }
}
