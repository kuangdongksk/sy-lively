import SQL助手 from "@/class/SQL助手";
import { E事项状态 } from "@/constant/状态配置";
import { E时间格式化 } from "@/constant/配置常量";
import { 用户设置Atom } from "@/store/用户设置";
import { I事项 } from "@/types/喧嚣";
import { Checkbox, List, Space, Tag } from "antd";
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
    <List
      dataSource={事项列表}
      renderItem={(事项) => (
        <List.Item data-type="block-ref" data-id={事项.ID}>
          <Space>
            <Checkbox
              defaultChecked={事项.状态 === E事项状态.已完成}
              disabled
            />
            {事项.名称}
            <Tag color={事项.状态 === E事项状态.已完成 ? "green" : "red"}>
              {事项.领域名称}/{事项.分类名称}
            </Tag>
          </Space>
          <br />
          <Space>
            <span>{dayjs(事项.开始时间).format(E时间格式化.日记格式)}</span>
            <span>{dayjs(事项.结束时间).format(E时间格式化.日记格式)}</span>
          </Space>
        </List.Item>
      )}
    />
  );
}

export default 主页;
