import "@/index.scss";
import {
  Constants,
  Dialog,
  getBackend,
  getFrontend,
  IModel,
  lockScreen,
  Menu,
  openMobileFileById,
  openTab,
  openWindow,
  Plugin,
  showMessage,
} from "siyuan";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";

export default class PluginSample extends Plugin {
  customTab: () => IModel;
  private isMobile: boolean;
  private settingUtils: SettingUtils;

  async onload() {
    this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

    const topBarElement = this.addTopBar({
      icon: "iconFace",
      title: this.i18n.addTopBarIcon,
      position: "right",
      callback: () => {
        if (this.isMobile) {
          this.addMenu();
        } else {
          let rect = topBarElement.getBoundingClientRect();
          // 如果被隐藏，则使用更多按钮
          if (rect.width === 0) {
            rect = document.querySelector("#barMore").getBoundingClientRect();
          }
          if (rect.width === 0) {
            rect = document
              .querySelector("#barPlugins")
              .getBoundingClientRect();
          }
          this.addMenu(rect);
        }
      },
    });

    const statusIconTemp = document.createElement("template");

    this.addStatusBar({
      element: statusIconTemp.content.firstElementChild as HTMLElement,
    });

    this.settingUtils = new SettingUtils({
      plugin: this,
      name: STORAGE_NAME,
    });
    this.settingUtils.addItem({
      key: "Input",
      value: "",
      type: "textinput",
      title: "Readonly text",
      description: "Input description",
      action: {
        // Called when focus is lost and content changes
        callback: () => {
          // Return data and save it in real time
          let value = this.settingUtils.takeAndSave("Input");
          console.log(value);
        },
      },
    });
    this.settingUtils.addItem({
      key: "InputArea",
      value: "",
      type: "textarea",
      title: "Readonly text",
      description: "Input description",
      // Called when focus is lost and content changes
      action: {
        callback: () => {
          // Read data in real time
          let value = this.settingUtils.take("InputArea");
          console.log(value);
        },
      },
    });
    this.settingUtils.addItem({
      key: "Check",
      value: true,
      type: "checkbox",
      title: "Checkbox text",
      description: "Check description",
      action: {
        callback: () => {
          // Return data and save it in real time
          let value = !this.settingUtils.get("Check");
          this.settingUtils.set("Check", value);
          console.log(value);
        },
      },
    });
    this.settingUtils.addItem({
      key: "Select",
      value: 1,
      type: "select",
      title: "Select",
      description: "Select description",
      options: {
        1: "Option 1",
        2: "Option 2",
      },
      action: {
        callback: () => {
          // Read data in real time
          let value = this.settingUtils.take("Select");
          console.log(value);
        },
      },
    });
    this.settingUtils.addItem({
      key: "Slider",
      value: 50,
      type: "slider",
      title: "Slider text",
      description: "Slider description",
      direction: "column",
      slider: {
        min: 0,
        max: 100,
        step: 1,
      },
      action: {
        callback: () => {
          // Read data in real time
          let value = this.settingUtils.take("Slider");
          console.log(value);
        },
      },
    });
    this.settingUtils.addItem({
      key: "Btn",
      value: "",
      type: "button",
      title: "Button",
      description: "Button description",
      button: {
        label: "Button",
        callback: () => {
          showMessage("Button clicked");
        },
      },
    });
    this.settingUtils.addItem({
      key: "Custom Element",
      value: "",
      type: "custom",
      direction: "row",
      title: "Custom Element",
      description: "Custom Element description",
      //Any custom element must offer the following methods
      createElement: (currentVal: any) => {
        let div = document.createElement("div");
        div.style.border = "1px solid var(--b3-theme-primary)";
        div.contentEditable = "true";
        div.textContent = currentVal;
        return div;
      },
      getEleVal: (ele: HTMLElement) => {
        return ele.textContent;
      },
      setEleVal: (ele: HTMLElement, val: any) => {
        ele.textContent = val;
      },
    });
    this.settingUtils.addItem({
      key: "Hint",
      value: "",
      type: "hint",
      title: this.i18n.hintTitle,
      description: this.i18n.hintDesc,
    });

    try {
      this.settingUtils.load();
    } catch (error) {
      console.error(
        "Error loading settings storage, probably empty config json:",
        error
      );
    }

    console.log(this.i18n.helloPlugin);
  }

