import { theme, ThemeConfig } from "antd";

export const 亮色主题: ThemeConfig = {
  token: {
    colorPrimary: "#e7bdbd",
    colorInfo: "#e7bdbd",
    colorTextBase: "#3d2e2e",
    colorBgBase: "#ffffff",
    colorSuccess: "#9bc188",
    colorWarning: "#d3ba8a",
    colorError: "#ff8486",
    wireframe: true,
    borderRadius: 10,
    sizeStep: 4,
  },
  components: {
    Layout: {
      headerBg: "var(--b3-theme-surface)",
    },
  },
  algorithm: theme.defaultAlgorithm,
};
