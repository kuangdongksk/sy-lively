import { E卡片属性名称 } from "@/class/卡片";
import { E事项属性名称 } from "@/constant/系统码";

export function 添加全局样式() {
  const 卡片样式 = document.createElement("style");
  document.head.appendChild(卡片样式);
  卡片样式.innerHTML = `
    [${E事项属性名称.ID}]:not(.protyle-wysiwyg) {
      background-color: var(--b3-theme-background);

      padding: 12px !important;
      margin: 12px 0 !important;

      border: 1px solid var(--b3-theme-on-surface);
    }
    [${E卡片属性名称.标题}]:not(.protyle-wysiwyg) {
      background-color: var(--b3-theme-background);

      padding: 12px !important;
      margin: 12px 0 !important;

      border: 1px solid var(--b3-theme-on-surface);
      border-radius: 24px !important;
    }
    [${E卡片属性名称.标题}]:hover:not(.protyle-wysiwyg) {
      background-color: var(--b3-theme-background-light);
    }
    [${E卡片属性名称.标题}]>.h6:not(.protyle-wysiwyg) {
      border-bottom: 1px solid var(--b3-theme-on-surface);
    }    
    [${E卡片属性名称.标题}]>.protyle-attr:not(.protyle-wysiwyg) {
      position: initial;
    }
  `;
}
