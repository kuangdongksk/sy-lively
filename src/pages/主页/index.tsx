import SQL助手 from "@/class/SQL助手";
import { 事项列配置 } from "@/constant/columns/事项";
import { E事项状态 } from "@/constant/状态配置";
import { 用户设置Atom } from "@/store/用户设置";
import { I事项 } from "@/types/喧嚣";
import { ProTable } from "@ant-design/pro-components";
import { Progress } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function 主页() {
  const [用户设置] = useAtom(用户设置Atom);
  const [事项列表, 令事项列表为] = useState([]);

  useEffect(() => {}, [用户设置]);

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
      <ProTable<
        I事项 & {
          领域名称: string;
          分类名称: string;
        }
      >
        columns={[
          {
            key: "分类名称",
            title: "领域分类",
            render: (_dom, record) => {
              return record.领域名称 + record.分类名称;
            },
          },
          ...(事项列配置 as any),
        ]}
        params={{
          用户设置,
        }}
        request={async () => {
          const 结果 = await SQL助手.获取笔记本下的所有事项添加分类(
            用户设置.笔记本ID
          );
          令事项列表为(结果);
          return {
            data: 结果,
          };
        }}
        search={false}
      />
    </>
  );
}

export default 主页;
