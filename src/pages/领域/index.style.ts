import { createStyles } from "antd-style";

export const 领域页面样式 = createStyles(() => {
  return {
    领域: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      columnGap: "18px",
      rowGap: "12px",
      alignItems: "center",
    },
  };
});
