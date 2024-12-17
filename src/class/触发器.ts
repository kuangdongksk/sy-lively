import { 系统推送消息 } from "@/API/推送消息";
import { SY块 } from "@/class/思源/块";
import { E事项状态, E提醒, 获取提醒参数 } from "@/constant/状态配置";
import { E持久化键 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { 事项转为属性 } from "@/tools/事项/事项";
import { 更新事项块 } from "@/tools/事项/事项块";
import { I事项 } from "@/types/喧嚣/事项";
import CronParser from "cron-parser";
import dayjs from "dayjs";
import SQLer from "./SQLer";
import { 卡片 as 卡片类 } from "./卡片";

const 最新数据版本 = {
  事项数据版本: 1,
  卡片数据版本: 1,
};

export class 触发器 {
  private 计时器: NodeJS.Timeout | null = null;

  private 加载: (key: E持久化键) => Promise<any>;
  private 保存: (key: E持久化键, value: any) => Promise<boolean>;
  private 添加状态栏: (options: {
    element: HTMLElement;
    position?: "right" | "left";
  }) => HTMLElement;

  private 即将开始事项 = [];
  private 逾期事项 = [];

  constructor(
    加载: (key: E持久化键) => Promise<any>,
    保存: (key: E持久化键, value: any) => Promise<boolean>,
    添加状态栏: (options: {
      element: HTMLElement;
      position?: "right" | "left";
    }) => HTMLElement
  ) {
    this.加载 = 加载;
    this.保存 = 保存;
    this.添加状态栏 = 添加状态栏;

    this.数据处理().then(() => {
      this.事项处理();
      this.计时器 = setInterval(() => {
        this.事项处理();
      }, 1000 * 60 * 5);
    });
  }

  async 数据处理() {
    const { 事项版本, 卡片版本 } = await this.加载(E持久化键.数据版本);
    const { 事项数据版本, 卡片数据版本 } = 最新数据版本;

    if (事项版本 !== 事项数据版本) {
      系统推送消息({
        msg: "数据版本不一致，正在进行数据升级",
        timeout: 20000,
      });

      const 所有事项 = await SQLer.获取所有事项();

      所有事项.forEach(async (事项) => {
        await SY块.设置块属性({
          id: 事项.ID,
          attrs: 事项转为属性(事项),
        });
      });

      await this.保存(E持久化键.数据版本, {
        事项版本: 事项数据版本,
        卡片版本,
      });
    }

    if (卡片版本 !== 卡片数据版本) {
      系统推送消息({
        msg: "数据版本不一致，正在进行数据升级",
        timeout: 20000,
      });

      const 所有卡片 = await 卡片类.获取所有卡片();

      const promiseList = [];
      所有卡片.forEach(async (卡片) => {
        promiseList.push(() =>
          SY块.设置块属性({
            id: 卡片.ID,
            // attrs: 卡片类.卡片转为属性(卡片),
            attrs: {
              "custom-plugin-lively-card": "",
              "custom-plugin-lively-card-description": "",
              "custom-plugin-lively-card-id": "",
              "custom-plugin-lively-card-parentId": "",
              "custom-plugin-lively-card-x": "",
              "custom-plugin-lively-card-y": "",
              "custom-plugin-lively-card-alias": "",
            },
          })
        );
      });
      await Promise.all(promiseList.map((fn) => fn()));

      await this.保存(E持久化键.数据版本, {
        事项版本,
        卡片版本: 卡片数据版本,
      });
    }
  }

  async 事项处理() {
    const 所有事项 = await SQLer.获取所有事项();

    所有事项.forEach((事项) => {
      if (this.修复事项(事项)) {
        return;
      }

      const { 名称, 重复, 提醒, 状态, 开始时间, 结束时间 } = 事项;
      this.检查是否需要提醒({
        名称,
        提醒: 提醒,
        状态,
        开始时间,
        结束时间,
      });

      if (重复 !== "u不重复" && 状态 === E事项状态.已完成) {
        const 定时器 = CronParser.parseExpression(重复);
        const 下次开始时间 = dayjs(定时器.next().toDate()).format(
          E时间格式化.思源时间
        );
        事项.开始时间 = 下次开始时间;
        事项.状态 = E事项状态.未开始;
        更新事项块(事项);
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

  private 修复事项(事项: I事项): boolean {
    const { 重复, 提醒, 单开一页 } = 事项;

    let 需要修复 = false;

    if (提醒 !== E提醒.不提醒) {
      try {
        const { 单位: _1, 数量: _2 } = 获取提醒参数(提醒);
      } catch (error) {
        事项.提醒 = E提醒.不提醒;
        需要修复 = true;
      }
    }

    if (重复 !== "u不重复") {
      try {
        CronParser.parseExpression(重复);
      } catch (error) {
        事项.重复 = "u不重复";
        需要修复 = true;
      }
    }

    if (typeof 单开一页 !== "boolean") {
      事项.单开一页 = false;
      需要修复 = true;
    }

    if (需要修复) {
      更新事项块(事项);
      return true;
    }

    return false;
  }

  private 检查是否需要提醒(参数: {
    名称: string;
    提醒: E提醒;
    状态: E事项状态;
    开始时间?: string;
    结束时间?: string;
  }) {
    const { 名称, 提醒, 状态, 开始时间, 结束时间 } = 参数;

    if (提醒 === E提醒.不提醒) {
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
