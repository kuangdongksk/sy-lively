import { 设置块属性 } from "@/API/块数据";
import CL文档 from "@/API/文档";
import 增改查弹窗表单, {
  I增改查弹窗表单Ref,
} from "@/components/增改查弹窗表单";
import { E块属性名称 } from "@/constant/系统码";
import { 用户设置Atom } from "@/store/用户设置";
import { I分类, I领域 } from "@/types/喧嚣/事项";
import { Checkbox, Form, Input } from "antd";
import { useAtom } from "jotai";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

export interface I分类表单Props {
  领域: I领域;

  完成回调?: () => void | Promise<void>;
}

function O分类表单(props: I分类表单Props, ref: Ref<I增改查弹窗表单Ref>) {
  const [用户设置] = useAtom(用户设置Atom);
  const { 领域, 完成回调 } = props;
  const 表单Ref = useRef<I增改查弹窗表单Ref>(null);

  useImperativeHandle(ref, () => {
    return {
      令表单状态为: 表单Ref.current?.令表单状态为,
      令表单值为: 表单Ref.current?.令表单值为,
    };
  });

  return (
    <增改查弹窗表单
      ref={表单Ref}
      弹窗主题="分类"
      确认按钮文本="添加分类"
      表单内容={() => (
        <>
          <Form.Item name="分类名称" label="分类名称" required>
            <Input maxLength={6} />
          </Form.Item>
          <Form.Item name="分类描述" label="分类描述" required>
            <Input.TextArea autoSize={{ minRows: 1 }} />
          </Form.Item>
          <Form.Item
            name="设置为默认分类"
            label="默认分类"
            valuePropName="checked"
          >
            <Checkbox>设置为默认分类</Checkbox>
          </Form.Item>
        </>
      )}
      弹窗取消={() => 表单Ref.current?.令表单状态为(undefined)}
      提交表单={async (value: {
        分类名称: string;
        分类描述: string;
        设置为默认分类: boolean;
      }) => {
        const { 分类名称, 分类描述, 设置为默认分类 } = value;
        const { data: 分类文档ID } = await CL文档.通过Markdown创建(
          用户设置.笔记本ID,
          `/领域/${领域.名称}/${分类名称}`,
          ""
        );

        if (设置为默认分类) {
          const 新的领域: I领域 = {
            ...领域,
            默认分类: 分类文档ID,
          };
          await 设置块属性({
            id: 领域.ID,
            attrs: {
              [E块属性名称.领域]: JSON.stringify(新的领域),
            },
          });
        }

        const 分类: I分类 = {
          ID: 分类文档ID,
          领域ID: 领域.ID,
          笔记本ID: 用户设置.笔记本ID,
          名称: 分类名称,
          描述: 分类描述,
        };

        await 设置块属性({
          id: 分类文档ID,
          attrs: {
            [E块属性名称.分类]: JSON.stringify(分类),
          },
        });

        完成回调?.();
      }}
    />
  );
}
const 分类表单 = forwardRef(O分类表单);
export default 分类表单;
