import { ConfigProvider } from "antd";
import { Provider } from "jotai";
import { nanoid } from "nanoid";
import ReactDOM from "react-dom/client";
import { Dialog, getFrontend, openTab, Plugin } from "siyuan";
import { 系统推送错误消息 } from "./API/推送消息";
import App from "./App";
import { 触发器 } from "./class/触发器";
import { E持久化键 } from "./constant/系统码";
// import "./index.less";
import { E卡片属性名称 } from "./class/卡片";
import CardDocker from "./docker/CardDocker";
import { 仓库, 持久化atom } from "./store";
import { 主题 } from "./theme";
import 卡片表单 from "./业务组件/表单/卡片表单";

export const PluginId = "lively_SaSa";

// const DOCK_TYPE = "dock_tab";
const TAB_TYPE = "custom_tab";

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

  private 提示器1: 触发器 = new 触发器(
    this.getData,
    this.putData,
    this.addStatusBar
  );

  async onload() {
    this.isMobile =
      getFrontend() === "mobile" || getFrontend() === "browser-mobile";

    // 添加卡片样式
    const 卡片样式 = document.createElement("style");
    document.head.appendChild(卡片样式);
    卡片样式.innerHTML = `
      [${E卡片属性名称.ID}] {
        background-color: var(--b3-theme-background);

        padding: 12px !important;
        margin: 12px 0 !important;

        border: 1px solid var(--b3-theme-on-surface);
        border-radius: 24px !important;
      }
      [${E卡片属性名称.ID}]:hover {
        background-color: var(--b3-theme-background-light);
      }
      [${E卡片属性名称.ID}]>.h6 {
        border-bottom: 1px solid var(--b3-theme-on-surface);
      }    
      [${E卡片属性名称.ID}]>.protyle-attr {
        position: initial;
      }
    `;

    // 添加图标
    this.addIcons(`
      <svg id="iconSyLivelyCard" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M1024 239.189333C1024 169.927111 965.034667 113.777778 892.330667 113.777778H131.697778C58.965333 113.777778 0 169.927111 0 239.189333V813.226667C0 882.517333 58.965333 938.666667 131.669333 938.666667H892.302222C965.034667 938.666667 1024 882.517333 1024 813.255111V239.217778zM131.669333 197.376H892.302222c24.149333 0 43.889778 18.830222 43.889778 41.813333v101.717334H87.779556V239.189333c0-22.983111 19.740444-41.813333 43.889777-41.813333zM892.302222 855.068444H131.697778c-24.149333 0-43.889778-18.830222-43.889778-41.813333V424.504889h848.440889v388.750222c0 22.983111-19.740444 41.813333-43.889778 41.813333z m-509.070222-189.496888H184.32c-24.291556 0-43.889778 18.659556-43.889778 41.813333 0 23.096889 19.626667 41.784889 43.889778 41.784889h198.940444c24.291556 0 43.889778-18.688 43.889778-41.813334s-19.598222-41.813333-43.889778-41.813333z" p-id="8723"></path>
      /symbol>
      `);

    // 添加日程管理Icon
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

    // 添加卡片dock
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
            <CardDocker />
          </ConfigProvider>
        );
      },
    });

    // 添加打开喧嚣快捷键
    this.addCommand({
      langKey: "喧嚣-打开喧嚣",
      hotkey: "⇧⌥X",
      callback: () => {
        this.打开页签();
      },
    });

    // 添加打开新建卡片快捷键
    this.addCommand({
      langKey: "喧嚣-新建卡片",
      hotkey: "⌥Q",
      callback: () => {
        this.打开新建卡片();
      },
    });
  }

  onLayoutReady() {
    const tabDiv = document.createElement("div");
    tabDiv.style.width = "100%";
    tabDiv.style.height = "100%";
    tabDiv.id = PluginId;

    const getData = this.getData;
    const saveData = this.putData;

    // 添加自定义页签
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
    const 卡片文档ID = await this.loadData(E持久化键.卡片文档ID);

    if (!卡片文档ID) {
      系统推送错误消息({
        msg: "未找到卡片文档ID",
        timeout: 10 * 1000,
      });
      return;
    }

    const rootId = nanoid();

    new Dialog({
      title: "新建卡片",
      content: `<div id='${rootId}' style="padding: 12px;"></div>`,
      width: "400px",
      height: "300px",
      hideCloseIcon: true,
    });

    const rootDom = document.getElementById(rootId);
    const root = ReactDOM.createRoot(rootDom);

    root.render(
      <ConfigProvider theme={主题}>
        <卡片表单 卡片文档ID={卡片文档ID} />
      </ConfigProvider>
    );
  }
}
