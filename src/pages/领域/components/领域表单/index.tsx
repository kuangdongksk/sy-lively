import { 设置块属性 } from "@/API/块数据";
import CL文档 from "@/API/文档";
import 弹窗表单, { T弹窗状态 } from "@/components/弹窗表单";
import { E块属性名称 } from "@/constant/系统码";
import { 用户设置Atom } from "@/store/用户设置";
import { 更新用户设置 } from "@/tools/设置";
import { Checkbox, Form, Input } from "antd";
import { useAtom } from "jotai";

export interface I领域表单Props {
  弹窗状态: T弹窗状态;

  令弹窗状态为: (弹窗状态: T弹窗状态) => void;

  完成回调?: () => void | Promise<void>;
}

function 领域表单(props: I领域表单Props) {
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const { 弹窗状态, 令弹窗状态为, 完成回调 } = props;

  return (
    <弹窗表单
      弹窗标题={"领域"}
      弹窗状态={弹窗状态}
      表单配置={{
        initialValues: undefined,
      }}
      表单内容={
        <>
          <Form.Item name="领域名称" label="领域名称" required>
            <Input type="text" />
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
      }
      确认按钮文本="添加领域"
      弹窗确认={() => 令弹窗状态为(undefined)}
      弹窗取消={() => 令弹窗状态为(undefined)}
      提交表单={async (value: {
        领域名称: string;
        领域描述: string;
        设置为默认领域: boolean;
      }) => {
        const { 领域名称, 领域描述, 设置为默认领域 } = value;
        const { data: 领域文档ID } = await CL文档.通过Markdown创建(
          用户设置.笔记本ID,
          `/领域/${领域名称}`,
          ""
        );

        if (设置为默认领域) {
          await 更新用户设置({
            当前用户设置: 用户设置,
            更改的用户设置: { 默认领域: 领域文档ID },
            设置用户设置,
          });
        }

        const { data: 分类文档ID } = await CL文档.通过Markdown创建(
          用户设置.笔记本ID,
          `/领域/${value.领域名称}/杂项`,
          ""
        );

        await 设置块属性({
          id: 领域文档ID,
          attrs: {
            [E块属性名称.领域]: JSON.stringify({
              名称: 领域名称,
              ID: 领域文档ID,
              描述: 领域描述,
              笔记本ID: 用户设置.笔记本ID,
              默认分类: 分类文档ID,
            }),
          },
        });

        await 设置块属性({
          id: 分类文档ID,
          attrs: {
            [E块属性名称.分类]: JSON.stringify({
              名称: "杂项",
              ID: 分类文档ID,
              描述: "杂项",
              领域ID: 领域文档ID,
            }),
          },
        });
        await 完成回调();
      }}
    />
  );
}
export default 领域表单;
