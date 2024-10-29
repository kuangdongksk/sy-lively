import SQL助手 from "@/class/SQL助手";
import { I增改查弹窗表单Ref } from "@/components/增改查弹窗表单";
import { T弹窗状态 } from "@/components/弹窗表单";
import { 思源协议 } from "@/constant/系统码";
import { I事项, I分类, I领域 } from "@/types/喧嚣";
import 事项表单 from "@/业务组件/表单/事项表单";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tabs } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import 分类表单 from "../../../业务组件/表单/分类表单";
import 删除事项 from "../components/删除事项";
import { 列配置 } from "../constant";

const 所有 = "所有";

function 领域详情() {
  const 事项Ref = useRef<I增改查弹窗表单Ref>(null);
  const { state } = useLocation() as {
    state: I领域;
  };
  const [分类, 令分类为] = useState<I分类[]>([]);
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);

  const [页签键, 令页签键为] = useState(所有);

  const 加载数据 = async () => {
    await SQL助手.获取指定领域下的分类(state.ID).then((data) => {
      令分类为(data);
    });
  };

  useEffect(() => {
    加载数据();
  }, [state.ID]);

  useEffect(() => {}, [页签键]);

  return (
    <>
      <Tabs
        type="editable-card"
        tabBarExtraContent={
          <Button
            icon={<PlusCircleOutlined />}
            type="link"
            onClick={() => 令弹窗状态为("添加")}
          />
        }
        items={[
          {
            key: 所有,
            label: "所有",
            closable: false,
          },
          ...分类.map((item) => ({
            key: item.ID,
            label: item.名称,
            closable: false,
          })),
        ]}
        onChange={令页签键为}
        onEdit={(_event, action) => {
          if (action === "add") 令弹窗状态为("添加");
        }}
      />
      <ProTable<I事项>
        columns={[
          ...列配置,
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
                  事项Ref.current.令表单状态为("编辑");
                  事项Ref.current.令表单值为({
                    ...record,
                    领域分类: [state.ID, record.分类ID],
                    起止时间: [dayjs(record.开始时间), dayjs(record.结束时间)],
                  });
                }}
              ></Button>,
              <删除事项 事项={record} 完成回调={() => {}}>
                <Button key="delete" type="link" icon={<DeleteOutlined />} />
              </删除事项>,
            ],
          },
        ]}
        headerTitle={
          页签键 === 所有 ? (
            "所有"
          ) : (
            <a href={思源协议 + 页签键}>
              {分类.find((item) => item.ID === 页签键)?.名称}
            </a>
          )
        }
        request={async () => {
          const ID = 页签键 === 所有 ? state.ID : 页签键;
          const data = await SQL助手.获取指定分类下的事项(ID);
          return { data, success: true };
        }}
        rowKey="ID"
        search={false}
        toolbar={{
          actions: [
            <Button
              onClick={() => {
                事项Ref.current.令表单状态为("添加");
                事项Ref.current.令表单值为({
                  领域分类: [
                    state.ID,
                    页签键 === 所有 ? state.默认分类 : 页签键,
                  ],
                });
              }}
            >
              新建
            </Button>,
          ],
        }}
      />

      <分类表单
        领域={state}
        弹窗状态={弹窗状态}
        令弹窗状态为={令弹窗状态为}
        完成回调={加载数据}
      />
      <事项表单
        ref={事项Ref}
        初始值={{
          领域分类: [state.ID, 页签键 === 所有 ? state.默认分类 : 页签键],
        }}
      />
    </>
  );
}

export default 领域详情;
