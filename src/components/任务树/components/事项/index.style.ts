import { createStyles } from "antd-style";

export const use事项样式 = createStyles(({ token, css }) => {
  console.log("🚀 ~ constuse事项样式=createStyles ~  token, css:", token, css);

  return {
    事项: {
      display: "flex",
      alignItems: "center",
      // justifyContent: "center",
    },
    标题: {
      marginRight: "36px",
    },
    id文本: {
      fontFamily: "Courier, monospace",
    },
    选择器: {
      width: "60px",
    },
  };
});
