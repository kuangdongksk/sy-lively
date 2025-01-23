import { MD5 } from "@/constant/三方库";
import { EVeil属性名称, EStoreKey } from "@/constant/系统码";
import { PluginId } from "@/index";
import SYDiaForm from "@/components/base/sy/弹出表单";
import SYFormItem from "@/components/base/sy/表单/表单项";
import SYInput from "@/components/base/sy/输入";
import $, { Cash } from "cash-dom";
import { IEventBusMap } from "siyuan";
import { SY块 } from "../../class/思源/块";
import VeilElement, { EContentVeil, EMenuVeil, TVeilTargetType } from "./veilElement";
import { sleep } from "@/utils/异步";

export default class Veil {
  private loadData: (key: EStoreKey.上锁的笔记) => Promise<any>;
  private saveData: (key: EStoreKey.上锁的笔记, value: any) => Promise<boolean>;
  private lockedNotes: Map<string, string>;

  constructor(
    loadData: (key: EStoreKey.上锁的笔记) => Promise<any>,
    saveData: (key: EStoreKey.上锁的笔记, value: any) => Promise<boolean>
  ) {
    this.loadData = loadData;
    this.saveData = saveData;
  }

  public getDoctreeRemovePasswordSubmenuConfig(id: string) {
    return {
      label: "移除密码",
      click: async () => {
        this.lockedNotes.delete(id);
        const result = this.saveData(EStoreKey.上锁的笔记, this.lockedNotes);
        console.log("🚀 ~ Veil ~ click: ~ result:", result);
      },
    };
  }

  //#region lifecycle
  public async onPlugLoad() {
    this.lockedNotes = new Map(Object.entries((await this.loadData(EStoreKey.上锁的笔记)) || {}));
  }

  public async onPlugLayoutReady() {
    this.checkAllNotebookAndLock();
  }
  //#endregion

  //#region eventBus
  public onClickBlockIcon(event: CustomEvent<IEventBusMap["click-blockicon"]>) {
    const { blockElements, menu } = event.detail;
    const $element = $(blockElements[0]);
    const blockID = $element.data("nodeId");
    const blockPwd = this.lockedNotes.get(blockID);

    const subMenu = blockPwd
      ? [
          {
            label: "锁定块",
            click: () => {
              new VeilElement($element, blockID, MD5.b64(blockPwd), EContentVeil.Block);
            },
          },
          {
            label: "移除块密码",
            click: async () => {
              this.lockedNotes.delete(blockID);
              await SY块.设置块属性({
                id: blockID,
                attrs: {
                  [EVeil属性名称.pwdHash]: null,
                },
              });
              this.saveData(EStoreKey.上锁的笔记, this.lockedNotes);
            },
          },
        ]
      : [
          {
            label: "为块添加密码",
            click: () => {
              this.addPassword($element, blockID, EContentVeil.Block);
            },
          },
        ];

    menu.addItem({
      id: PluginId + "-访问控制",
      label: "喧嚣-访问控制",
      submenu: subMenu,
    });
  }

  public onOpenMenuDoctree(event: CustomEvent<IEventBusMap["open-menu-doctree"]>) {
    const { elements, menu, type } = event.detail;
    const $element = $(elements[0]);
    console.log("🚀 ~ Veil ~ onOpenMenuDoctree ~ $element:", $element);
    const docID = $element.data("nodeId");

    const that = this;

    let subMenu: any[] = [];
    switch (type) {
      case "notebook":
        subMenu = getNotebookSubmenu($element);
        break;
      case "docs":
        // addMenuForDoc($element, menu, noteBookID, docID);
        break;
      case "doc":
        // addMenuForBlock($element, menu, docID);
        break;
    }

    function getNotebookSubmenu($element: Cash) {
      const noteBookID = $element.parent().data("url");
      const pwd = that.lockedNotes.get(noteBookID);
      return pwd
        ? [
            {
              label: "锁定笔记本",
              click: () => {
                new VeilElement($element.parent(), noteBookID, MD5.b64(pwd), EMenuVeil.Notebook);
              },
            },
            that.getDoctreeRemovePasswordSubmenuConfig(noteBookID),
          ]
        : [
            {
              label: "添加密码",
              click: () => {
                that.addPassword($element, noteBookID, EMenuVeil.Notebook);
              },
            },
          ];
    }

    menu.addItem({
      id: PluginId + "-访问控制",
      label: "喧嚣-访问控制",
      submenu: subMenu,
    });
  }

