import SQL助手 from "@/class/SQL助手";
import 进度条 from "@/components/进度条";
import { 事项列配置 } from "@/constant/columns/事项";
import { E事项状态 } from "@/constant/状态配置";
import { 用户设置Atom } from "@/store/用户设置";
import { I事项 } from "@/types/喧嚣/事项";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import 删除事项 from "../领域/components/删除事项";
import { I增改查弹窗表单Ref } from "@/components/增改查弹窗表单";
import 事项表单 from "@/业务组件/表单/事项表单";

function 主页() {
  const [用户设置] = useAtom(用户设置Atom);
  const [事项列表, 令事项列表为] = useState([]);

  const 事项Ref = useRef<I增改查弹窗表单Ref>(null);

  const [版本, 令版本为] = useState(0);
  const [被修改的事项, 令被修改的事项为] = useState<I事项>();

  useEffect(() => {}, [用户设置]);

  return (
    <>
      <进度条
        进度={
          事项列表.filter((事项) => 事项.状态 === E事项状态.已完成).length /
          事项列表.length
        }
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
            render: (_, record) => {
              return record.领域名称 + "/" + record.分类名称;
            },
          },
          ...事项列配置,
          {
            title: "操作",
            valueType: "option",
            fixed: "right",
            render: (_text, record) => [
              <Button
                key="edit"
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  令被修改的事项为(record);
                  事项Ref.current.令表单状态为("编辑");
                  事项Ref.current.令表单值为({
                    ...record,
                    领域分类: [record.领域ID, record.分类ID],
                    起止时间: [dayjs(record.开始时间), dayjs(record.结束时间)],
                  });
                }}
              />,
              <删除事项 事项={record} 完成回调={() => {}}>
                <Button key="delete" type="link" icon={<DeleteOutlined />} />
              </删除事项>,
            ],
          },
        ]}
        params={{
          用户设置,
          版本,
        }}
        request={async ({ 用户设置 }) => {
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
      <事项表单
        ref={事项Ref}
        事项={被修改的事项}
        完成回调={() => 令版本为((pre) => pre + 1)}
      />
    </>
  );
}

export default 主页;
