import $ from "cash-dom";
import { KeyboardEvent } from "react";
import { IResult } from "../弹出表单";
import SYFooter from "./Footer";
import SYFormItem from "./表单项";

export default class SYForm<TFormValue> {
  footer: SYFooter;
  form = document.createElement("form");
  formItems: SYFormItem[];
  $error = $(document.createElement("div"));
  $form = $(this.form);

  constructor(props: {
    formItems: SYFormItem[];
    labelWidth?: number;
    onConfirm?: (
      formValue: TFormValue
    ) => IResult | void | Promise<IResult | void>;
    onCancel?: () => void | Promise<void>;
  }) {
    const { formItems, labelWidth, onConfirm, onCancel } = props;

    this.formItems = formItems;
    this.$form.css({
      padding: "12px",
    });
    this.$error.css({
      width: "100%",
      color: "red",
      textAlign: "center",
    });

    this.initFooter(onConfirm, onCancel);
    formItems.forEach((item) => {
      labelWidth && item.label.css({ width: `${labelWidth}px` });
      this.$form.append(item.itemWrapper);
    });
    this.$form.append(this.$error);
    this.$form.append(this.footer.$footer);
    this.initEvent();
  }

  initEvent() {
    this.$form.on("keydown", (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        if (e.target === this.formItems[this.formItems.length - 1].input.dom) {
          this.footer.$confirmBtn.trigger("click");
        }
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  initFooter(
    onConfirm: (
      formValue: TFormValue
    ) => IResult | void | Promise<IResult | void>,
    onCancel: () => void | Promise<void>
  ) {
    this.footer = new SYFooter(onCancel, async () => {
      const result = await onConfirm?.(this.formValues);
      if (result && !result.success) {
        this.$error.text(result.message);
      }
    });
  }

  get formValues(): TFormValue {
    let formValues = {};
    this.formItems.forEach((item) => {
      formValues = {
        ...formValues,
        [item.name]: item.value,
      };
    });

    return formValues as TFormValue;
  }
}
