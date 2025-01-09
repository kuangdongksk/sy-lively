import { E持久化键 } from "@/constant/系统码";
import { 主题 } from "@/style/theme";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import { Dock, IPluginDockTab } from "siyuan";
import CardDocker from "../docker";

export class CardPlugin {
  getData: (key: E持久化键) => Promise<any>;

  constructor(props: { getData: (key: E持久化键) => Promise<any> }) {
    const { getData } = props;

    this.getData = getData;
  }

  async onLoad() {}

  async getCardDockConfig(): Promise<
    | {
        config: IPluginDockTab;
        data: any;
        type: string;
        destroy?: (this: Dock) => void;
        resize?: (this: Dock) => void;
        update?: (this: Dock) => void;
        init: (this: Dock, dock: Dock) => void;
      }
    | false
  > {
    const 卡片文档ID = await this.getData(E持久化键.卡片文档ID);
    if (卡片文档ID) {
      return {
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
      };
    }
    return false;
  }
}
