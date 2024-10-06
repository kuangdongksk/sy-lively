import { getFrontend, Plugin } from "siyuan";
export const PluginId = "lively_SaSa";
import ReactDOM from "react-dom/client";
import App from "./App";

const DOCK_TYPE = "dock_tab";

export default class PluginSample extends Plugin {
  private isMobile: boolean;

  async onload() {
    this.isMobile =
      getFrontend() === "mobile" || getFrontend() === "browser-mobile";

    // 添加自定义页签
    this.addTab({
      type: "tab",
      init: () => {
        console.log("🚀 ~ PluginSample ~ this.addTab ~ tab:", this);
      },
    });

    this.addDock({
      config: {
        position: "LeftBottom",
        size: { width: 200, height: 0 },
        icon: "iconSaving",
        title: "Custom Dock",
        hotkey: "⌥⌘W",
      },
      data: {
        text: "This is my custom dock",
      },
      type: DOCK_TYPE,
      resize() {
        console.log(DOCK_TYPE + " resize");
      },
      update() {
        console.log(DOCK_TYPE + " update");
      },
      init: (dock) => {
        if (this.isMobile) {
          dock.element.innerHTML = `
            <div id="${PluginId}"></div>
          `;
        } else {
          dock.element.innerHTML = `
            <div id="${PluginId}"></div>
          `;
        }

        // 手动挂载 React 组件
        const rootElement = document.getElementById(PluginId);
        console.log("🚀 ~ PluginSample ~ onload ~ rootElement:", rootElement);
        if (rootElement) {
          const root = ReactDOM.createRoot(rootElement);
          root.render(<App />);
        }
      },
      destroy() {
        console.log("destroy dock:", DOCK_TYPE);
      },
    });
  }

  onLayoutReady() {}

  async onunload() {}

  uninstall() {}
}
