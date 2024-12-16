import { 卡片块 } from "@/class/卡片/卡片块";
import { SY块 } from "@/class/思源/块";
import "@/style/global.less";
import { 生成块ID } from "@/tools/事项/事项";
import { E按钮类型 } from "@/基础组件/按钮";
import { E输入类型 } from "@/基础组件/输入";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Select,
  Space
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Protyle } from "siyuan";
import styles from "../../../components/增改查弹窗表单/index.module.less";

export interface I卡片表单Props {
  app: any;
  父ID: string;
  成功回调?: (文档ID: string, 卡片ID: string) => void;
}

function 卡片表单(props: I卡片表单Props) {
  const { app, 父ID: 卡片根文档ID, 成功回调 } = props;
  const editorRef = useRef<HTMLDivElement>(null);
  const protyleRef = useRef<Protyle | null>(null);
  const [formCore] = Form.useForm();

  const [别名, 令别名为] = useState([]);
  const [name, setName] = useState("");

  const 创建protyle = async () => {
    if (!editorRef.current) return;

    const blockID = 生成块ID();
    await SY块.插入后置子块({
      parentID: 卡片根文档ID,
      dataType: "markdown",
      data: 卡片块.生成卡片Kramdown({
        标题: "卡片标题",
        标题ID: 生成块ID(),
        ID: blockID,
      }),
    });

    protyleRef.current = new Protyle(app, editorRef.current, {
      blockId: blockID,
      // backlinkData: [],
      mode: "wysiwyg",
      rootId: 卡片根文档ID,
    });
  };

  useEffect(() => {
    创建protyle();
  }, []);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const 添加别名 = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (!name) {
      return;
    }
    令别名为([...别名, name]);
    setName("");
  };

  return (
    <Form
      className={styles.表单}
      form={formCore}
      labelCol={{ span: 6 }}
      onFinish={async (value: {
        别名: string[];
        嵌入日记: boolean;
        单开一页: boolean;
      }) => {
        // const { 别名 = [], 单开一页 } = value;
        // const ID = 生成块ID();
        // const 最终ID = await 卡片块.新建卡片(
        //   {
        //     ...value,
        //     ID,
        //     标题ID: 生成块ID(),
        //     别名: [
        //       pinyin(标题, {
        //         pattern: "first",
        //         type: "array",
        //       })?.join(""),
        //       ID.slice(-7),
        //       ...别名,
        //     ],
        //     单开一页: 单开一页,
        //   },
        //   卡片根文档ID
        // );
        // 成功回调?.(单开一页 ? 最终ID : 卡片根文档ID, 最终ID);
        // message.success("新建卡片成功，即将跳转");
      }}
    >
      <div id="protyle" ref={editorRef} />

      <Form.Item label="别名" name="别名" dependencies={["标题"]}>
        <Select
          mode="multiple"
          options={[
            ...别名.map((item) => ({
              label: item,
              value: item,
            })),
          ]}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Space style={{ padding: "0 8px 4px" }}>
                <Input
                  className={E输入类型.默认}
                  placeholder="请输入别名"
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button
                  className={E按钮类型.文本}
                  icon={<PlusOutlined />}
                  onClick={添加别名}
                >
                  添加
                </Button>
              </Space>
            </>
          )}
        />
      </Form.Item>

      {/* <Form.Item name="嵌入日记" label="嵌入日记" valuePropName="checked">
        <Checkbox>嵌入到当天的日记中</Checkbox>
      </Form.Item> */}

      <Form.Item name="单开一页" label="单开一页" valuePropName="checked">
        <Checkbox>为该卡片创建一个文档</Checkbox>
      </Form.Item>

      <Form.Item style={{ textAlign: "center" }}>
        <Button className={E按钮类型.默认} htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
}
export default 卡片表单;
