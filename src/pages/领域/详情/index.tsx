import { E常用SQL, SQL } from "@/API/SQL";
import { 等待持久化完成 } from "@/API/Sqlite";
import { I事项, T层级 } from "@/pages/主页/components/事项树/components/事项";
import { 生成事项 } from "@/tools/事项";
import { DeleteOutlined, EditOutlined, UndoOutlined } from "@ant-design/icons";
import { EditableProTable } from "@ant-design/pro-components";
import { Button, Tabs } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { I领域 } from "..";
import { 列配置 } from "../constant";
import { 新建事项块, 更新事项块 } from "./tools";

const 所有 = "所有";

function 领域详情() {
  const { state } = useLocation() as {
    state: I领域;
  };

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [事项数据, 令事项数据为] = useState([]);
  const [页签键, 令页签键为] = useState(所有);

  const 加载数据 = () => {
    SQL(E常用SQL.获取所有事项).then(({ data }) => {
      data.filter((item) => item.value.includes(state.ID));
      令事项数据为(data.map((item) => JSON.parse(item.value)));
    });
  };

  useEffect(() => {
    加载数据();
  }, []);

  useEffect(() => {
    加载数据();
    if (页签键 === 所有) {
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
            key: 所有,
            label: 所有,
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
            const 新事项 = 生成事项({
              层级: 1 as T层级,
              领域ID: state.ID,
              父项ID: 页签键 === 所有 ? state.分类[0].ID : 页签键,
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
              row.更新时间 = dayjs().valueOf();
            });
          },
          onSave: async (_key, 事项) => {
            const 是新建的 = 事项.更新时间 === 事项.创建时间;
            if (是新建的) {
              await 新建事项块(事项);
            } else {
              await 更新事项块(事项);
            }

            等待持久化完成().then(() => 加载数据());
          },
        }}
      />
    </>
  );
}

export default 领域详情;
