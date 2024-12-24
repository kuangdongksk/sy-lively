import $ from "cash-dom";
import { E按钮类型 } from "../按钮";
import SYFormItem from "./表单项";
import { IResult } from "../弹出表单";

export default class SYForm<TFormValue> {
  form = document.createElement("form");
  $form = $(this.form);
  formItems: SYFormItem[];
  $error = $(document.createElement("div"));

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

    const $footer = this.initFooter(onConfirm, onCancel);
    formItems.forEach((item) => {
      labelWidth && item.label.css({ width: `${labelWidth}px` });
      this.$form.append(item.itemWrapper);
    });
    this.$form.append($footer);
    this.$form.append(this.$error);
  }

  initFooter(
    onConfirm: (
      formValue: TFormValue
    ) => IResult | void | Promise<IResult | void>,
    onCancel: () => void | Promise<void>
  ) {
    const $footer = $(document.createElement("div"));
    $footer.css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });

    const $cancelBtn = $(document.createElement("button"));
    $cancelBtn.text("取消");
    $cancelBtn.css({
      marginRight: "12px",
    });
    $cancelBtn.addClass(E按钮类型.取消);
    $cancelBtn.on("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await onCancel?.();
    });

    const $confirmBtn = $(document.createElement("button"));
    $confirmBtn.text("确认");
    $confirmBtn.on("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const result = await onConfirm?.(this.formValues);
      if (result && !result.success) {
        this.$error.text(result.message);
      }
    });
    $confirmBtn.addClass(E按钮类型.默认);
    $footer.append($cancelBtn);
    $footer.append($confirmBtn);

    return $footer;
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
