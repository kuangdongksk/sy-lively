import SQLer from "@/class/SQLer";
import { 卡片 as 卡片类 } from "@/class/卡片";
import { 卡片块 } from "@/class/卡片/卡片块";
import { SY块 } from "@/class/思源/块";
import SY文档 from "@/class/思源/文档";
import { $ } from "@/constant/三方库";
import { E块属性名称 } from "@/constant/系统码";
import { 生成块ID } from "@/tools/事项/事项";
import { 插入到日记 } from "@/tools/事项/事项块";
import { 睡眠 } from "@/utils/异步";
import SYForm from "@/基础组件/表单";
import SYFormItem from "@/基础组件/表单/表单项";
import SYInput from "@/基础组件/输入";
import SYSwitch from "@/基础组件/输入/开关";
import { message } from "antd";
import { App, Dialog, IProtyle, Protyle } from "siyuan";
import { toAlias } from "./tool";

export default class LYCard {
  public static async createCard(data: {
    app: App;
    cardDocID: string;
    protyle?: IProtyle;
  }) {
    const { app, cardDocID, protyle } = data;

    const cardID = 生成块ID();
    const title = "卡片标题";
    const titleID = 生成块ID();
    const card = {
      ID: cardID,
      标题: title,
      标题ID: titleID,
      别名: [],
    };
    const currentID = protyle?.block.rootID || undefined;

    const pe = document.createElement("div");
    const $pe = $(pe);

    await SY块.插入后置子块({
      parentID: cardDocID,
      dataType: "markdown",
      data: 卡片块.生成卡片Kramdown(card),
    });

    await SY块.设置块属性({
      id: cardID,
      attrs: {
        [E块属性名称.名称]: title,
        ...卡片类.卡片转为属性(card),
      },
    });

    new Protyle(app, pe, {
      blockId: cardID,
      mode: "wysiwyg",
      rootId: cardDocID,
    });

    const dialog = new Dialog({
      title: "新建卡片",
      content: "",
      width: "600px",
      height: "500px",
      hideCloseIcon: true,
      disableClose: true,
    });

    const form = new SYForm<{
      alias: string;
      singlePage: boolean;
      insertToCurrent: boolean;
      insetToDailyNote: boolean;
    }>({
      formItems: [
        new SYFormItem({
          label: "别名",
          input: new SYInput({
            name: "alias",
            type: "text",
            placeholder: "用；或;分隔",
          }),
        }),
        new SYFormItem({
          label: "单开一页",
          input: new SYSwitch({
            name: "singlePage",
            placeholder: "单独创建一个文档",
          }),
        }),
        new SYFormItem({
          label: "插入到当前",
          input: new SYSwitch({
            name: "insertToCurrent",
            placeholder: "插入到当前文档",
            disabled: !currentID,
          }),
        }),
        new SYFormItem({
          label: "嵌入到日记",
          input: new SYSwitch({
            name: "insetToDailyNote",
            placeholder: "嵌入到日记",
          }),
        }),
      ],
      labelWidth: 100,
      onConfirm: async (values) => {
        const {
          alias = "",
          insetToDailyNote,
          singlePage,
          insertToCurrent,
        } = values;

        const card = await generatorCard(alias, singlePage);

        const parentID = insertToCurrent ? currentID : cardDocID;

        const 最终ID = await 卡片块.新建卡片(card, parentID);
        const 插入日记 = async () => {
          const 笔记本ID = await SY文档.根据ID获取笔记本ID(parentID);
          await 插入到日记(最终ID, 笔记本ID);
        };
        insetToDailyNote && (await 插入日记());

        message.success("新建卡片成功，已将引用复制到剪贴板");
        if (!insertToCurrent) {
          睡眠(1000).then(() => {
            const a = document.createElement("a");
            a.href = `siyuan://block/${最终ID}`;
            a.click();
            a.remove();
          });
        }
        await navigator.clipboard.writeText(`((${cardID} '${card.标题}'))`);

        dialog.destroy();
      },
      onCancel: async () => {
        await SY块.删除块(cardID);
        dialog.destroy();
      },
    });

    const $root = $(dialog.element).find(".b3-dialog__body");

    $root.append($pe);
    $root.append(form.$form);

    async function generatorCard(aliasStr: string, singlePage: boolean) {
      const cardData = await SQLer.根据ID获取块(cardID);
      const title = cardData.fcontent;
      const content = cardData.markdown;
      let subContent = content.split(`###### ${title}\n\n`)[1];
      subContent = subContent.endsWith("}}}")
        ? subContent.slice(0, -3)
        : subContent;

      return {
        ID: cardID,
        标题: cardData.fcontent,
        标题ID: titleID,
        别名: toAlias(title, aliasStr),
        单开一页: singlePage,
        subContent,
      };
    }
  }
}
