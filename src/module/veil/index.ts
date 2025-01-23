import { MD5 } from "@/constant/三方库";
import { EVeil属性名称, EStoreKey } from "@/constant/系统码";
import { PluginId } from "@/index";
import SYDiaForm from "@/components/base/sy/弹出表单";
import SYFormItem from "@/components/base/sy/表单/表单项";
import SYInput from "@/components/base/sy/输入";
import $, { Cash } from "cash-dom";
import { IEventBusMap } from "siyuan";
import { SY块 } from "../../class/思源/块";
import VeilElement, { TVeilTargetType } from "./veilElement";

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

  public async onPlugLoad() {
    this.lockedNotes = new Map(
      Object.entries((await this.loadData(EStoreKey.上锁的笔记)) || {})
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
          // {
          //   label: "锁定目录",
          //   click: () => {
          //     this.addVeil($element, currentID, "目录");
          //   },
          // },
          // {
          //   label: "锁定目录及内容区",
          //   click: () => {
          //     this.addVeil($element, currentID, "目录");
          //   },
          // },
          // {
          //   label: "移除密码",
          //   click: async () => {
          //     this.lockedNotes.delete(currentID);
          //     this.saveData(EStoreKey.上锁的笔记, this.lockedNotes);
          //   },
          // },
        ]
      : [
          // {
          //   label: "添加密码",
          //   click: () => {
          //     this.addPassword($element, currentID, "目录");
          //   },
          // },
        ];

    menu.addItem({
      id: PluginId + "-访问控制",
      label: "喧嚣-访问控制",
      submenu: subMenu,
    });
  }

  public onOpenMenuContent(
    event: CustomEvent<IEventBusMap["open-menu-content"]>
  ) {
    const { element, menu, protyle } = event.detail;
    const $protyleEle = $(protyle.element);
    const protyleID = protyle.block.id;

    const $element = $(element);
    const blockID = $element.data("nodeId");

    const subMenuP = this.lockedNotes.has(protyleID)
      ? [
          {
            label: "锁定文档",
            click: () => {
              this.addVeil($protyleEle, protyleID, "目录");
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
              this.addPassword($protyleEle, protyleID, "块");
            },
          },
        ];

    const subMenuB = this.lockedNotes.has(blockID)
      ? [
          {
            label: "锁定块",
            click: () => {
              this.addVeil($element, blockID, "块");
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
              this.addPassword($element, blockID, "块");
            },
          },
        ];

    menu.addItem({
      id: PluginId + "-访问控制",
      label: "喧嚣-访问控制",
      submenu: subMenuP.concat(subMenuB),
    });
  }

  public onClickBlockIcon(e: CustomEvent<IEventBusMap["click-blockicon"]>) {
    const { blockElements, menu } = e.detail;
    const $element = $(blockElements[0]);
    const blockID = $element.data("nodeId");

    const subMenu = this.lockedNotes.has(blockID)
      ? [
          {
            label: "锁定块",
            click: () => {
              this.addVeil($element, blockID, "块");
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
              this.addPassword($element, blockID, "块");
            },
          },
        ];

    menu.addItem({
      id: PluginId + "-访问控制",
      label: "喧嚣-访问控制",
      submenu: subMenu,
    });
  }

  public onLoadedProtyleStatic(
    e: CustomEvent<IEventBusMap["loaded-protyle-static"]>
  ) {
    const { protyle } = e.detail;
    const protyleId = protyle.block.id;
    const $element = $(protyle.element);

    $element.find(`[${EVeil属性名称.pwdHash}]`).each((_, e) => {
      const $e = $(e);
      if ($e.hasClass("protyle-wysiwyg")) {
        this.addVeil($e.parent().parent(), protyleId, "块");
        return;
      }
      const noteId = $e.data("nodeId");
      this.addVeil($e, noteId, "块");
    });
  }

  private async addVeil($element: Cash, noteId: string, type: TVeilTargetType) {
    const pwd = this.lockedNotes.get(noteId);
    if (!pwd) return;

    new VeilElement($element, noteId, MD5.b64(pwd), type);
  }

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

        await this.saveData(
          EStoreKey.上锁的笔记,
          Object.fromEntries(this.lockedNotes.entries())
        );

        const pwdHash = MD5.b64(pwd);

        if (type === "块") {
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