  public onOpenMenuContent(event: CustomEvent<IEventBusMap["open-menu-content"]>) {
    const { element, menu, protyle } = event.detail;
    const $protyleEle = $(protyle.element);
    const protyleID = protyle.block.id;

    const $element = $(element);
    const blockID = $element.data("nodeId");
    const protylePwd = this.lockedNotes.get(blockID);
    const blockPwd = this.lockedNotes.get(blockID);

    const subMenuP = protylePwd
      ? [
          {
            label: "锁定文档",
            click: () => {
              new VeilElement($protyleEle, protyleID, MD5.b64(protylePwd), EContentVeil.Page);
            },
          },
          {
            label: "移除文档密码",
            click: async () => {
              this.lockedNotes.delete(protyleID);
              await SY块.设置块属性({
                id: protyleID,
                attrs: {
                  [EVeil属性名称.pwdHash]: null,
                },
              });
              this.saveData(EStoreKey.上锁的笔记, this.lockedNotes);
            },
          },
        ]
      : [
          {
            label: "为文档添加密码",
            click: () => {
              this.addPassword($protyleEle, protyleID, EContentVeil.Page);
            },
          },
        ];

    const subMenuB = blockPwd
      ? [
          {
            label: "锁定块",
            click: () => {
              new VeilElement($element, blockID, MD5.b64(blockPwd), EContentVeil.Block);
            },
          },
          {
            label: "移除块密码",
            click: async () => {
              this.lockedNotes.delete(blockID);
              await SY块.设置块属性({
                id: blockID,
                attrs: {
                  [EVeil属性名称.pwdHash]: null,
                },
              });
              this.saveData(EStoreKey.上锁的笔记, this.lockedNotes);
            },
          },
        ]
      : [
          {
            label: "为块添加密码",
            click: () => {
              this.addPassword($element, blockID, EContentVeil.Block);
            },
          },
        ];

    menu.addItem({
      id: PluginId + "-访问控制",
      label: "喧嚣-访问控制",
      submenu: subMenuP.concat(subMenuB),
    });
  }

  public onLoadedProtyleStatic(event: CustomEvent<IEventBusMap["loaded-protyle-static"]>) {
    const { protyle } = event.detail;
    const protyleId = protyle.block.id;
    const $element = $(protyle.element);

    $element.find(`[${EVeil属性名称.pwdHash}]`).each((_, e) => {
      const $e = $(e);
      const pwdHash = $e.attr(EVeil属性名称.pwdHash);
      if ($e.hasClass("protyle-wysiwyg")) {
        new VeilElement($element, protyleId, pwdHash, EContentVeil.Page);
        return;
      }
      const noteId = $e.data("nodeId");
      new VeilElement($element, noteId, pwdHash, EContentVeil.Block);
    });
  }

  public async onWSMain(event: CustomEvent<IEventBusMap["ws-main"]>) {
    if (event.detail?.data?.box) {
      const openNotebook = event.detail?.data?.existed === false;
      const newDocOrRenameDoc = Boolean(event.detail?.data?.id);

      if (openNotebook || newDocOrRenameDoc) return "Leave it unlocked";
      this.checkAllNotebookAndLock();
      await sleep(100);
      // this.checkAllPageAndLock();
    }
  }
  //#endregion

  private addPassword($element: Cash, noteId: string, type: TVeilTargetType) {
    new SYDiaForm<{
      pwd: string;
      pwdC: string;
    }>({
      dialogConfig: { title: "添加密码", width: "400px", height: "300px" },
      formItems: [
        new SYFormItem({
          label: "密码",
          input: new SYInput({
            name: "pwd",
            type: "password",
            placeholder: "密码",
          }),
        }),
        new SYFormItem({
          label: "确认密码",
          input: new SYInput({
            name: "pwdC",
            type: "password",
            placeholder: "确认密码",
          }),
        }),
      ],
      onConfirm: async (value) => {
        const pwd = value.pwd;
        if (pwd !== value.pwdC) {
          alert("两次密码不一致");
          return;
        }
        this.lockedNotes.set(noteId, pwd);

        await this.saveData(EStoreKey.上锁的笔记, Object.fromEntries(this.lockedNotes.entries()));

        const pwdHash = MD5.b64(pwd);

        if (type === EContentVeil.Block) {
          SY块.设置块属性({
            id: noteId,
            attrs: {
              [EVeil属性名称.pwdHash]: pwdHash,
            },
          });
        }

        new VeilElement($element, noteId, pwdHash, type);
        return {
          success: true,
          message: "添加成功",
        };
      },
    });
  }

  private checkAllNotebookAndLock() {
    const openedNotebook = $("ul.b3-list[data-url]");
    const closedNotebook = $("li.b3-list-item.b3-list-item--hide-action[data-type='open']");
    const allNotebook = openedNotebook.add(closedNotebook);
    const that = this;

    allNotebook.each(async (_index, notebook) => {
      const dataId = notebook.dataset.url;
      const pwd = that.lockedNotes.get(dataId);

      if (!pwd) return;

      new VeilElement($(notebook), dataId, MD5.b64(pwd), EMenuVeil.Notebook);
    });
  }
}
