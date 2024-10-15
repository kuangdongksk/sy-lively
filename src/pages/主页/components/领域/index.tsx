import { E常用SQL, SQL, 根据ID获取块 } from "@/API/SQL";
import { 插入前置子块, 更新块, 设置块属性 } from "@/API/块数据";
import { E事项状态 } from "@/constant/状态配置";
import { E块属性名称 } from "@/constant/系统码";
import { 用户设置Atom } from "@/jotai/用户设置";
import { 获取笔记本下的对应日期的日记文档 } from "@/pages/设置/tools";
import { markDown创建, markDown更新 } from "@/utils/DOM";
import { 睡眠 } from "@/utils/异步";
import { stringArr2string } from "@/utils/拼接与拆解";
import { DeleteOutlined, EditOutlined, UndoOutlined } from "@ant-design/icons";
import { EditableProTable } from "@ant-design/pro-components";
import { Button, Tabs } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { I领域 } from "../..";
import { I事项, T层级 } from "../事项树/components/事项";
import { 列配置 } from "./constant";

const 所有 = "所有";

function 领域() {
  const [用户设置] = useAtom(用户设置Atom);

  const { state } = useLocation() as {
    state: I领域;
  };

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [事项数据, 令事项数据为] = useState([]);
  const [页签键, 令页签键为] = useState(所有);

  const 加载数据 = () => {
    SQL(E常用SQL.获取所有事项).then(({ data }) => {
      console.log("🚀 ~ SQL ~ data:", data);
      data.filter((item) => item.value.includes(state.ID));
      令事项数据为(data.map((item) => JSON.parse(item.value)));
    });
  };

  useEffect(() => {
    加载数据();
  }, []);

  useEffect(() => {
    加载数据();
    if (页签键 === "所有") {
    } else {
      事项数据.filter((item) => item.父项 === 页签键);
      令事项数据为(事项数据);
    }
  }, [页签键]);

  return (
    <>
      <Tabs
        tabBarExtraContent={
          <Button icon={<UndoOutlined />} type="link" onClick={加载数据} />
        }
        items={[
          {
            key: "所有",
            label: "所有",
          },
          ...state.分类.map((分类) => ({
            key: 分类.ID,
            label: 分类.名称,
          })),
        ]}
        onChange={令页签键为}
      />
      <EditableProTable<I事项>
        columns={[
          ...列配置,
          {
            title: "操作",
            valueType: "option",
            render: (text, record, _, action) => [
              <Button
                key="edit"
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  action?.startEditable?.(record.id, record);
                }}
              />,
              <Button
                key="delete"
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => {}}
              />,
            ],
          },
        ]}
        value={事项数据}
        headerTitle="可编辑表格"
        recordCreatorProps={{
          position: "top",
          record: () => {
            const id = "新建";
            const 名称 = "未命名";
            const 层级 = 1 as T层级;
            const 新事项 = {
              名称,
              重要程度: 5,
              紧急程度: 5,
              开始时间: dayjs().valueOf(),
              结束时间: dayjs().add(1, "hour").valueOf(),
              状态: E事项状态.未开始,
              重复: undefined,
              层级,

              id,
              key: stringArr2string([E事项状态.未开始, 名称, id]),
              子项: [],
              父项: 页签键 === 所有 ? state.分类[0].ID : 页签键,
              领域: state.ID,
              创建时间: dayjs().valueOf(),
              更新时间: dayjs().valueOf(),
            };

            return 新事项;
          },
        }}
        rowKey="id"
        editable={{
          type: "single",
          editableKeys,
          onChange: (keys, rows: I事项[]) => {
            setEditableRowKeys(keys);
            rows.forEach((row) => {
              row.更新时间 = dayjs().valueOf();
            });
          },
          onSave: async (key, 事项) => {
            const 获取块ID = async (事项: I事项) => {
              if (事项.更新时间 !== 事项.创建时间) {
                return (await 根据ID获取块(事项.id)).data[0].id;
              } else {
                const { id: 日记文档ID } =
                  await 获取笔记本下的对应日期的日记文档(
                    用户设置.笔记本ID,
                    dayjs()
                  );
                const { data } = await 插入前置子块({
                  dataType: "markdown",
                  data: markDown创建(事项),
                  parentID: 日记文档ID,
                });

                return data[0].doOperations[0].id;
              }
            };

            const 块ID = await 获取块ID(事项);
            console.log("🚀 ~ onSave: ~ 块ID:", 块ID);

            await 睡眠(500);
            const 新的事项 = { ...事项, id: 块ID };

            await 设置块属性({
              id: 块ID,
              attrs: {
                [E块属性名称.事项]: JSON.stringify(新的事项),
              },
            });

            await 睡眠(500);
            const { data: 块数据 } = await 根据ID获取块(块ID);
            更新块({
              id: 新的事项.id,
              data: markDown更新(块数据[0].markdown, 新的事项),
              dataType: "markdown",
            });
          },
        }}
      />
    </>
  );
}

export default 领域;
