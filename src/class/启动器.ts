import { E持久化键 } from "@/constant/系统码";
import SQL助手 from "./SQL助手";
import dayjs from "dayjs";
import { E事项状态 } from "@/constant/状态配置";
import CronParser from "cron-parser";
import { E时间格式化 } from "@/constant/配置常量";
import { 更新事项块 } from "@/tools/事项/事项块";

export class 启动器 {
  加载: (key: E持久化键) => Promise<any>;
  保存: (key: E持久化键, value: any) => Promise<boolean>;

  constructor(
    加载: (key: E持久化键) => Promise<any>,
    保存: (key: E持久化键, value: any) => Promise<boolean>
  ) {
    this.加载 = 加载;
    this.保存 = 保存;

    this.数据修复();
    this.重复事项处理();
  }

  数据修复() {}

  async 重复事项处理() {
    const 所有事项 = await SQL助手.获取所有事项();
    所有事项.forEach((事项) => {
      const { 重复, 状态 } = 事项;
      if (重复 && 状态 === E事项状态.已完成) {
        const 定时器 = CronParser.parseExpression(重复);
        const 下次开始时间 = dayjs(定时器.next().toDate()).format(
          E时间格式化.思源时间
        );
        事项.开始时间 = 下次开始时间;
        事项.状态 = E事项状态.未开始;
        更新事项块(事项);
      }
    });
  }
}
