import { E事项状态, E提醒 } from "@/constant/状态配置";

export class OptionsHelper {
  public static 程度 = Array.from({ length: 10 }).map((_, i) => ({
    label: i,
    value: i,
  }));

  public static 提醒 = Object.keys(E提醒).map((k) => {
    return {
      label: k,
      value: E提醒[k],
    };
  });

  public static 状态 = [
    { label: "未开始", value: E事项状态.未开始 },
    { label: "已完成", value: E事项状态.已完成 },
  ];
}
