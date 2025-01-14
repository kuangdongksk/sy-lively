import { EBtnClass } from "@/components/base/sy/按钮";
import { Button, Form, Modal } from "antd";
import { forwardRef, Ref, useImperativeHandle, useState } from "react";
import styles from "./index.module.less";

export type T增改查 = "添加" | "编辑" | "查看" | undefined;

export interface I增改查弹窗表单Props {
  弹窗主题: string;

  表单内容: (弹窗状态: T增改查) => React.ReactNode;
  确认按钮文本?: string;
  弹窗取消?: (() => void) | (() => Promise<void>);
  提交表单: (value: any, 弹窗状态: T增改查) => void | Promise<void>;
}

export interface I增改查弹窗表单Ref {
  令表单状态为: (表单状态: T增改查) => void;
  令表单值为: (表单值: any) => void;
}

function O增改查弹窗表单(
  props: I增改查弹窗表单Props,
  ref: Ref<I增改查弹窗表单Ref>
) {
  const {
    弹窗主题,
    表单内容,
    确认按钮文本 = "确定",
    弹窗取消,
    提交表单,
  } = props;

  const [表单状态, 令表单状态为] = useState<T增改查>();
  const [表单值, 令表单值为] = useState<any>();

  useImperativeHandle(ref, () => {
    return { 令表单状态为, 令表单值为 };
  });

  return (
    <Modal
      footer={false}
      open={表单状态 !== undefined}
      title={表单状态 + 弹窗主题}
      onCancel={async () => {
        await 弹窗取消?.();
        令表单状态为(undefined);
      }}
      destroyOnClose
    >
      <Form
        className={styles.表单}
        labelCol={{ span: 5 }}
        initialValues={表单值}
        variant={表单状态 === "查看" ? "borderless" : "outlined"}
        validateTrigger="onBlur"
        onFinish={async (value) => {
          await 提交表单(value, 表单状态);
          令表单状态为(undefined);
        }}
      >
        {表单内容(表单状态)}
        {表单状态 !== "查看" && (
          <Form.Item
            style={{
              textAlign: "center",
            }}
          >
            <Button
              className={styles.取消按钮 + " " + EBtnClass.取消}
              onClick={async () => {
                await 弹窗取消?.();
                令表单状态为(undefined);
              }}
            >
              取消
            </Button>
            <Button className={EBtnClass.默认} htmlType="submit">
              {确认按钮文本}
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

const 增改查弹窗表单 = forwardRef(O增改查弹窗表单) as (
  props: I增改查弹窗表单Props & { ref?: Ref<I增改查弹窗表单Ref> }
) => ReturnType<typeof O增改查弹窗表单>;
export default 增改查弹窗表单;
