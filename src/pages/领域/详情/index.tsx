import SQL助手 from "@/class/SQL助手";
import { T弹窗状态 } from "@/components/弹窗表单";
import { 思源协议 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { 用户设置Atom } from "@/store/用户设置";
import { 生成事项 } from "@/tools/事项";
import { I事项, I分类, I领域, T层级 } from "@/types/喧嚣";
import { 睡眠 } from "@/utils/异步";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { EditableProTable } from "@ant-design/pro-components";
import { Button, Tabs } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import 分类表单 from "../components/分类表单";
import { 列配置 } from "../constant";
import { 新建事项块, 更新事项块 } from "./tools";
import 删除事项 from "../components/删除事项";

const 所有 = "所有";

function 领域详情() {
  const [用户设置] = useAtom(用户设置Atom);

  const { state } = useLocation() as {
    state: I领域;
  };

  const [分类, 令分类为] = useState<I分类[]>([]);
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);
  const [事项加载中, 令事项加载中为] = useState(false);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);

  const [事项数据, 令事项数据为] = useState([]);
  const [页签键, 令页签键为] = useState(所有);

  const 加载数据 = async () => {
    await SQL助手.获取指定领域下的分类(state.ID).then((data) => {
      令分类为(data);
    });
  };

  const 加载事项数据 = async () => {
    令事项加载中为(true);
    const ID = 页签键 === 所有 ? state.ID : 页签键;
    const data = await SQL助手.获取指定分类下的事项(ID);
    令事项数据为(data);
    令事项加载中为(false);
  };

  useEffect(() => {
    加载数据();
    加载事项数据();
  }, [state.ID]);

  useEffect(() => {
    加载事项数据();
  }, [页签键]);

  return (
    <>
      <Tabs
        type="editable-card"
        tabBarExtraContent={
          <>
            <Button
              icon={<UndoOutlined />}
              type="link"
              onClick={加载事项数据}
            />
            <Button
              icon={<PlusCircleOutlined />}
              type="link"
              onClick={() => 令弹窗状态为("添加")}
            />
          </>
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

      <EditableProTable<I事项>
        columns={[
          ...列配置,
          {
            title: "操作",
            valueType: "option",
            fixed: "right",
            render: (_text, record, _, action) => [
              <Button
                key="edit"
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  action?.startEditable?.(record.ID, record);
                }}
              />,
              <删除事项 事项={record} 完成回调={加载事项数据}>
                <Button key="delete" type="link" icon={<DeleteOutlined />} />
              </删除事项>,
            ],
          },
        ]}
        loading={事项加载中}
        value={事项数据}
        headerTitle={
          页签键 === 所有 ? (
            "所有"
          ) : (
            <a href={思源协议 + 页签键}>
              {分类.find((item) => item.ID === 页签键)?.名称}
            </a>
          )
        }
        recordCreatorProps={{
          position: "top",
          record: () => {
            const 新事项 = 生成事项({
              层级: 1 as T层级,
              父项ID: 页签键 === 所有 ? 分类?.[0]?.ID : 页签键,
              分类ID: 页签键 === 所有 ? 分类?.[0]?.ID : 页签键,
              领域ID: state.ID,
              笔记本ID: 用户设置.笔记本ID,
            });

            return 新事项;
          },
        }}
        rowKey="ID"
        editable={{
          type: "single",
          editableKeys,
          onChange: (keys, rows: I事项[]) => {
            setEditableRowKeys(keys);
            rows.forEach((row) => {
              row.更新时间 = dayjs().format(E时间格式化.思源时间);
            });
          },
          onSave: async (_key, 事项) => {
            const 是新建的 = 事项.更新时间 === 事项.创建时间;

            if (是新建的) {
              await 新建事项块(事项, 用户设置);
            } else {
              await 更新事项块(事项);
            }

            await 睡眠(1000);
            加载事项数据();
            // 等待持久化完成().then(() => 加载数据());
          },
        }}
      />

      <分类表单
        领域={state}
        弹窗状态={弹窗状态}
        令弹窗状态为={令弹窗状态为}
        完成回调={加载数据}
      />
    </>
  );
}

export default 领域详情;
