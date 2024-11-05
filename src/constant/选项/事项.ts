import { E提醒 } from "../状态配置";

export const Op提醒 = Object.keys(E提醒).map((k) => {
  return {
    label: k,
    value: E提醒[k as keyof typeof E提醒],
  };
});
