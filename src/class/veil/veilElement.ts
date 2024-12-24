import { MD5 } from "@/constant/三方库";
import DiaForm from "@/基础组件/弹出表单";
import SYFormItem from "@/基础组件/表单/表单项";
import SYInput from "@/基础组件/输入";
import $, { Cash } from "cash-dom";

export type TVeilTargetType = "目录" | "页签" | "内容区" | "块";
export const veilZIndex = 5;
export const blur = "blur(5px)";

export default class VeilElement {
  private veil = document.createElement("div");
  private $veil = $(this.veil);

  constructor(
    $parent: Cash,
    id: string,
    passwordHash: string,
    targetType: TVeilTargetType
  ) {
    $parent.css("position", "relative");

    this.$veil.css({
      backdropFilter: blur,
      filter: blur,
      zIndex: "1",
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      cursor: "not-allowed",
    } as any);
    this.$veil.data("veilId", id);
    this.$veil.data("passwordHash", passwordHash);
    this.$veil.data("veilType", targetType);

    $parent.append(this.$veil);

    // this.$veil.on("click", (e) => this.unlock());
    this.$veil.on("mouseup", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.unlock(passwordHash);
    });
  }

  unlock(passwordHash: string) {
    new DiaForm<{
      pwd: string;
    }>({
      dialogConfig: {
        title: "输入密码",
        width: "400px",
        height: "200px",
      },
      formItems: [
        new SYFormItem({
          label: "密码",
          input: new SYInput({
            type: "password",
            name: "pwd",
            placeholder: "请输入密码",
          }),
        }),
      ],
      onConfirm: async (formValue) => {
        if (MD5.b64(formValue.pwd) === passwordHash) {
          this.$veil.remove();
          return {
            success: true,
            message: "密码正确",
          };
        } else {
          return {
            success: false,
            message: "密码错误",
          };
        }
      },
    });
  }
}
