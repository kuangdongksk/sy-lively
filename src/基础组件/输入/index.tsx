import $, { Cash } from "cash-dom";
import { HTMLInputTypeAttribute } from "react";

export enum E输入类型 {
  默认 = "b3-text-field",
}

export default class SYInput {
  public dom = document.createElement("input");
  private cash: Cash;

  constructor(name: string, type: HTMLInputTypeAttribute, placeholder: string) {
    this.cash = $(this.dom);

    this.cash.attr("name", name);
    this.cash.attr("type", type);
    this.cash.attr("placeholder", placeholder);
    this.cash.addClass(E输入类型.默认);

    this.cash.on("input", (e) => {
      console.log(
        "🚀 ~ Input ~ this.$input.on ~ e.target.value:",
        e.target.value
      );
    });
  }

  get name() {
    return this.cash.attr("name");
  }

  get value() {
    return this.cash.val() as string;
  }
}
