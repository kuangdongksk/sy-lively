import { 卡片块 } from "@/class/卡片/卡片块";
import { useStyle } from "@/components/增改查弹窗表单/index.style";
import { 生成块ID } from "@/utils/DOM";
import 领域分类 from "@/业务组件/表单项/领域分类";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, message, Select, Space } from "antd";
import { pinyin } from "pinyin-pro";
import { useState } from "react";
import "@/style/global.less";

export interface I卡片表单Props {}

function 卡片表单(props: I卡片表单Props) {
  const {} = props;
  const { styles } = useStyle();
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
        描述: "请保持外层的超级块存在，即该块和标题块同时存在",
      }}
      onFinish={async (value: {
        标题: string;
        描述: string;
        别名: string[];
        领域分类: string[];
      }) => {
        const { 标题, 别名 = [], 领域分类 } = value;

        const ID = 生成块ID();

        await 卡片块.新建卡片({
          ...value,
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
          领域分类: 领域分类,
        });
        message.success("新建卡片成功");
      }}
    >
      <Form.Item label="标题" name="标题" required>
        <Input />
      </Form.Item>

      <Form.Item label="描述" name="描述" required>
        <Input />
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
                  placeholder="请输入别名"
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={添加别名}>
                  添加
                </Button>
              </Space>
            </>
          )}
        />
      </Form.Item>

      <领域分类 表单状态={"添加"} />

      <Form.Item style={{ textAlign: "center" }}>
        <Button htmlType="submit" type="primary">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
}
export default 卡片表单;
