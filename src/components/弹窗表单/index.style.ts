import { createStyles } from "antd-style";

export const 弹窗表单样式 = createStyles(({ css }) => {
  return {
    表单: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .ant-form-item {
        width: 100%;
        .ant-form-item-row {
          width: 100%;
        }
      }
    `,
  };
});
