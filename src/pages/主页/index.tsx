import SQL助手 from "@/class/SQL助手";
import { E事项状态 } from "@/constant/状态配置";
import { E时间格式化 } from "@/constant/配置常量";
import { 用户设置Atom } from "@/store/用户设置";
import { I事项 } from "@/types/喧嚣";
import { Badge, List, Progress, Space, Tag } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function 主页() {
  const [用户设置] = useAtom(用户设置Atom);
  const [事项列表, 令事项列表为] = useState<
    (I事项 & {
      领域名称: string;
      分类名称: string;
    })[]
  >([]);

  const 获取事项 = async () => {
    const 结果 = await SQL助手.获取笔记本下的所有事项添加分类(
      用户设置.笔记本ID
    );
    令事项列表为(结果);
  };

  useEffect(() => {
    获取事项();
  }, [用户设置]);

  return (
    <>
      <Progress
        percent={
          (事项列表.filter((事项) => 事项.状态 === E事项状态.已完成).length /
            事项列表.length) *
          100
        }
        status="active"
        strokeColor={{ from: "#ff8486", to: "#9bc188" }}
      />
      <List
        dataSource={事项列表}
        renderItem={(事项) => {
          const { ID, 名称, 状态, 开始时间, 结束时间, 领域名称, 分类名称 } =
            事项;
          return (
            <List.Item key={ID} data-type="block-ref" data-id={ID}>
              <Space>
                <Badge
                  status={状态 === E事项状态.已完成 ? "success" : "error"}
                />
                {名称}
                <Tag>
                  {领域名称}/{分类名称}
                </Tag>
              </Space>
              <br />
              <Space>
                <span>{dayjs(开始时间).format(E时间格式化.日记格式)}</span>
                <span>{dayjs(结束时间).format(E时间格式化.日记格式)}</span>
              </Space>
            </List.Item>
          );
        }}
      />
    </>
  );
}

export default 主页;
