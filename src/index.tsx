import { Provider } from "jotai";
import ReactDOM from "react-dom/client";
import { getFrontend, IProtyle, openTab, Plugin } from "siyuan";
import App from "./App";
import { 触发器 } from "./class/helper/触发器";
import { EPluginPath, EStoreKey } from "./constant/系统码";
import "./index.less";
import { CardPlugin } from "./module/card/plugin";
import { generateCreateCardForm } from "./module/card/plugin/NewCardForm";
import Veil from "./module/veil";
import WhiteBoard from "./module/whiteBoard/plugin";
import TlWb from "./module/whiteBoard/TlWb";
import { storeAtom, 仓库 } from "./store";
import { 校验卡片文档是否存在 } from "./tools/卡片";
import { 添加全局样式 } from "./tools/样式";
import UpdateNotice from "./module/update";

export const PluginId = "livelySaSa";

export default class SyLively extends Plugin {
  private isMobile: boolean;
  private getData = async (key: EStoreKey) => {
    let data: any;
    try {
      data = await this.loadData(key);
    } catch (error) {
      console.log("~ 喧嚣 ~ getData ~ error:", error);
      return null;
    }
    return data;
  };
  private putData = async (key: EStoreKey, value: any) => {
    try {
      const result = (await this.saveData(key, value)) as unknown as {
        code: number;
        data: any;
        message: string;
      };
      if (result?.code !== 0) return false;
      return true;
    } catch (error) {
      console.log("~ 喧嚣 ~ saveData ~ error:", error);
      return false;
    }
  };

  private cardPlugin = new CardPlugin({
    getData: this.getData,
  });
  private veil = new Veil(this.getData, this.putData);
  private whiteBoard = new WhiteBoard({ app: this.app, pluginName: this.name });
  private 提示器1: 触发器 = new 触发器(this.getData, this.putData, this.addStatusBar);

  async onload() {
    this.isMobile = getFrontend() === "mobile" || getFrontend() === "browser-mobile";

    添加全局样式();
    this.添加图标();
    this.添加快捷键();
    this.添加TopBar();
    this.添加斜杠命令();
    this.veil.onPlugLoad();

    this.setAllDock();
  }

  onLayoutReady() {
    this.添加tab();
    this.添加事件监听();
    this.veil.onPlugLayoutReady();
    new UpdateNotice().showUpdateNotice();
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
        id: this.name + EPluginPath.SYLively,
      },
    });
  }

  async 打开新建卡片(protyle?: IProtyle) {
    const 卡片文档ID = await this.getData(EStoreKey.卡片文档ID);

    if (!(await 校验卡片文档是否存在(卡片文档ID))) return;

    generateCreateCardForm({
      app: this.app,
      cardDocID: 卡片文档ID,
      protyle,
    });
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
      editorCallback: (protyle) => {
        this.打开新建卡片(protyle);
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

  添加tab() {
    const tabDiv = document.createElement("div");
    tabDiv.style.width = "100%";
    tabDiv.style.height = "100%";

    const getData = this.getData;
    const saveData = this.putData;

    //#region 添加插件主页面
    this.addTab({
      type: EPluginPath.SYLively,
      init() {
        this.element.appendChild(tabDiv);
        if (tabDiv) {
          const root = ReactDOM.createRoot(tabDiv);

          仓库.set(storeAtom, {
            load: getData,
            save: saveData,
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
    //#endregion

    //#region 添加白板编辑页面
    this.addTab({
      type: EPluginPath.EditWhiteBoard,
      init() {
        const blockId = this.data?.blockId;
        this.element.appendChild(tabDiv);
        if (tabDiv) {
          const root = ReactDOM.createRoot(tabDiv);

          仓库.set(storeAtom, {
            load: getData,
            save: saveData,
          });
          root.render(
            <Provider store={仓库}>
              <TlWb blockId={blockId} />
            </Provider>
          );
        }
      },
      beforeDestroy() {},
      destroy() {
        this.element.removeChild(tabDiv);
      },
    });
    //#endregion
  }

  async setAllDock() {
    const cardDock = await this.cardPlugin.getCardDockConfig();
    if (cardDock) {
      this.addDock(cardDock);
    }
  }

  添加事件监听() {
    // const 添加新建卡片目录 = (
    //   event: CustomEvent<IEventBusMap["open-menu-content"]>
    // ) => {
    //   const { menu } = event.detail;
    //   const selectedText = window.getSelection().toString();
    //   menu.addItem({
    //     id: PluginId + "-new-card",
    //     label: "喧嚣-新建卡片",
    //     submenu: [
    //       {
    //         label: "新建卡片",
    //         click: () => {
    //           this.打开新建卡片();
    //         },
    //       },
    //       {
    //         label: "新建卡片(选中文本)",
    //         click: () => {
    //           this.打开新建卡片();
    //         },
    //         disabled: !selectedText,
    //       },
    //     ],
    //   });
    // };
    const that = this;

    this.eventBus.on("open-menu-content", (e) => {
      // 添加新建卡片目录(e);
      // that.whiteBoard.createWhiteBoard(e);
      that.veil.onOpenMenuContent(e);
    });
    this.eventBus.on("click-blockicon", (e) => {
      // 添加新建卡片目录(e);
      // that.whiteBoard.createWhiteBoard(e);
      that.veil.onClickBlockIcon(e);
    });
    this.eventBus.on("open-menu-doctree", (e) => that.veil.onOpenMenuDoctree(e));
    this.eventBus.on("loaded-protyle-dynamic", () => {});
    this.eventBus.on("loaded-protyle-static", (e) => {
      that.veil.onLoadedProtyleStatic(e);
      that.whiteBoard.onLoadedProtyleStatic();
    });
    // this.eventBus.on("loaded-protyle-dynamic", (e) => {
    //   console.log("🚀 ~ SyLively ~ this.eventBus.on ~ e:", e)
    //   that.veil.onLoadedProtyleStatic(e);
    // });
    this.eventBus.on("ws-main", (e) => {
      that.veil.onWSMain(e);
    });

    this.eventBus.on("open-siyuan-url-plugin", () => {});
  }

  添加斜杠命令() {
    // this.protyleSlash = [
    //   {
    //     filter: ["insert whiteBoard", "插入白板", "crbb"],
    //     html: `<div class="b3-list-item__first"><span class="b3-list-item__text">插入白板</span><span class="b3-list-item__meta"></span></div>`,
    //     id: PluginId + "-insert-whiteBoard",
    //     callback(protyle: Protyle) {
    //       protyle.insert("/html\n\n", true);
    //     },
    //   },
    // ];
  }
}
