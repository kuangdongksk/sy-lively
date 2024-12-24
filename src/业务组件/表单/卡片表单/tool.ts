import { pinyin } from "pinyin-pro";

export function toAlias(title: string, str: string) {
  return [
    pinyin(title, {
      pattern: "first",
      type: "array",
    })?.join(""),
    ...(str.split(/;|；/) || []),
  ];
}
