import { I事项 } from "@/types/喧嚣";
import SQL助手, { E常用SQL } from "./SQL助手";
import dayjs from "dayjs";
import { 系统推送消息 } from "@/API/推送消息";
import { E事项状态 } from "@/constant/状态配置";

export class 提示器 {
  private 计时器: NodeJS.Timeout | null = null;
  constructor() {
    this.计时器 = setInterval(() => {
      SQL助手.常用(E常用SQL.获取所有事项).then(({ data }) => {
        const 事项列表 = data.map(({ value }) => JSON.parse(value) as I事项);
        let 即将开始 = 0;
        let 逾期 = 0;
        事项列表.forEach((事项: I事项) => {
          if (事项.状态 === E事项状态.未开始) {
            if (dayjs(事项.开始时间).diff(dayjs(), "minute") < 10) {
              即将开始++;
            }
            if (dayjs(事项.结束时间).isBefore(dayjs())) {
              逾期++;
            }
          }
        });

        系统推送消息({
          msg: `有${即将开始}个事项即将开始，${逾期}个事项已逾期`,
          timeout: 5000,
        });
      });
    }, 1000 * 60 * 5);
  }

  public 销毁() {
    clearInterval(this.计时器);
  }
}
