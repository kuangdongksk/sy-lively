import SQLer from "@/class/SQLer";
import { T增改查 } from "@/components/增改查弹窗表单";
import { 用户设置Atom } from "@/store/用户设置";
import { I领域分类 } from "@/types/喧嚣/事项";
import { Cascader, Form } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export interface I领域分类Props {
  表单状态: T增改查;
}

function 领域分类(props: I领域分类Props) {
  const { 表单状态 } = props;
  const [用户设置] = useAtom(用户设置Atom);

  const [领域分类列表, 令领域分类列表为] = useState<I领域分类[]>([]);

  const 加载领域分类列表 = async () => {
    await SQLer.获取笔记本下的所有分类按领域(用户设置.笔记本ID).then(
      (data) => {
        令领域分类列表为(data);
      }
    );
  };

  useEffect(() => {
    加载领域分类列表();
  }, [用户设置]);

  return (
    <Form.Item
      name="领域分类"
      label="领域分类"
      rules={[
        { required: true, message: "请选择领域分类" },
        {
          type: "array",
          min: 2,
          message: "请选择分类",
        },
      ]}
      tooltip={
        <>
          请选择分类，P002：有分类未展示？ 查看
          <a
            href="https://github.com/kuangdongksk/sy-lively/wiki/%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF#p002%E6%9C%89%E5%88%86%E7%B1%BB%E6%9C%AA%E5%B1%95%E7%A4%BA"
            target="_blank"
          >
            解决方案
          </a>
        </>
      }
    >
      <Cascader
        disabled={表单状态 !== "添加"}
        expandTrigger="hover"
        options={领域分类列表.map((领域) => ({
          value: 领域.ID,
          label: 领域.名称,
          children: 领域.分类.map((分类) => ({
            value: 分类.ID,
            label: 分类.名称,
          })),
        }))}
      />
    </Form.Item>
  );
}
export default 领域分类;
