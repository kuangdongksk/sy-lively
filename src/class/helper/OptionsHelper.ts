import { E提醒, E事项状态, E重复 } from "@/constant/syLively";

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

  public static 重复 = {
    第一个: [
      {
        label: "不重复",
        value: E重复.不重复,
      },
      {
        label: "每天",
        value: E重复.每天,
      },
      {
        label: "每周",
        value: E重复.每周,
      },
      {
        label: "每月",
        value: E重复.每月,
      },
      {
        label: "每年",
        value: E重复.每年,
      },
    ],
  };
}
