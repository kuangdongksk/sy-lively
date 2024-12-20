import $, { Cash } from "cash-dom";

export enum E按钮类型 {
  默认 = "b3-button",
  文本 = "b3-button b3-button--text",
  轮廓 = "b3-button b3-button--outline",
  取消 = "b3-button b3-button--cancel",
  删除 = "b3-button b3-button--remove",
}

export default class Button {
  public button = document.createElement("button");
  public $button: Cash;

  constructor(type: E按钮类型, text: string, onClick?: () => void) {
    this.$button = $(this.button);
    this.$button.text(text);
    this.$button.addClass(type);

    this.$button.on("click", onClick);
  }
}
