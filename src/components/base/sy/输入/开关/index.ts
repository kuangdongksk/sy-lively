import $, { Cash } from "cash-dom";
import { E输入类型 } from "..";

export default class SYSwitch {
  public dom = document.createElement("input");
  private cash: Cash;
  private _value: boolean = false;

  constructor(props: {
    name: string;
    placeholder: string;
    defaultValue?: boolean;
    disabled?: boolean;
    onClick?: (e: Event) => void;
  }) {
    const { name, placeholder, defaultValue, disabled, onClick } = props;
    this.cash = $(this.dom);

    this.cash.attr("name", name);
    this.cash.attr("type", "checkbox");
    this.cash.attr("aria-label", placeholder);

    disabled && this.cash.attr("disabled", String(Boolean(disabled)));
    if (defaultValue) {
      this.cash.attr("checked", String(Boolean(defaultValue)));
      this._value = true;
    }

    this.cash.addClass(E输入类型.开关);

    this.cash.on("click", (e) => {
      this._value = e.target.checked;
      onClick?.(e);
    });
  }

  get name() {
    return this.cash.attr("name");
  }

  get value() {
    return this._value;
  }
}
