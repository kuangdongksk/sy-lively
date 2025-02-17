import { E卡片属性名称 } from "@/module/card/service/CardQueryService";
import { E事项属性名称 } from "@/constant/系统码";

export function 添加全局样式() {
  const styleTag = document.createElement("style");
  document.head.appendChild(styleTag);
  styleTag.innerHTML = `
    [${E事项属性名称.ID}]:not(.protyle-wysiwyg) {
      background-color: var(--b3-theme-background);

      padding: 12px !important;
      margin-bottom: 12px;

      border: 1px solid var(--b3-theme-on-surface);
    }
    [${E卡片属性名称.标题ID}]:not(.protyle-wysiwyg) {
      background-color: var(--b3-theme-background);

      padding: 12px !important;
      margin-bottom: 12px;

      border: 1px solid var(--b3-theme-on-surface);
      border-radius: 24px !important;
    }
    [${E卡片属性名称.标题ID}]:hover:not(.protyle-wysiwyg) {
      background-color: var(--b3-theme-background-light);
    }
    [${E卡片属性名称.标题ID}]>.h6:not(.protyle-wysiwyg) {
      border-bottom: 1px solid var(--b3-theme-on-surface);
    }    
    [${E卡片属性名称.标题ID}]>.protyle-attr:not(.protyle-wysiwyg) {
      position: initial;
    }
  `;
}
