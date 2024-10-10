import { createStyles } from "antd-style";

export const use事项样式 = createStyles(({ token, css }) => {
  return {
    事项: {
      display: "flex",
      alignItems: "center",
      // justifyContent: "center",
    },
    标题: {
      marginRight: "36px",
      display: "flex",
    },
    id文本: {
      fontFamily: "Courier, monospace",
    },
    选择器: {
      width: "60px",
    },
  };
});
