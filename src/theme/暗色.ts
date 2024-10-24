import { theme, ThemeConfig } from "antd";

// https://ant-design.antgroup.com/theme-editor-cn#component-color
export const 暗色主题: ThemeConfig = {
  token: {
    colorBgBase: "#2f3437",
    colorTextBase: "#acacac",
    colorPrimary: "#b57e7e",
    colorInfo: "#b57e7e",
    colorSuccess: "#a1c191",
    colorWarning: "#ca9b3d",
    borderRadius: 10,
    sizeStep: 4,
    wireframe: true,
  },
  algorithm: theme.darkAlgorithm,
  components: {
    Layout: {
      headerBg: "#2f3437",
    },
  },
};
