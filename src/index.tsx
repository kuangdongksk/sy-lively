import { Provider } from "jotai";
import ReactDOM from "react-dom/client";
import { getFrontend, openTab, Plugin } from "siyuan";
import App from "./App";
import { 启动器 } from "./class/启动器";
import { 提示器 } from "./class/提示器";
import { E持久化键 } from "./constant/系统码";
import { 仓库, 持久化atom } from "./store";

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

  private 提示器1: 提示器 = new 提示器();
  private 启动器1: 启动器 = new 启动器(this.getData, this.putData);

  async onload() {
    this.isMobile =
      getFrontend() === "mobile" || getFrontend() === "browser-mobile";

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
}
