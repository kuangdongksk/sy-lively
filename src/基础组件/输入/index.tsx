import $, { Cash } from "cash-dom";
import { HTMLInputTypeAttribute } from "react";

export enum E输入类型 {
  默认 = "b3-text-field",
  开关 = "b3-switch",
}

export default class SYInput {
  public dom = document.createElement("input");
  private cash: Cash;

  constructor(props: {
    name: string;
    type: HTMLInputTypeAttribute;
    placeholder: string;
    onInput?: (e: Event) => void;
  }) {
    const { name, type, placeholder, onInput } = props;
    this.cash = $(this.dom);

    this.cash.attr("name", name);
    this.cash.attr("type", type);
    this.cash.attr("placeholder", placeholder);

    this.cash.css({
      width: "100%",
    });
    switch (type) {
      case "checkbox":
        this.cash.addClass(E输入类型.开关);
        this.cash.css({
          width: "unset",
        });
        break;
      default:
        this.cash.addClass(E输入类型.默认);
        break;
    }

    this.cash.on("input", (e) => {
      onInput?.(e);
    });
  }

  get name() {
    return this.cash.attr("name");
  }

  get value() {
    return this.cash.val() as string;
  }
}
