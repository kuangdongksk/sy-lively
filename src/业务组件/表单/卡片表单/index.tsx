import { 卡片块 } from "@/class/卡片/卡片块";
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
  message,
  Select,
  Space,
} from "antd";
import { pinyin } from "pinyin-pro";
import { useState } from "react";
import styles from "../../../components/增改查弹窗表单/index.module.less";

export interface I卡片表单Props {
  父ID: string;
  成功回调?: (文档ID: string, 卡片ID: string) => void;
}

function 卡片表单(props: I卡片表单Props) {
  const { 父ID: 卡片根文档ID, 成功回调 } = props;
  const [formCore] = Form.useForm();

  const [别名, 令别名为] = useState([]);
  const [name, setName] = useState("");

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
      initialValues={{
        标题: "卡片标题",
      }}
      onFinish={async (value: {
        标题: string;
        描述: string;
        别名: string[];
        嵌入日记: boolean;
        单开一页: boolean;
      }) => {
        const { 标题, 别名 = [], 单开一页 } = value;

        const ID = 生成块ID();

        const 最终ID = await 卡片块.新建卡片(
          {
            ...value,
            描述: "请保持外层的超级块存在，即该块和标题块同时存在",
            ID,
            标题ID: 生成块ID(),
            别名: [
              pinyin(标题, {
                pattern: "first",
                type: "array",
              })?.join(""),
              ID.slice(-7),
              ...别名,
            ],
            单开一页: 单开一页,
          },
          卡片根文档ID
        );

        成功回调?.(单开一页 ? 最终ID : 卡片根文档ID, 最终ID);
        message.success("新建卡片成功，即将跳转");
      }}
    >
      <Form.Item label="标题" name="标题" required>
        <Input className={E输入类型.默认} />
      </Form.Item>

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
