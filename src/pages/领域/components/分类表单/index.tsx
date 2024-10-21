import 弹窗表单, { T弹窗状态 } from "@/components/弹窗表单";
import { useState } from "react";

function 分类表单() {
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);

  return (
    <弹窗表单
      弹窗标题={弹窗状态 + "分类"}
      弹窗状态={弹窗状态}
      表单配置={{
        initialValues: undefined,
      }}
      表单内容={<></>}
      弹窗确认={function (): void {
        throw new Error("Function not implemented.");
      }}
      弹窗取消={function (): void {
        throw new Error("Function not implemented.");
      }}
      提交表单={function (value: unknown): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
