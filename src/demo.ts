import HelloExample from "@/hello.svelte";
import "@/index.scss";
import SettingExample from "@/setting-example.svelte";
import {
  confirm,
  Constants,
  Dialog,
  getBackend,
  getFrontend,
  ICard,
  ICardData,
  IModel,
  IOperation,
  lockScreen,
  Menu,
  openMobileFileById,
  openTab,
  openWindow,
  Plugin,
  Protyle,
  showMessage,
} from "siyuan";
import { svelteDialog } from "./libs/dialog";
import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";

export default class PluginSample extends Plugin {
  customTab: () => IModel;
  private isMobile: boolean;
  private blockIconEventBindThis = this.blockIconEvent.bind(this);
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

    statusIconTemp.content.firstElementChild.addEventListener("click", () => {
      confirm(
        "⚠️",
        this.i18n.confirmRemove.replace("${name}", this.name),
        () => {
          this.removeData(STORAGE_NAME).then(() => {
            this.data[STORAGE_NAME] = { readonlyText: "Readonly" };
            showMessage(`[${this.name}]: ${this.i18n.removedData}`);
          });
        }
      );
    });
    this.addStatusBar({
      element: statusIconTemp.content.firstElementChild as HTMLElement,
    });

    this.addCommand({
      langKey: "showDialog",
      hotkey: "⇧⌘O",
      callback: () => {
        this.showDialog();
      },
      fileTreeCallback: (file: any) => {
        console.log(file, "fileTreeCallback");
      },
      editorCallback: (protyle: any) => {
        console.log(protyle, "editorCallback");
      },
      dockCallback: (element: HTMLElement) => {
        console.log(element, "dockCallback");
      },
    });
    this.addCommand({
      langKey: "getTab",
      hotkey: "⇧⌘M",
      globalCallback: () => {
        console.log(this.getOpenedTab());
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
        dock.element.innerHTML = `<div class="toolbar toolbar--border toolbar--dark">
                    <svg class="toolbar__icon"><use xlink:href="#iconEmoji"></use></svg>
                        <div class="toolbar__text">Custom Dock</div>
                    </div>
                    <div class="fn__flex-1 plugin-sample__custom-dock">
                        ${dock.data.text}
                    </div>
                    </div>`;
      },
      destroy() {
        console.log("destroy dock:", DOCK_TYPE);
      },
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

  async onunload() {
    showMessage("Goodbye SiYuan Plugin");
  }

  uninstall() {}

  async updateCards(options: ICardData) {
    options.cards.sort((a: ICard, b: ICard) => {
      if (a.blockID < b.blockID) {
        return -1;
      }
      if (a.blockID > b.blockID) {
        return 1;
      }
      return 0;
    });
    return options;
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

  private eventBusPaste(event: any) {
    // 如果需异步处理请调用 preventDefault， 否则会进行默认处理
    event.preventDefault();
    // 如果使用了 preventDefault，必须调用 resolve，否则程序会卡死
    event.detail.resolve({
      textPlain: event.detail.textPlain.trim(),
    });
  }

  private eventBusLog({ detail }: any) {
    console.log(detail);
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
        icon: "iconFace",
        label: "Open Custom Tab",
        click: () => {
          const tab = openTab({
            app: this.app,
            custom: {
              icon: "iconFace",
              title: "Custom Tab",
              data: {
                text: "This is my custom tab",
              },
              id: this.name + TAB_TYPE,
            },
          });
          console.log(tab);
        },
      });
      menu.addItem({
        icon: "iconImage",
        label: "Open Asset Tab(open help first)",
        click: () => {
          const tab = openTab({
            app: this.app,
            asset: {
              path: "assets/paragraph-20210512165953-ag1nib4.svg",
            },
          });
          console.log(tab);
        },
      });
      menu.addItem({
        icon: "iconFile",
        label: "Open Doc Tab(open help first)",
        click: async () => {
          const tab = await openTab({
            app: this.app,
            doc: {
              id: "20200812220555-lj3enxa",
            },
          });
          console.log(tab);
        },
      });
      menu.addItem({
        icon: "iconSearch",
        label: "Open Search Tab",
        click: () => {
          const tab = openTab({
            app: this.app,
            search: {
              k: "SiYuan",
            },
          });
        },
      });
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
    menu.addItem({
      icon: "iconScrollHoriz",
      label: "Event Bus",
      type: "submenu",
      submenu: [
        {
          icon: "iconSelect",
          label: "On ws-main",
          click: () => {
            this.eventBus.on("ws-main", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off ws-main",
          click: () => {
            this.eventBus.off("ws-main", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On click-blockicon",
          click: () => {
            this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
          },
        },
        {
          icon: "iconClose",
          label: "Off click-blockicon",
          click: () => {
            this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
          },
        },
        {
          icon: "iconSelect",
          label: "On click-pdf",
          click: () => {
            this.eventBus.on("click-pdf", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off click-pdf",
          click: () => {
            this.eventBus.off("click-pdf", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On click-editorcontent",
          click: () => {
            this.eventBus.on("click-editorcontent", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off click-editorcontent",
          click: () => {
            this.eventBus.off("click-editorcontent", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On click-editortitleicon",
          click: () => {
            this.eventBus.on("click-editortitleicon", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off click-editortitleicon",
          click: () => {
            this.eventBus.off("click-editortitleicon", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On click-flashcard-action",
          click: () => {
            this.eventBus.on("click-flashcard-action", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off click-flashcard-action",
          click: () => {
            this.eventBus.off("click-flashcard-action", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-noneditableblock",
          click: () => {
            this.eventBus.on("open-noneditableblock", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-noneditableblock",
          click: () => {
            this.eventBus.off("open-noneditableblock", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On loaded-protyle-static",
          click: () => {
            this.eventBus.on("loaded-protyle-static", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off loaded-protyle-static",
          click: () => {
            this.eventBus.off("loaded-protyle-static", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On loaded-protyle-dynamic",
          click: () => {
            this.eventBus.on("loaded-protyle-dynamic", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off loaded-protyle-dynamic",
          click: () => {
            this.eventBus.off("loaded-protyle-dynamic", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On switch-protyle",
          click: () => {
            this.eventBus.on("switch-protyle", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off switch-protyle",
          click: () => {
            this.eventBus.off("switch-protyle", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On destroy-protyle",
          click: () => {
            this.eventBus.on("destroy-protyle", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off destroy-protyle",
          click: () => {
            this.eventBus.off("destroy-protyle", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-doctree",
          click: () => {
            this.eventBus.on("open-menu-doctree", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-doctree",
          click: () => {
            this.eventBus.off("open-menu-doctree", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-blockref",
          click: () => {
            this.eventBus.on("open-menu-blockref", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-blockref",
          click: () => {
            this.eventBus.off("open-menu-blockref", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-fileannotationref",
          click: () => {
            this.eventBus.on("open-menu-fileannotationref", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-fileannotationref",
          click: () => {
            this.eventBus.off("open-menu-fileannotationref", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-tag",
          click: () => {
            this.eventBus.on("open-menu-tag", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-tag",
          click: () => {
            this.eventBus.off("open-menu-tag", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-link",
          click: () => {
            this.eventBus.on("open-menu-link", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-link",
          click: () => {
            this.eventBus.off("open-menu-link", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-image",
          click: () => {
            this.eventBus.on("open-menu-image", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-image",
          click: () => {
            this.eventBus.off("open-menu-image", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-av",
          click: () => {
            this.eventBus.on("open-menu-av", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-av",
          click: () => {
            this.eventBus.off("open-menu-av", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-content",
          click: () => {
            this.eventBus.on("open-menu-content", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-content",
          click: () => {
            this.eventBus.off("open-menu-content", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-breadcrumbmore",
          click: () => {
            this.eventBus.on("open-menu-breadcrumbmore", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-breadcrumbmore",
          click: () => {
            this.eventBus.off("open-menu-breadcrumbmore", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-menu-inbox",
          click: () => {
            this.eventBus.on("open-menu-inbox", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-menu-inbox",
          click: () => {
            this.eventBus.off("open-menu-inbox", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On input-search",
          click: () => {
            this.eventBus.on("input-search", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off input-search",
          click: () => {
            this.eventBus.off("input-search", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On paste",
          click: () => {
            this.eventBus.on("paste", this.eventBusPaste);
          },
        },
        {
          icon: "iconClose",
          label: "Off paste",
          click: () => {
            this.eventBus.off("paste", this.eventBusPaste);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-siyuan-url-plugin",
          click: () => {
            this.eventBus.on("open-siyuan-url-plugin", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-siyuan-url-plugin",
          click: () => {
            this.eventBus.off("open-siyuan-url-plugin", this.eventBusLog);
          },
        },
        {
          icon: "iconSelect",
          label: "On open-siyuan-url-block",
          click: () => {
            this.eventBus.on("open-siyuan-url-block", this.eventBusLog);
          },
        },
        {
          icon: "iconClose",
          label: "Off open-siyuan-url-block",
          click: () => {
            this.eventBus.off("open-siyuan-url-block", this.eventBusLog);
          },
        },
      ],
    });
    menu.addSeparator();
    menu.addItem({
      icon: "iconSettings",
      label: "Official Setting Dialog",
      click: () => {
        this.openSetting();
      },
    });
    menu.addItem({
      icon: "iconSettings",
      label: "A custom setting dialog (by svelte)",
      click: () => {
        this.openDIYSetting();
      },
    });
    menu.addItem({
      icon: "iconSparkles",
      label: this.data[STORAGE_NAME].readonlyText || "Readonly",
      type: "readonly",
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
