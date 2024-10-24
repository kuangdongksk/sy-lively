import { Button, Form, Modal } from "antd";
import { ReactNode } from "react";
import { 弹窗表单样式 } from "./index.style";

export type T弹窗状态 = "添加" | "编辑" | undefined;

export interface I弹窗表单Props<TFormValue> {
  弹窗标题: string;
  弹窗状态: T弹窗状态;
  表单配置: {
    initialValues: TFormValue;
  };
  表单内容: ReactNode;
  确认按钮文本?: string;
  //
  弹窗确认?: (() => void) | (() => Promise<void>);
  弹窗取消: (() => void) | (() => Promise<void>);
  提交表单:
    | ((value: TFormValue) => void)
    | ((value: TFormValue) => Promise<void>);
}

function 弹窗表单<TFormValue>(props: I弹窗表单Props<TFormValue>) {
  const { styles } = 弹窗表单样式();
  const {
    弹窗标题,
    弹窗状态,
    表单配置: { initialValues },
    表单内容,
    确认按钮文本 = "确定",
    弹窗确认,
    弹窗取消,
    提交表单,
  } = props;

  return (
    <Modal
      footer={false}
      open={弹窗状态 !== undefined}
      title={弹窗状态 + 弹窗标题}
      onOk={弹窗确认}
      onCancel={弹窗取消}
    >
      <Form
        labelCol={{ span: 4 }}
        className={styles.表单}
        initialValues={initialValues}
        onFinish={async (value) => {
          await 提交表单(value);
          弹窗取消();
        }}
      >
        {表单内容}
        <Form.Item
          style={{
            textAlign: "center",
          }}
        >
          <Button type="primary" htmlType="submit">
            {确认按钮文本}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default 弹窗表单;
