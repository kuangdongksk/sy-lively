import SQL助手 from "@/class/SQL助手";
import { T弹窗状态 } from "@/components/弹窗表单";
import { 思源协议 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { 用户设置Atom } from "@/store/用户设置";
import { I事项, I分类, I领域 } from "@/types/喧嚣";
import 事项表单 from "@/业务组件/表单/事项表单";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { EditableProTable } from "@ant-design/pro-components";
import { Button, message, Tabs } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import 分类表单 from "../../../业务组件/表单/分类表单";
import 删除事项 from "../components/删除事项";
import { 列配置 } from "../constant";
import { 新建事项块, 时间格式处理, 更新事项块 } from "./tools";

const 所有 = "所有";

function 领域详情() {
  const [用户设置] = useAtom(用户设置Atom);

  const { state } = useLocation() as {
    state: I领域;
  };

  const [分类, 令分类为] = useState<I分类[]>([]);
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);

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

      <EditableProTable<I事项>
        columns={[
          ...列配置,
          {
            title: "操作",
            valueType: "option",
            fixed: "right",
            render: (_text, record) => [
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
        rowKey="ID"
        toolbar={{
          actions: [
            <事项表单
              触发器={<Button>新建</Button>}
              默认领域分类={[
                state.ID,
                页签键 === 所有 ? state.默认分类 : 页签键,
              ]}
            />,
          ],
        }}
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
            // 如果开始时间和结束时间不为空，且开始时间大于结束时间，则提示错误
            if (dayjs(事项.开始时间).isAfter(dayjs(事项.结束时间))) {
              message.error("开始时间不能大于结束时间！", 5);
              return;
            }
            时间格式处理(事项);

            if (事项.分类ID === "" || 事项.分类ID === undefined) {
              message.error(
                <>
                  P001：未指定默认分类。请查看
                  <a
                    href="https://github.com/kuangdongksk/sy-lively/wiki/%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF#p001%E6%9C%AA%E6%8C%87%E5%AE%9A%E9%BB%98%E8%AE%A4%E5%88%86%E7%B1%BB"
                    target="_blank"
                  >
                    解决方案
                  </a>
                  ！
                </>,
                5
              );
              return;
            }
            const 是新建的 = 事项.更新时间 === 事项.创建时间;

            if (是新建的) {
              await 新建事项块(事项, 用户设置);
            } else {
              await 更新事项块(事项);
            }
          },
        }}
        request={async () => {
          const ID = 页签键 === 所有 ? state.ID : 页签键;
          const data = await SQL助手.获取指定分类下的事项(ID);
          return { data, success: true };
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
