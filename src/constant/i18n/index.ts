import { I18n } from "i18n-js";
import ZH from "./zh";
import EN from "./en";

export const I18nPath = {
  hello: "hello",
  workFlow: {
    this: "workFlow.this",
    syFeature: {
      this: "workFlow.syFeature.this",
      AddCommandNode: {
        this: "workFlow.syFeature.AddCommandNode.this",
      },
      AddSlashCommandNode: {
        this: "workFlow.syFeature.AddSlashCommandNode.this",
      },
      AddStyleNode: {
        this: "workFlow.syFeature.AddStyleNode.this",
      },
      AddTabNode: {
        this: "workFlow.syFeature.AddTabNode.this",
      },
      AddTopBarNode: {
        this: "workFlow.syFeature.AddTopBarNode.this",
      },
      LoadDataNode: {
        this: "workFlow.syFeature.LoadDataNode.this",
        des: "workFlow.syFeature.LoadDataNode.des",
      },
      SaveDataNode: {
        this: "workFlow.syFeature.SaveDataNode.this",
        des: "workFlow.syFeature.SaveDataNode.des",
      },
    },
  },
};

export const i18n = new I18n(
  {
    en: EN,
    zh: ZH,
  },
  {
    defaultLocale: "zh",
  }
);

fetch("http://ip-api.com/json/?lang=zh-CN")
  .then((response) => response.json())
  .then((data) => {
    console.log("🚀 ~ .then ~ data:", data);
    i18n.locale = data.countryCode === "CN" ? "zh" : "en";
  })
  .catch((error) => {
    console.log("IP定位请求失败：" + error);
  });
