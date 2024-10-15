import { E常用SQL, SQL, 根据ID获取块 } from "@/API/SQL";
import { 插入前置子块, 更新块, 获取块Kramdown源码 } from "@/API/块数据";
import 事项DOM from "@/components/模板/事项DOM";
import { E事项状态 } from "@/constant/状态配置";
import { 用户设置Atom } from "@/jotai/用户设置";
import { 获取笔记本下的对应日期的日记文档 } from "@/pages/设置/tools";
import { markDown创建, TSX2HTML, 生成块ID } from "@/utils/DOM";
import { stringArr2string } from "@/utils/拼接与拆解";
import { DeleteOutlined, EditOutlined, UndoOutlined } from "@ant-design/icons";
import { EditableProTable } from "@ant-design/pro-components";
import { Button, Tabs } from "antd";
import $ from "cash-dom";
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
            fixed: "right",
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
            const id = 生成块ID();
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
            const 容器 = document.createElement("div");
            let 块ID;
            let 块DOM;
            if (事项.更新时间 !== 事项.创建时间) {
              块ID = 事项.id;
            } else {
              const { id: 日记文档ID } = await 获取笔记本下的对应日期的日记文档(
                用户设置.笔记本ID,
                dayjs()
              );

              await 插入前置子块({
                dataType: "markdown",
                data: markDown创建(事项),
                parentID: 日记文档ID,
              }).then(({ data }) => {
                console.log("🚀 ~ onSave: ~ data:", data);
                块ID = data[0].doOperations[0].id;

                const html = data[0].doOperations[0].data;
                容器.innerHTML = html;
                console.log(
                  "🚀 ~ onSave: ~ $(容器).find('[data-type]'):",
                  $(容器).find(".p")
                );
              });
            }

            console.log(
              "🚀 ~ onSave: ~ 获取块Kramdown源码(块ID):",
              await 获取块Kramdown源码(块ID)
            );

            console.log(
              "🚀 ~ onSave: ~ 根据ID获取块(块ID):",
              await 根据ID获取块(块ID)
            );

            const 新的事项 = { ...事项, id: 块ID };

            // await 更新块({
            //   id: 块ID,
            //   data: TSX2HTML(<事项DOM 事项={新的事项} />),
            //   dataType: "dom",
            // });

            await 更新块({
              id: 块ID,
              data: `{{{row\n未命名23[i36ib3]()重要程度999 紧急程度5 开始时间2024-10-15 17:34:03结束时间2024-10-15 18:34:03
{: id="20241015160845-mnb7txf" updated="20241015160845"}\n\n事项详情...
{: updated="20241015160845" id="20241015160845-rc18rtf"}\n\n}}}
{: custom-plugin-lively-things="&#123;&quot;名称&quot;:&quot;未命名23&quot;,&quot;重要程度&quot;:5,&quot;紧急程度&quot;:999,&quot;开始时间&quot;:1728984843034,&quot;结束时间&quot;:1728988443034,&quot;状态&quot;:&quot;u未开始&quot;,&quot;层级&quot;:1,&quot;id&quot;:&quot;20241015173405-vi36ib3&quot;,&quot;key&quot;:&quot;u未开始$分$未命名$分$20241015173403-9HKPpZ2&quot;,&quot;子项&quot;:[],&quot;父项&quot;:&quot;20241014171826-82ny1ia&quot;,&quot;领域&quot;:&quot;20241014171825-lc34u7z&quot;,&quot;创建时间&quot;:1728984843034,&quot;更新时间&quot;:1728985699714,&quot;index&quot;:0&#125;" id="20241015173405-vi36ib3" updated="20241015160845"}`,
              dataType: "markdown",
            });
          },
        }}
      />
    </>
  );
}

export default 领域;
