import { createStyles } from "antd-style";

export const use事项样式 = createStyles(({ token, css }) => {
  console.log("🚀 ~ constuse事项样式=createStyles ~  token, css:", token, css);

  return {
    事项: {
      display: "flex",
      flexDirection: "column",
    },
    标题: {},
    id文本: {
      fontFamily: "Courier, monospace",
    },
  };
});
