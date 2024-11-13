import SQL助手 from "@/class/SQL助手";
import { I增改查弹窗表单Ref } from "@/components/增改查弹窗表单";
import { 思源协议 } from "@/constant/系统码";
import { I分类, I领域 } from "@/types/喧嚣/事项";
import 事项表格 from "@/业务组件/表格/事项表格";
import { Tabs } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import 分类表单 from "../../../业务组件/表单/分类表单";

const 所有 = "所有";

function 领域详情() {
  const 分类表单Ref = useRef<I增改查弹窗表单Ref>(null);
  const { state } = useLocation() as { state: I领域 };

  const [分类, 令分类为] = useState<I分类[]>([]);

  const [页签键, 令页签键为] = useState(所有);

  const 加载分类 = async () => {
    const data = await SQL助手.获取指定领域下的分类(state.ID);
    令分类为(data);
  };

  useEffect(() => {
    加载分类();
  }, [state.ID]);

  const 标题 = useMemo(() => {
    return 页签键 === 所有 ? (
      "所有"
    ) : (
      <a href={思源协议 + 页签键} data-type="block-ref" data-id={页签键}>
        {分类.find((item) => item.ID === 页签键)?.名称}
      </a>
    );
  }, [state.ID, 页签键]);

  return (
    <>
      <Tabs
        type="editable-card"
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
          if (action === "add") {
            分类表单Ref.current?.令表单状态为("添加");
          }
        }}
      />
      <事项表格
        标题={标题}
        参数={{ ID: 页签键 === 所有 ? state.ID : 页签键 }}
        获取事项列表={async (params) => {
          const { ID, 版本: _版本 } = params;
          const data = await SQL助手.获取指定分类下的事项(ID);
          return data;
        }}
        新建事项={(事项Ref) => {
          事项Ref.current.令表单状态为("添加");
          事项Ref.current.令表单值为({
            领域分类: [state.ID, 页签键 === 所有 ? state.默认分类 : 页签键],
          });
        }}
      />

      <分类表单 ref={分类表单Ref} 领域={state} 完成回调={加载分类} />
    </>
  );
}

export default 领域详情;
