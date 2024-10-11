import { createStyles } from "antd-style";

export const use事项样式 = createStyles(({ token, css }) => {
  token;
  css;
  return {
    事项: {
      display: "flex",
      alignItems: "center",
      // justifyContent: "center",
    },
    标题: {
      marginRight: "36px",
      display: "flex",
      flex: "3",
      maxWidth: "300px",
      "&:hover": {
        color: `#c2a8a7 !important`,
      },
    },
    id文本: {
      fontFamily: "Courier, monospace",
    },
    程度: {},
    选择器: {
      width: "60px",
    },

    时间: {
      flex: "3",
    },
  };
});
