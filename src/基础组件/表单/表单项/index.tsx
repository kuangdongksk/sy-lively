import $, { Cash } from "cash-dom";

export interface TInput {
  dom: HTMLElement;
  name: string;
  value: any;
}

export default class SYFormItem {
  input: TInput;
  inputWrapper = $(document.createElement("div"));
  itemWrapper = $(document.createElement("div"));
  label = $(document.createElement("span"));

  constructor(label: string, input: TInput) {
    this.input = input;
    this.itemWrapper.css({
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    });

    this.label.text(label);
    this.label.css({
      width: "60px",
      marginRight: "12px",
    });

    if (input instanceof Cash) {
      this.inputWrapper.append(input);
    } else {
      this.inputWrapper.append(input.dom);
    }
    this.inputWrapper.css({
      flex: 1,
    });

    this.itemWrapper.append(this.label);
    this.itemWrapper.append(this.inputWrapper);
  }

  get name() {
    return this.input.name;
  }

  get value() {
    return this.input.value;
  }
}
