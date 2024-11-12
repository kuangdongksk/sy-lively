import { 系统推送消息 } from "@/API/推送消息";
import { E事项状态, E提醒, 获取提醒参数 } from "@/constant/状态配置";
import { E持久化键 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { 更新事项块 } from "@/tools/事项/事项块";
import CronParser from "cron-parser";
import dayjs from "dayjs";
import SQL助手 from "./SQL助手";
import { I事项 } from "@/types/喧嚣/事项";

export class 触发器 {
  private 计时器: NodeJS.Timeout | null = null;

  private 加载: (key: E持久化键) => Promise<any>;
  private 保存: (key: E持久化键, value: any) => Promise<boolean>;

  private 即将开始事项 = [];
  private 逾期事项 = [];

  constructor(
    加载: (key: E持久化键) => Promise<any>,
    保存: (key: E持久化键, value: any) => Promise<boolean>
  ) {
    this.加载 = 加载;
    this.保存 = 保存;

    this.事项处理();
    this.计时器 = setInterval(() => {
      this.事项处理();
    }, 1000 * 60 * 5);
  }

  async 事项处理() {
    const 所有事项 = await SQL助手.获取所有事项();

    所有事项.forEach((事项) => {
      const { 名称, 重复, 提醒, 状态, 开始时间, 结束时间 } = 事项;
      this.检查是否需要提醒(事项, {
        名称,
        提醒: 提醒,
        状态,
        开始时间,
        结束时间,
      });

      if (重复 !== "u不重复" && 状态 === E事项状态.已完成) {
        try {
          const 定时器 = CronParser.parseExpression(重复);
          const 下次开始时间 = dayjs(定时器.next().toDate()).format(
            E时间格式化.思源时间
          );
          事项.开始时间 = 下次开始时间;
          事项.状态 = E事项状态.未开始;
          更新事项块(事项);
        } catch (error) {
          事项.重复 = "u不重复";
          更新事项块(事项);
        }
      }
    });
    if (this.即将开始事项.length === 0 && this.逾期事项.length === 0) {
      return;
    }

    系统推送消息({
      msg: `有${this.即将开始事项.join(",")}等${
        this.即将开始事项.length
      }个事项即将开始，${this.逾期事项.join(",")}等${
        this.逾期事项.length
      }个事项已逾期`,
      timeout: 20000,
    });

    this.即将开始事项 = [];
    this.逾期事项 = [];
  }

  private 检查是否需要提醒(
    事项: I事项,
    参数: {
      名称: string;
      提醒: E提醒;
      状态: E事项状态;
      开始时间?: string;
      结束时间?: string;
    }
  ) {
    const { 名称, 提醒, 状态, 开始时间, 结束时间 } = 参数;

    if (提醒 === E提醒.不提醒) {
      return;
    }

    try {
      const { 单位: _1, 数量: _2 } = 获取提醒参数(提醒);
    } catch (error) {
      事项.提醒 = E提醒.不提醒;
      更新事项块(事项);
      return;
    }

    if (状态 !== E事项状态.未开始 && 结束时间) {
      if (结束时间 && dayjs(结束时间).isBefore(dayjs())) {
        this.逾期事项.push(名称);
      }
    }

    if (开始时间) {
      const { 单位, 数量 } = 获取提醒参数(提醒);
      const diff = dayjs(开始时间).diff(dayjs(), 单位);
      if (diff <= 数量 && diff >= 0) {
        this.即将开始事项.push(名称);
      }
    }
  }

  public 销毁() {
    if (this.计时器 !== null) {
      clearInterval(this.计时器);
      this.计时器 = null;
    }
  }
}
