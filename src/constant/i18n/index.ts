import { I18n } from "i18n-js";
import EN from "./en";
import ZH from "./zh";

let locale = "zh";
fetch("http://ip-api.com/json/?lang=zh-CN")
  .then((response) => response.json())
  .then((data) => {
    locale = data.countryCode === "CN" ? "zh" : "en";
  })
  .catch((error) => {
    console.log("🚀 ~ error:", error);
  });

export const i18n = new I18n(
  {
    en: EN,
    zh: ZH,
  },
  {
    defaultLocale: "zh",
    locale,
  }
);
