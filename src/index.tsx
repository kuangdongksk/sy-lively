import { ConfigProvider } from "antd";
import { Provider } from "jotai";
import { nanoid } from "nanoid";
import ReactDOM from "react-dom/client";
import {
  Dialog,
  getFrontend,
  IEventBusMap,
  openTab,
  Plugin,
  Protyle,
} from "siyuan";
import App from "./App";
import Veil from "./class/veil";
import { E卡片属性名称 } from "./class/卡片";
import { SY块 } from "./class/思源/块";
import { 触发器 } from "./class/触发器";
import { E事项属性名称, E持久化键 } from "./constant/系统码";
import CardDocker from "./docker/CardDocker";
import { 仓库, 持久化atom } from "./store";
import { 主题 } from "./style/theme";
import { 生成块ID } from "./tools/事项/事项";
import { 校验卡片文档是否存在 } from "./tools/卡片";
import { 睡眠 } from "./utils/异步";
import 卡片表单 from "./业务组件/表单/卡片表单";

export const PluginId = "livelySaSa";

const TAB_TYPE = "lively_tab";

export default class SyLively extends Plugin {
  private isMobile: boolean;
  private getData = async (key: E持久化键) => {
    let data: any;
    try {
      data = await this.loadData(key);
    } catch (error) {
      console.log("🚀 ~ 喧嚣 ~ getData ~ error:", error);
      return null;
    }
    return data;
  };
  private putData = async (key: E持久化键, value: any) => {
    try {
      await this.saveData(key, value);
      return true;
    } catch (error) {
      console.log("🚀 ~ 喧嚣 ~ saveData ~ error:", error);
      return false;
    }
  };

  private veil = new Veil(this.getData, this.putData);
  private 提示器1: 触发器 = new 触发器(
    this.getData,
    this.putData,
    this.addStatusBar
  );

  async onload() {
    this.isMobile =
      getFrontend() === "mobile" || getFrontend() === "browser-mobile";

    添加全局样式();
    this.添加图标();
    this.添加快捷键();
    this.添加TopBar();
    this.添加Dock();
    this.添加斜杠命令();
    this.veil.onPlugLoad();
  }

  onLayoutReady() {
    this.添加tab();
    this.添加事件监听();
    this.veil.onPlugLayoutReady();
  }

  async onunload() {
    this.提示器1.销毁();
  }

  uninstall() {}

  打开页签() {
    openTab({
      app: this.app,
      custom: {
        icon: "iconCalendar",
        title: "喧嚣",
        id: this.name + TAB_TYPE,
      },
    });
  }

  async 打开新建卡片() {
    const 卡片文档ID = await this.getData(E持久化键.卡片文档ID);

    if (!(await 校验卡片文档是否存在(卡片文档ID))) return;

    const rootId = nanoid() + PluginId;
    const cardID = 生成块ID();

    const 对话框 = new Dialog({
      title: "新建卡片",
      content: `<div id="${rootId}" style="padding: 12px;"></div>`,
      width: "800px",
      height: "600px",
      hideCloseIcon: true,
      destroyCallback: () => {
        SY块.删除块(cardID);
      },
    });

    const rootDom = document.getElementById(rootId);
    const root = ReactDOM.createRoot(rootDom);
    const app = this.app;

    this.protyleOptions = {
      toolbar: [
        "block-ref",
        "a",
        "|",
        "text",
        "strong",
        "em",
        "u",
        "s",
        "mark",
        "sup",
        "sub",
        "clear",
        "|",
        "code",
        "kbd",
        "tag",
        "inline-math",
        "inline-memo",
        "|",
        {
          name: "insert-smail-emoji",
          icon: "iconEmoji",
          hotkey: "⇧⌘I",
          tipPosition: "n",
          tip: this.i18n.insertEmoji,
          click(protyle: Protyle) {
            protyle.insert("😊");
          },
        },
      ],
    };

    root.render(
      <ConfigProvider theme={主题}>
        <卡片表单
          app={app}
          cardID={cardID}
          父ID={卡片文档ID}
          成功回调={(文档ID, _卡片ID) => {
            对话框.destroy();
            睡眠(1000).then(() => {
              openTab({
                app: this.app,
                doc: {
                  id: 文档ID,
                },
              });
            });
          }}
        ></卡片表单>
      </ConfigProvider>
    );
  }

