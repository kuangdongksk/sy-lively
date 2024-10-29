import SQL助手 from "@/class/SQL助手";
import { I增改查弹窗表单Ref } from "@/components/增改查弹窗表单";
import { T弹窗状态 } from "@/components/弹窗表单";
import { E事项状态 } from "@/constant/状态配置";
import { 思源协议 } from "@/constant/系统码";
import { I事项, I分类, I领域 } from "@/types/喧嚣";
import 事项表单 from "@/业务组件/表单/事项表单";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Tabs } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import 分类表单 from "../../../业务组件/表单/分类表单";
import 删除事项 from "../components/删除事项";
import { 列配置 } from "../constant";

const 所有 = "所有";

function 领域详情() {
  const 事项Ref = useRef<I增改查弹窗表单Ref>(null);
  const { state } = useLocation() as { state: I领域 };

  const [分类, 令分类为] = useState<I分类[]>([]);
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);

  const [页签键, 令页签键为] = useState(所有);

  const [被修改的事项, 令被修改的事项为] = useState<I事项>();
  const [版本, 令版本为] = useState(0);

  const 加载分类 = async () => {
    const data = await SQL助手.获取指定领域下的分类(state.ID);
    令分类为(data);
  };

  useEffect(() => {
    加载分类();
  }, [state.ID]);

  const columns = useMemo(() => {
    return [
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
              令被修改的事项为(record);
              事项Ref.current.令表单状态为("编辑");
              事项Ref.current.令表单值为({
                ...record,
                领域分类: [state.ID, record.分类ID],
                起止时间: [dayjs(record.开始时间), dayjs(record.结束时间)],
              });
            }}
          />,
          <删除事项 事项={record} 完成回调={() => {}}>
            <Button key="delete" type="link" icon={<DeleteOutlined />} />
          </删除事项>,
        ],
      },
    ] as ProColumns[];
  }, [state.ID, 页签键, 事项Ref.current]);

  const 标题 = useMemo(() => {
    return 页签键 === 所有 ? (
      "所有"
    ) : (
      <a href={思源协议 + 页签键}>
        {分类.find((item) => item.ID === 页签键)?.名称}
      </a>
    );
  }, [state.ID, 页签键]);

  const 工具栏 = useMemo(() => {
    return {
      actions: [
        <Button
          onClick={() => {
            事项Ref.current.令表单状态为("添加");
            事项Ref.current.令表单值为({
              状态: E事项状态.未开始,
              领域分类: [state.ID, 页签键 === 所有 ? state.默认分类 : 页签键],
            });
          }}
        >
          新建
        </Button>,
      ],
    };
  }, [state.ID, 页签键, 事项Ref.current]);

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
        columns={columns}
        headerTitle={标题}
        params={{ ID: 页签键 === 所有 ? state.ID : 页签键, 版本: 版本 }}
        request={async (params) => {
          const { ID, 版本: _版本 } = params;
          const data = await SQL助手.获取指定分类下的事项(ID);
          return { data, success: true };
        }}
        rowKey="ID"
        search={false}
        toolbar={工具栏}
      />

      <分类表单
        领域={state}
        弹窗状态={弹窗状态}
        令弹窗状态为={令弹窗状态为}
        完成回调={加载分类}
      />
      <事项表单
        ref={事项Ref}
        事项={被修改的事项}
        完成回调={() => 令版本为((pre) => pre + 1)}
      />
    </>
  );
}

export default 领域详情;
