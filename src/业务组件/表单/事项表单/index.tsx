import { OptionsHelper } from "@/class/OptionsHelper";
import 增改查弹窗表单, {
  I增改查弹窗表单Ref,
  T增改查,
} from "@/components/增改查弹窗表单";
import { E事项状态, E提醒 } from "@/constant/状态配置";
import { E时间格式化 } from "@/constant/配置常量";
import { 用户设置Atom } from "@/store/用户设置";
import { 生成事项 } from "@/tools/事项/事项";
import {
  插入到日记,
  新建事项块,
  新建事项文档,
  更新事项块,
} from "@/tools/事项/事项块";
import { I事项, T层级 } from "@/types/喧嚣/事项";
import Cron输入 from "@/业务组件/表单项/Cron输入";
import { E按钮类型 } from "@/基础组件/按钮";
import { Button, Form, Input, message, Select } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { forwardRef, Ref, useImperativeHandle, useRef, useState } from "react";
import 起止时间 from "../../表单项/起止时间";
import 领域分类 from "../../表单项/领域分类";

export interface I事项表单Props {
  事项?: I事项;
  完成回调?: () => void | Promise<void>;
}

function O事项表单(props: I事项表单Props, ref: Ref<I增改查弹窗表单Ref>) {
  const [用户设置] = useAtom(用户设置Atom);
  const 初始值 = {
    名称: dayjs().format(E时间格式化.思源时间) + " 未命名事项",
    状态: E事项状态.未开始,
    重要程度: 5,
    紧急程度: 5,
    提醒: E提醒.不提醒,
    重复: "u不重复",
    单开一页: false,
  };

  const { 事项, 完成回调 } = props;
  const 表单Ref = useRef<I增改查弹窗表单Ref>(null);

  const [展开更多, 令展开更多为] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      令表单状态为: (状态: T增改查) => {
        if (状态 === "添加") {
          表单Ref.current?.令表单值为(初始值);
        }
        表单Ref.current?.令表单状态为(状态);
      },
      令表单值为: (事项初始值: Partial<I事项>) => {
        表单Ref.current?.令表单值为({
          ...初始值,
          ...事项初始值,
        });
      },
    };
  });

  return (
    <增改查弹窗表单
      ref={表单Ref}
      弹窗主题="事项"
      表单内容={(表单状态) => {
        return (
          <>
            <Form.Item name="名称" label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="状态" label="状态">
              <Select options={OptionsHelper.状态} />
            </Form.Item>

            <领域分类 表单状态={表单状态} />
            <起止时间 />
            <Form.Item name="提醒" label="提醒">
              <Select options={OptionsHelper.提醒} />
            </Form.Item>

            <Cron输入 />

            <Form.Item>
              <Button
                className={E按钮类型.文本}
                onClick={() => 令展开更多为(!展开更多)}
              >
                {展开更多 ? "收起" : "展开更多"}
              </Button>
            </Form.Item>

            <Form.Item name="紧急程度" label="紧急程度" hidden={!展开更多}>
              <Select options={OptionsHelper.程度} />
            </Form.Item>
            <Form.Item name="重要程度" label="重要程度" hidden={!展开更多}>
              <Select options={OptionsHelper.程度} />
            </Form.Item>
            <Form.Item name="单开一页" label="单开一页" valuePropName="checked">
              <Checkbox disabled={表单状态 !== "添加"}>
                为该事项创建一个文档
              </Checkbox>
            </Form.Item>
          </>
        );
      }}
      提交表单={async (value, 表单状态) => {
        const { 领域分类, 起止时间 } = value;
        const [领域ID, 分类ID] = 领域分类;
        const [开始时间, 结束时间] = 起止时间 ?? [];

        let 新事项 = {
          ...事项,
          ...value,
          层级: 1 as T层级,
          父项ID: 分类ID,
          分类ID,
          领域ID,
          笔记本ID: 用户设置.笔记本ID,
          开始时间: 开始时间
            ? dayjs(开始时间).format(E时间格式化.思源时间)
            : undefined,
          结束时间: 结束时间
            ? dayjs(结束时间).format(E时间格式化.思源时间)
            : undefined,
          更新时间: dayjs().format(E时间格式化.思源时间),
        };

        const 是新建的 = 表单状态 === "添加";
        delete 新事项.领域分类;
        delete 新事项.起止时间;

        if (是新建的) {
          新事项 = 生成事项(新事项);
          新事项.单开一页
            ? await 新建事项文档(新事项)
            : await 新建事项块(新事项);

          await 插入到日记(新事项.ID, 用户设置.笔记本ID);
          message.success("添加成功");
        } else {
          await 更新事项块(新事项);
          message.success("更新成功");
        }
        完成回调 && 完成回调();
      }}
    />
  );
}

const 事项表单 = forwardRef(O事项表单);

export default 事项表单;
