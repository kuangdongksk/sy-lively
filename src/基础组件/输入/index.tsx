import $, { Cash } from "cash-dom";
import { HTMLInputTypeAttribute } from "react";

export enum E输入类型 {
  默认 = "b3-text-field",
}

export default class Input {
  public value = "";
  public input = document.createElement("input");
  private $input: Cash;

  constructor(type: HTMLInputTypeAttribute, placeholder: string) {
    this.$input = $(this.input);
    this.$input.attr("type", type);
    this.$input.attr("placeholder", placeholder);
    this.$input.addClass(E输入类型.默认);

    this.$input.on("input", (e) => {
      this.value = e.target.value;
      console.log("🚀 ~ Input ~ this.$input.on ~ e.target.value:", e.target.value)
    });
  }
}