  onLayoutReady() {
    // this.loadData(STORAGE_NAME);
    this.settingUtils.load();
    console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);

    console.log(
      "Official settings value calling example:\n" +
        this.settingUtils.get("InputArea") +
        "\n" +
        this.settingUtils.get("Slider") +
        "\n" +
        this.settingUtils.get("Select") +
        "\n"
    );

    let tabDiv = document.createElement("div");
    new HelloExample({
      target: tabDiv,
      props: {
        app: this.app,
      },
    });
    this.customTab = this.addTab({
      type: TAB_TYPE,
      init() {
        this.element.appendChild(tabDiv);
        console.log(this.element);
      },
      beforeDestroy() {
        console.log("before destroy tab:", TAB_TYPE);
      },
      destroy() {
        console.log("destroy tab:", TAB_TYPE);
      },
    });
  }

  /**
   * A custom setting pannel provided by svelte
   */
  openDIYSetting(): void {
    let dialog = new Dialog({
      title: "SettingPannel",
      content: `<div id="SettingPanel" style="height: 100%;"></div>`,
      width: "800px",
      destroyCallback: (options) => {
        pannel.$destroy();
      },
    });
    let pannel = new SettingExample({
      target: dialog.element.querySelector("#SettingPanel"),
    });
  }

  private showDialog() {
    svelteDialog({
      title: `SiYuan ${Constants.SIYUAN_VERSION}`,
      width: this.isMobile ? "92vw" : "720px",
      constructor: (container: HTMLElement) => {
        return new HelloExample({
          target: container,
          props: {
            app: this.app,
          },
        });
      },
    });
  }

  private addMenu(rect?: DOMRect) {
    const menu = new Menu("topBarSample", () => {
      console.log(this.i18n.byeMenu);
    });
    menu.addItem({
      icon: "iconInfo",
      label: "Dialog(open help first)",
      accelerator: this.commands[0].customHotkey,
      click: () => {
        this.showDialog();
      },
    });
    if (!this.isMobile) {
      menu.addItem({
        icon: "iconRiffCard",
        label: "Open Card Tab",
        click: () => {
          const tab = openTab({
            app: this.app,
            card: {
              type: "all",
            },
          });
          console.log(tab);
        },
      });
      menu.addItem({
        icon: "iconLayout",
        label: "Open Float Layer(open help first)",
        click: () => {
          this.addFloatLayer({
            ids: ["20210428212840-8rqwn5o", "20201225220955-l154bn4"],
            defIds: ["20230415111858-vgohvf3", "20200813131152-0wk5akh"],
            x: window.innerWidth - 768 - 120,
            y: 32,
          });
        },
      });
      menu.addItem({
        icon: "iconOpenWindow",
        label: "Open Doc Window(open help first)",
        click: () => {
          openWindow({
            doc: { id: "20200812220555-lj3enxa" },
          });
        },
      });
    } else {
      menu.addItem({
        icon: "iconFile",
        label: "Open Doc(open help first)",
        click: () => {
          openMobileFileById(this.app, "20200812220555-lj3enxa");
        },
      });
    }
    menu.addItem({
      icon: "iconLock",
      label: "Lockscreen",
      click: () => {
        lockScreen(this.app);
      },
    });

    if (this.isMobile) {
      menu.fullscreen();
    } else {
      menu.open({
        x: rect.right,
        y: rect.bottom,
        isLeft: true,
      });
    }
  }
}
