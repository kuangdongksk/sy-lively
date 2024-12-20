import { E持久化键 } from "@/constant/系统码";
import { PluginId } from "@/index";
import Button, { E按钮类型 } from "@/基础组件/按钮";
import Input from "@/基础组件/输入";
import $, { Cash } from "cash-dom";
import { Dialog, IEventBusMap } from "siyuan";
import VeilElement from "./veilElement";
import { nanoid } from "nanoid";

export default class Veil {
  private loadData: (key: E持久化键.上锁的笔记) => Promise<any>;
  private saveData: (key: E持久化键.上锁的笔记, value: any) => Promise<boolean>;
  private lockedNotes: Map<string, string>;

  constructor(
    loadData: (key: E持久化键.上锁的笔记) => Promise<any>,
    saveData: (key: E持久化键.上锁的笔记, value: any) => Promise<boolean>
  ) {
    this.loadData = loadData;
    this.saveData = saveData;
  }

  public async onPlugLoad() {
    this.lockedNotes = (await this.loadData(E持久化键.上锁的笔记)) || new Map();
  }

  public async onPlugLayoutReady() {}

  public onOpenMenuDoctree(
    event: CustomEvent<IEventBusMap["open-menu-doctree"]>
  ) {
    const { elements, menu, type } = event.detail;
    const $element = $(elements[0]);
    const noteBookID = $element.parent().data("url");
    const docID = $element.data("nodeId");

    const currentID = noteBookID || docID;

    const subMenu = this.lockedNotes.has(currentID)
      ? {
          label: "移除密码",
          click: () => {},
        }
      : {
          label: "添加密码",
          click: () => {
            this.addPassword($element, currentID);
          },
        };

    menu.addItem({
      id: PluginId + "-访问控制",
      label: "喧嚣-访问控制",
      submenu: [subMenu],
    });
  }

  private addPassword($element: Cash, noteId: string) {
    const pwd = new Input("password", "密码");
    const pwdc = new Input("password", "确认密码");
    const cbtn = new Button(E按钮类型.默认, "确认");

    const formDiv = document.createElement("div");
    formDiv.appendChild(pwd.input);
    formDiv.appendChild(pwdc.input);
    formDiv.appendChild(cbtn.button);

    const formId = nanoid();

    const form = new Dialog({
      title: "添加密码",
      width: "800px",
      height: "600px",
      content: `<div id="${formId}"></div>`,
    });
    $(`#${formId}`).append(formDiv);

    cbtn.$button.on("click", async () => {
      console.log(pwd.value, pwdc.value);
      if (pwd.value !== pwdc.value) {
        alert("两次密码不一致");
        return;
      }
      this.lockedNotes.set(noteId, pwd.value);
      await this.saveData(E持久化键.上锁的笔记, this.lockedNotes);

      new VeilElement($element.parent(), noteId, "目录");
      form.destroy();
    });
  }
}
