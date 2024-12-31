import { SY块 } from "@/class/思源/块";
import { $, Cash } from "@/constant/三方库";
import { EPluginPath, 思源插件协议 } from "@/constant/系统码";
import { IEventBusMap } from "siyuan";
import { 生成块ID } from "./事项/事项";
import Kramdown助手 from "@/class/块/Kramdown助手";

export function createWhiteBoard(
  e: CustomEvent<
    IEventBusMap["open-menu-content"] | IEventBusMap["click-blockicon"]
  >
) {
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
    label: "添加白板",
    click: async () => {
      const id = 生成块ID();
      const url = 思源插件协议 + EPluginPath.EditWhiteBoard + "&blockID=" + id;
      await SY块.插入块({
        dataType: "markdown",
        data: Kramdown助手.生成段落块("", id),
        previousID: blockID,
      });
      await SY块.更新块({
        id,
        dataType: "markdown",
        data: `<div><a href="${url}">编辑</a></div><svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <a xlink:href="${url}" target="_blank">
    <rect x="10" y="10" width="180" height="80" />
  </a></svg>`,
      });
    },
  });
}
