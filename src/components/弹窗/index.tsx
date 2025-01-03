import { isRecord } from "@/utils/类型判断";
import { Modal } from "antd";
import {
  forwardRef,
  ReactNode,
  Ref,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

export interface I弹窗Ref<T弹窗标识> {
  打开弹窗: (弹窗状态: T弹窗标识) => void;
  关闭弹窗: () => void;
}
export interface I弹窗Props<T弹窗标识 extends string | number | symbol> {
  底部按钮?: boolean;
  内容?: Record<T弹窗标识, ReactNode>;
  zIndex?: number;
  确定回调?: () => void | Promise<void>;
  取消回调?: () => void | Promise<void>;
}

function O弹窗<T弹窗标识 extends string>(
  props: I弹窗Props<T弹窗标识>,
  ref: Ref<I弹窗Ref<T弹窗标识>>
) {
  const { 底部按钮 = true, 内容, zIndex, 确定回调, 取消回调 } = props;

  const [弹窗标识, 令弹窗标识为] = useState<T弹窗标识>(undefined);

  useImperativeHandle(ref, () => {
    return {
      打开弹窗: 令弹窗标识为,
      关闭弹窗: () => 令弹窗标识为(undefined),
    };
  });

  const 表单内容 = useMemo(() => {
    if (isRecord<T弹窗标识, object>(内容, "object")) {
      return <>{内容?.[弹窗标识]}</>;
    }
    return <></>;
  }, [内容, 弹窗标识]);

  return (
    <Modal
      open={弹窗标识 !== undefined}
      zIndex={zIndex}
      onClose={async () => {
        令弹窗标识为(undefined);
      }}
      onCancel={async () => {
        await 取消回调?.();
        令弹窗标识为(undefined);
      }}
      onOk={async () => {
        await 确定回调?.();
        令弹窗标识为(undefined);
      }}
      footer={底部按钮}
    >
      {表单内容}
    </Modal>
  );
}

const 弹窗 = forwardRef(O弹窗) as <T弹窗标识 extends string | number | symbol>(
  props: I弹窗Props<T弹窗标识> & {
    ref?: Ref<I弹窗Ref<T弹窗标识>>;
  }
) => ReturnType<typeof O弹窗>;
export default 弹窗;
