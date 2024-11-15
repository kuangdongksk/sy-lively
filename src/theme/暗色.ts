import { ThemeConfig } from "antd";
import { 公共配置 } from ".";

// https://ant-design.antgroup.com/theme-editor-cn#component-color
export const 暗色主题: ThemeConfig = {
  token: {
    borderRadius: 10,
    sizeStep: 4,
    wireframe: true,
  },
  components: {
    Alert: 公共配置,
    App: 公共配置,
    Badge: { ...公共配置, colorError: "var(--b3-theme-error)" },
    Button: {
      ...公共配置,
    },
    Calendar: {
      ...公共配置,
    },
    Card: {
      ...公共配置,
      colorBgContainer: "var(--b3-theme-surface-light)",
    },
    Cascader: {
      ...公共配置,
    },
    Checkbox: {
      ...公共配置,
    },
    Collapse: {
      ...公共配置,
    },
    DatePicker: {
      ...公共配置,
    },
    Dropdown: {
      ...公共配置,
    },
    Form: {
      ...公共配置,
      labelColor: "var(--b3-theme-on-surface)",
    },
    Input: {
      ...公共配置,
    },
    InputNumber: {
      ...公共配置,
    },
    Layout: {
      ...公共配置,
      headerBg: "var(--b3-theme-background-light)",
      siderBg: "var(--b3-theme-background)",
      footerBg: "var(--b3-theme-background-light)",
      bodyBg: "var(--b3-theme-surface)",
    },
    List: {
      ...公共配置,
      headerBg: "var(--b3-theme-surface)",
      footerBg: "var(--b3-theme-background)",
    },
    Menu: {
      ...公共配置,
      itemBg: "var(--b3-theme-background)",
      itemHoverBg: "var(--b3-list-hover)",
      itemSelectedBg: "var(--b3-list-hover)",
      itemSelectedColor: "var(--b3-theme-on-background)",
    },
    Message: {
      ...公共配置,
    },
    Modal: {
      ...公共配置,
      headerBg: "var(--b3-theme-background)",
      contentBg: "var(--b3-theme-surface)",
      footerBg: "var(--b3-theme-background)",
    },
    Pagination: {
      ...公共配置,
    },
    Progress: {
      ...公共配置,
    },
    Segmented: {
      ...公共配置,
    },
    Select: {
      ...公共配置,
      selectorBg: "var(--b3-list-hover)",
      optionSelectedBg: "var(--b3-list-hover)",
      optionSelectedColor: "var(--b3-theme-on-background)",
    },
    Table: {
      ...公共配置,
      bodySortBg: "var(--b3-theme-surface-lighter)",
      colorFillAlter: "var(--b3-theme-surface-lighter)",
      headerBg: "var(--b3-theme-surface-light)",
      headerColor: "var(--b3-theme-on-surface)",
      headerFilterHoverBg: "var(--b3-theme-surface-lighter)",
      headerSortActiveBg: "var(--b3-theme-surface-lighter)",
      headerSortHoverBg: "var(--b3-theme-surface-lighter)",
      rowHoverBg: "var(--b3-list-hover)",
    },
    Tabs: {
      ...公共配置,
      colorPrimary: "var(--b3-theme-on-surface)",
      itemActiveColor: "var(--b3-list-hover)",
      itemSelectedColor: "var(--b3-list-hover)",
    },
    Tag: {
      ...公共配置,
    },
    Tooltip: {
      ...公共配置,
    },
  },
};
