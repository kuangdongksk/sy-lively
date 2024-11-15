import { createStyles } from "antd-style";

export const useAppStyle = createStyles(({ token }) => {
  return {
    App: {
      height: "100%",
    },
    侧栏: {
      width: 150,
    },
    logo: {
      height: 32,
      margin: 16,
      borderRadius: token.borderRadiusLG,
      textAlign: "center",
    },
    主体: {},
    顶栏: {
      display: "flex",
      justifyContent: "space-between",
      padding: "24px 16px",
    },
    内容: {
      padding: 24,
      margin: 24,
      minHeight: 280,
      borderRadius: token.borderRadiusLG,
    },
  };
});
