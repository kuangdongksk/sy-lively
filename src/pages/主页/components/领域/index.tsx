import { E常用SQL, SQL } from "@/API/SQL";
import { 插入前置子块 } from "@/API/块数据";
import 事项DOM from "@/components/事项DOM";
import { 事项状态 } from "@/constant/状态配置";
import { 用户设置Atom } from "@/jotai/用户设置";
import { 获取笔记本下的对应日期的日记文档 } from "@/pages/设置/tools";
import { TSX2HTML } from "@/utils/DOM";
import { stringArr2string } from "@/utils/拼接与拆解";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { I领域 } from "../..";
import { I事项, T层级 } from "../事项树/components/事项";
import { 分类列配置, 列配置 } from "./constant";

function 领域() {
  const [用户设置] = useAtom(用户设置Atom);

  const { state } = useLocation() as {
    state: I领域;
  };
  const [事项数据, 令事项数据为] = useState([]);

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

  return (
    <>
      <Table
        columns={[
          ...分类列配置,
          {
            title: "操作",
            key: "operation",
            render: (value) => (
              <>
                <Button
                  icon={<PlusCircleOutlined />}
                  type="link"
                  onClick={() => {
                    const 分类 = value;
                    const id = nanoid();
                    const 名称 = "未命名";
                    const 层级 = 1 as T层级;

                    // TODO 应该想办法将块和事项连接起来
                    获取笔记本下的对应日期的日记文档(
                      用户设置.笔记本ID,
                      dayjs()
                    ).then(({ id: 文档ID }) => {
                      const 新事项 = {
                        id,
                        key: stringArr2string([事项状态.未开始, 名称, id]),
                        checkable: true,
                        名称,
                        重要程度: 5,
                        紧急程度: 5,
                        开始时间: dayjs().valueOf(),
                        结束时间: dayjs().add(1, "hour").valueOf(),
                        状态: 事项状态.未开始,
                        重复: undefined,
                        层级,
                        子项: [],
                        父项: 分类.ID,
                        领域: state.ID,
                      };
                      插入前置子块({
                        dataType: "dom",
                        data: TSX2HTML(<事项DOM 事项={新事项} />),
                        parentID: 文档ID,
                      });
                    });
                  }}
                />
                <Button
                  icon={<UndoOutlined />}
                  type="link"
                  onClick={加载数据}
                />
              </>
            ),
          },
        ]}
        dataSource={state.分类}
        expandable={{
          expandedRowRender: () => {
            return <Table<I事项> columns={列配置} dataSource={事项数据} />;
          },
        }}
      />
    </>
  );
}

export default 领域;
