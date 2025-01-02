import { $, Cash } from "@/constant/三方库";
import { EPluginPath, EWhiteBoard属性名称 } from "@/constant/系统码";
import { 生成块ID } from "@/tools/事项/事项";
import { App, IEventBusMap, openTab } from "siyuan";
import Kramdown助手 from "../块/Kramdown助手";
import { SY块 } from "../思源/块";

export default class WhiteBoard {
  app: App;
  pluginName = "livelySaSa";
  constructor(props: { app: App; pluginName: string }) {
    const { app, pluginName } = props;
    this.app = app;
    this.pluginName = pluginName;
  }

  public onLoadedProtyleStatic() {
    const pn = this.pluginName;
    const app = this.app;

    $(`[${EWhiteBoard属性名称.WhiteBoard}]`).each((_index, element) => {
      $(element).on("click", () => {
        openTab({
          app,
          custom: {
            icon: "iconCalendar",
            title: "喧嚣",
            id: pn + EPluginPath.EditWhiteBoard,
            data: {
              blockId: $(element).data("nodeId"),
            },
          },
        });
      });
    });
  }

  public createWhiteBoard(
    e: CustomEvent<
      IEventBusMap["open-menu-content"] | IEventBusMap["click-blockicon"]
    >
  ) {
    const app = this.app;
    const pn = this.pluginName;
    const detail = e.detail;
    const { menu } = detail;
    let $element: Cash;
    let blockID: string;

    if ("element" in detail) {
      $element = $(detail.element);
      blockID = $element.data("nodeId");
    } else {
      $element = $(detail.blockElements[0]);
      blockID = $element.data("nodeId");
    }

    menu.addItem({
      id: "white-board",
      label: "喧嚣-添加白板",
      click: async () => {
        const id = 生成块ID();

        await SY块.插入块({
          dataType: "markdown",
          data: Kramdown助手.生成段落块(
            `<div><svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="180" height="80" />
            </svg></div>`,
            id
          ),
          previousID: blockID,
        });
        await SY块.设置块属性({
          id,
          attrs: {
            [EWhiteBoard属性名称.WhiteBoard]: "true",
          },
        });

        const $element = $(`[data-node-id='${id}']`);
        $element.on("click", () => {
          openTab({
            app,
            custom: {
              icon: "iconCalendar",
              title: "喧嚣",
              id: pn + EPluginPath.EditWhiteBoard,
              data: {
                blockId: $element.data("nodeId"),
              },
            },
          });
        });
      },
    });
  }
}
