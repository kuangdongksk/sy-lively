import { SY块 } from "@/class/思源/块";
import SY文档 from "@/class/思源/文档";
import 增改查弹窗表单, {
  I增改查弹窗表单Ref,
} from "@/components/增改查弹窗表单";
import { E块属性名称, EStoreKey } from "@/constant/系统码";
import { storeAtom } from "@/store";
import { 用户设置Atom } from "@/store/用户设置";
import { I分类, I领域 } from "@/types/喧嚣/事项";
import { Checkbox, Form, Input } from "antd";
import { useAtom } from "jotai";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

export interface I领域表单Props {
  完成回调?: () => void | Promise<void>;
}

function O领域表单(props: I领域表单Props, ref: Ref<I增改查弹窗表单Ref>) {
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const [持久化] = useAtom(storeAtom);

  const { 完成回调 } = props;
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
      弹窗主题={"领域"}
      表单内容={() => (
        <>
          <Form.Item
            name="领域名称"
            label="领域名称"
            rules={[{ required: true }]}
          >
            <Input type="text" maxLength={6} />
          </Form.Item>
          <Form.Item name="领域描述" label="领域描述">
            <Input.TextArea autoSize={{ minRows: 1 }} />
          </Form.Item>
          <Form.Item
            name="设置为默认领域"
            label="默认领域"
            valuePropName="checked"
          >
            <Checkbox>设置为默认领域</Checkbox>
          </Form.Item>
        </>
      )}
      确认按钮文本="添加领域"
      弹窗取消={() => 表单Ref.current?.令表单状态为(undefined)}
      提交表单={async (value: {
        领域名称: string;
        领域描述: string;
        设置为默认领域: boolean;
      }) => {
        const { 领域名称, 领域描述, 设置为默认领域 } = value;
        const { data: 领域文档ID } = await SY文档.通过Markdown创建(
          用户设置.笔记本ID,
          `/领域/${领域名称}`,
          ""
        );

        if (设置为默认领域) {
          await 持久化.save(EStoreKey.用户设置, {
            ...用户设置,
            默认领域: 领域文档ID,
          });

          设置用户设置({
            ...用户设置,
            默认领域: 领域文档ID,
          });
        }

        const { data: 分类文档ID } = await SY文档.通过Markdown创建(
          用户设置.笔记本ID,
          `/领域/${value.领域名称}/杂项`,
          ""
        );

        const 新的领域: I领域 = {
          ID: 领域文档ID,
          名称: 领域名称,
          描述: 领域描述,
          笔记本ID: 用户设置.笔记本ID,
          默认分类: 分类文档ID,
        };

        await SY块.设置块属性({
          id: 领域文档ID,
          attrs: {
            [E块属性名称.领域]: JSON.stringify(新的领域),
          },
        });

        const 分类: I分类 = {
          名称: "杂项",
          ID: 分类文档ID,
          描述: "杂项",
          领域ID: 领域文档ID,
          笔记本ID: 用户设置.笔记本ID,
        };

        await SY块.设置块属性({
          id: 分类文档ID,
          attrs: {
            [E块属性名称.分类]: JSON.stringify(分类),
          },
        });
        await 完成回调?.();
      }}
    />
  );
}

const 领域表单 = forwardRef(O领域表单);
export default 领域表单;
