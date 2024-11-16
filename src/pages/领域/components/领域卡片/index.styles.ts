import { createStyles } from "antd-style";

export const useStyle = createStyles(({ css, token }) => {
  return {
    卡片: css`
      height: 220px;
      border-radius: ${token.borderRadius}px;
      border: 1px solid var(--b3-theme-primary);
      padding: 12px;
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
      padding: "0px 8px !important",
      overflow: "auto",
    },
    卡片内容中间: {
      overflow: "auto",
    },
  };
});