  添加图标() {
    this.addIcons(`
      <svg id="iconSyLivelyCard" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M1024 239.189333C1024 169.927111 965.034667 113.777778 892.330667 113.777778H131.697778C58.965333 113.777778 0 169.927111 0 239.189333V813.226667C0 882.517333 58.965333 938.666667 131.669333 938.666667H892.302222C965.034667 938.666667 1024 882.517333 1024 813.255111V239.217778zM131.669333 197.376H892.302222c24.149333 0 43.889778 18.830222 43.889778 41.813333v101.717334H87.779556V239.189333c0-22.983111 19.740444-41.813333 43.889777-41.813333zM892.302222 855.068444H131.697778c-24.149333 0-43.889778-18.830222-43.889778-41.813333V424.504889h848.440889v388.750222c0 22.983111-19.740444 41.813333-43.889778 41.813333z m-509.070222-189.496888H184.32c-24.291556 0-43.889778 18.659556-43.889778 41.813333 0 23.096889 19.626667 41.784889 43.889778 41.784889h198.940444c24.291556 0 43.889778-18.688 43.889778-41.813334s-19.598222-41.813333-43.889778-41.813333z" p-id="8723"></path>
      /symbol>
    `);
  }

  添加快捷键() {
    //#region 添加打开喧嚣快捷键
    this.addCommand({
      langKey: "喧嚣-打开喧嚣",
      hotkey: "⇧⌥X",
      callback: () => {
        this.打开页签();
      },
    });

    //#region 添加打开新建卡片快捷键
    this.addCommand({
      langKey: "喧嚣-新建卡片",
      hotkey: "⌥Q",
      callback: () => {
        this.打开新建卡片();
      },
    });
  }

  添加TopBar() {
    this.addTopBar({
      icon: "iconCalendar", // 使用图标库中的图标，可以在工作空间/conf/appearance/icons/index.html中查看内置图标
      title: "喧嚣-日程管理",
      position: "left",
      callback: () => {
        if (this.isMobile) {
          return;
        } else {
          this.打开页签();
        }
      },
    });
  }

  async 添加Dock() {
    const 卡片文档ID = await this.getData(E持久化键.卡片文档ID);
    if (卡片文档ID) {
      this.addDock({
        config: {
          icon: "iconSyLivelyCard",
          title: "喧嚣卡片",
          position: "RightTop",
          size: { width: 284, height: 600 },
        },
        data: {},
        type: "喧嚣卡片",
        init() {
          const rootDom = this.element;
          const root = ReactDOM.createRoot(rootDom);

          root.render(
            <ConfigProvider theme={主题}>
              <CardDocker 卡片文档ID={卡片文档ID} />
            </ConfigProvider>
          );
        },
      });
    }
  }

  添加tab() {
    const tabDiv = document.createElement("div");
    tabDiv.style.width = "100%";
    tabDiv.style.height = "100%";

    const getData = this.getData;
    const saveData = this.putData;

    this.addTab({
      type: TAB_TYPE,
      init() {
        this.element.appendChild(tabDiv);
        if (tabDiv) {
          const root = ReactDOM.createRoot(tabDiv);

          仓库.set(持久化atom, {
            加载: getData,
            保存: saveData,
          });
          root.render(
            <Provider store={仓库}>
              <App />
            </Provider>
          );
        }
      },
      beforeDestroy() {},
      destroy() {
        this.element.removeChild(tabDiv);
      },
    });
  }

  添加事件监听() {
    const 添加新建卡片目录 = (
      event: CustomEvent<IEventBusMap["open-menu-content"]>
    ) => {
      const { menu } = event.detail;
      const selectedText = window.getSelection().toString();
      menu.addItem({
        id: PluginId + "-new-card",
        label: "喧嚣-新建卡片",
        submenu: [
          {
            label: "新建卡片",
            click: () => {
              this.打开新建卡片();
            },
          },
          {
            label: "新建卡片(选中文本)",
            click: () => {
              this.打开新建卡片();
            },
            disabled: !selectedText,
          },
        ],
      });
    };

    this.eventBus.on("open-menu-content", 添加新建卡片目录);
    this.eventBus.on("click-blockicon", 添加新建卡片目录);
    this.eventBus.on<"open-menu-doctree">("open-menu-doctree", (e) =>
      this.veil.onOpenMenuDoctree(e)
    );
  }

  添加斜杠命令() {
    this.protyleSlash = [
      {
        filter: ["insert emoji 😊", "插入表情 😊", "crbqwx"],
        html: `<div class="b3-list-item__first"><span class="b3-list-item__text">${this.i18n.insertEmoji}</span><span class="b3-list-item__meta">😊</span></div>`,
        id: "insertEmoji",
        callback(protyle: Protyle) {
          protyle.insert("😊");
        },
      },
    ];
  }
}

function 添加全局样式() {
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
