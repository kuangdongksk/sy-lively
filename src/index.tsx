import ReactDOM from "react-dom/client";
import { getFrontend, openTab, Plugin } from "siyuan";
import App from "./App";
import { 提示器 } from "./class/提示器";
import { E持久化键 } from "./constant/系统码";
import { Provider } from "jotai";
import { 仓库, 持久化atom } from "./store";

export const PluginId = "lively_SaSa";

// const DOCK_TYPE = "dock_tab";
const TAB_TYPE = "custom_tab";

export default class SyLively extends Plugin {
  private isMobile: boolean;
  private 提示器1: 提示器 = new 提示器();

  async onload() {
    this.data[E持久化键.用户设置] = {};

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

    const load = this.loadData;
    const save = this.saveData;

    // 添加自定义页签
    this.addTab({
      type: TAB_TYPE,
      init() {
        this.element.appendChild(tabDiv);
        if (tabDiv) {
          const root = ReactDOM.createRoot(tabDiv);

          仓库.set(持久化atom, {
            加载: async (key: E持久化键) => {
              return load(key)
                .then((data) => data)
                .catch((e) => {
                  console.warn("🚀 ~ SyLively ~ 加载: ~ error:", e);
                  return null;
                });
            },
            保存: async (key: E持久化键, data: any) => {
              return save(key, data)
                .then(() => true)
                .catch((e) => {
                  console.warn("🚀 ~ SyLively ~ 保存: ~ error:", e);
                  return false;
                });
            },
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
