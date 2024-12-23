import { MD5 } from "@/constant/三方库";
import { E持久化键 } from "@/constant/系统码";
import { PluginId } from "@/index";
import Button, { E按钮类型 } from "@/基础组件/按钮";
import SYInput from "@/基础组件/输入";
import $, { Cash } from "cash-dom";
import { nanoid } from "nanoid";
import { Dialog, IEventBusMap } from "siyuan";
import VeilElement, { TVeilTargetType } from "./veilElement";

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
    this.lockedNotes = new Map(
      Object.entries((await this.loadData(E持久化键.上锁的笔记)) || {})
    );
  }

  public async onPlugLayoutReady() {
    this.lockMenu();
  }

  public onOpenMenuDoctree(
    event: CustomEvent<IEventBusMap["open-menu-doctree"]>
  ) {
    const { elements, menu, type } = event.detail;
    const $element = $(elements[0]);
    const noteBookID = $element.parent().data("url");
    const docID = $element.data("nodeId");

    const currentID = noteBookID || docID;
    const subMenu = this.lockedNotes.has(currentID)
      ? [
          {
            label: "锁定目录",
            click: () => {
              this.addVeil($element, currentID, "目录");
            },
          },
          {
            label: "锁定目录及内容区",
            click: () => {
              this.addVeil($element, currentID, "目录");
            },
          },
          {
            label: "移除密码",
            click: () => {
              this.lockedNotes.delete(currentID);
              this.saveData(E持久化键.上锁的笔记, this.lockedNotes);
            },
          },
        ]
      : [
          {
            label: "添加密码",
            click: () => {
              this.addPassword($element, currentID);
            },
          },
        ];

    menu.addItem({
      id: PluginId + "-访问控制",
      label: "喧嚣-访问控制",
      submenu: subMenu,
    });
  }

  private async addVeil($element: Cash, noteId: string, type: TVeilTargetType) {
    const pwd = this.lockedNotes.get(noteId);
    if (!pwd) return;

    new VeilElement($element, noteId, MD5.b64(pwd), type);
  }

  private addPassword($element: Cash, noteId: string) {
    const pwd = new SYInput("pwd", "password", "密码");
    const pwdc = new SYInput("pwdC", "password", "确认密码");
    const cbtn = new Button(E按钮类型.默认, "确认");

    const formDiv = document.createElement("div");
    formDiv.appendChild(pwd.dom);
    formDiv.appendChild(pwdc.dom);
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
      if (pwd.value !== pwdc.value) {
        alert("两次密码不一致");
        return;
      }
      this.lockedNotes.set(noteId, pwd.value);

      await this.saveData(
        E持久化键.上锁的笔记,
        Object.fromEntries(this.lockedNotes.entries())
      );

      new VeilElement($element, noteId, MD5.b64(pwd.value), "目录");
      form.destroy();
    });
  }

  private async hasLock(noteId: string) {
    return this.lockedNotes.has(noteId);
  }

  private lockMenu() {
    const 打开的笔记本 = $("ul.b3-list[data-url]");
    const 关闭的笔记本 = $(
      "li.b3-list-item.b3-list-item--hide-action[data-type='open']"
    );

    const 所有的笔记本 = 打开的笔记本.add(关闭的笔记本);
    所有的笔记本.each(async (_index, notebook) => {
      const dataId = notebook.dataset.url;

      if (!this.hasLock(dataId)) return;

      this.addVeil($(notebook), dataId, "目录");
    });
  }
}
