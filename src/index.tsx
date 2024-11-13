import { Provider } from "jotai";
import ReactDOM from "react-dom/client";
import { Dialog, getFrontend, openTab, Plugin } from "siyuan";
import App from "./App";
import { E持久化键 } from "./constant/系统码";
import { 仓库, 持久化atom } from "./store";
import { 触发器 } from "./class/触发器";
import { Modal } from "antd";
import { 卡片块 } from "./class/卡片/卡片块";
import { 系统推送错误消息 } from "./API/推送消息";

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
      console.log("🚀 ~ AccessControllerPlugin ~ getData ~ error:", error);
      return null;
    }
    return data;
  };
  private putData = async (key: E持久化键, value: any) => {
    try {
      await this.saveData(key, value);
      return true;
    } catch (error) {
      console.log("🚀 ~ AccessControllerPlugin ~ saveData ~ error:", error);
      return false;
    }
  };

  private 提示器1: 触发器 = new 触发器(this.getData, this.putData);

  async onload() {
    this.isMobile =
      getFrontend() === "mobile" || getFrontend() === "browser-mobile";

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

    // 添加打开喧嚣快捷键
    this.addCommand({
      langKey: "喧嚣-打开喧嚣",
      hotkey: "⇧⌥X",
      callback: () => {
        this.打开页签();
      },
    });

    // 添加打开新建卡片快捷键
    // this.addCommand({
    //   langKey: "喧嚣-新建卡片",
    //   hotkey: "⌥Q",
    //   callback: () => {
    //     this.打开新建卡片();
    //   },
    // });
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
        icon: "iconFace",
        title: "喧嚣",
        id: this.name + TAB_TYPE,
      },
    });
  }

  async 打开新建卡片() {
    const 父项ID = await this.loadData(E持久化键.卡片文档ID);

    if (!父项ID) {
      系统推送错误消息({
        msg: "未找到卡片文档ID",
        timeout: 10 * 1000,
      });
      return;
    }

    const id = await 卡片块.新建卡片(父项ID);

    this.addFloatLayer({
      ids: [id],
      defIds: [],
      x: window.innerWidth / 2 - 300,
      y: window.innerHeight / 2,
    });

    // const 对话框 = new Dialog({
    //   title: "新建卡片",
    //   content: `<div>
    //     <form
    //       onsubmit="(e) => {
    //         console.log("🚀 ~ SyLively ~ e:", e)
    //       }"
    //       id="form"
    //     >
    //       <div>
    //         <label>标题</label>
    //         <input type="text" id="title" />
    //       </div>
    //       <div>
    //         <label>内容</label>
    //         <textarea id="content"></textarea>
    //       </div>
    //       <button type="submit">提交</button>
    //     </form>
    //   </div>`,
    //   width: "400px",
    //   height: "300px",
    //   hideCloseIcon: true,
    // });
  }
}
