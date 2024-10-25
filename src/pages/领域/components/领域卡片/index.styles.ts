import { createStyles } from "antd-style";

export const useStyle = createStyles(({ css }) => {
  return {
    卡片: css`
      height: 220px;
      span {
        margin-right: 0.5em;
      }
      :hover {
        box-shadow: 0 0px 5px;
      }
    `,
    卡片标题: {
      fontSize: "14px",
    },
    卡片标题第一行: {
      fontSize: "16px",
      fontWeight: 500,
    },
    卡片内容: {
      overflowY: "scroll",
    },
    卡片内容头: {
      display: "flex",
      justifyContent: "space-between",
      position: "sticky",
      top: "0px",
    },
  };
});
