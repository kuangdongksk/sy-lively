import { createStyles } from "antd-style";

export const useAppStyle = createStyles(({ token }) => {
  return {
    App: {
      height: "100%",
    },
    侧栏: {
      width: 150,
      background: token.colorBgContainer,
    },
    logo: {
      height: 32,
      margin: 16,
      background: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      textAlign: "center",
    },
    主体: {},
    内容: {
      padding: 24,
      margin: 24,
      minHeight: 280,
      background: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
    },
  };
});
