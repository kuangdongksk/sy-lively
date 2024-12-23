import $ from "cash-dom";
import { nanoid } from "nanoid";
import { Dialog } from "siyuan";
import Form from "../表单";
import SYFormItem from "../表单/表单项";

export interface IResult {
  success: boolean;
  message: string;
}

export default class DiaForm<TFormValue> {
  dialog: Dialog;

  constructor(props: {
    dialogConfig: { title: string; width: string; height: string };
    formItems: SYFormItem[];
    onConfirm?: (formValue: TFormValue) => IResult | Promise<IResult>;
    onCancel?: () => void | Promise<void>;
  }) {
    const { dialogConfig, formItems, onConfirm, onCancel } = props;

    const form = new Form<TFormValue>(
      formItems,
      async (formValue) => {
        const result = await onConfirm?.(formValue);
        if (result.success) {
          this.dialog.destroy();
        }

        return result;
      },
      async () => {
        await onCancel?.();
        this.dialog.destroy();
      }
    );
    const $formWrapper = form.$form;

    const formId = nanoid();

    this.dialog = new Dialog({
      ...dialogConfig,
      content: `<div id="${formId}"></div>`,
    });

    $(`#${formId}`).append($formWrapper);
  }
}
