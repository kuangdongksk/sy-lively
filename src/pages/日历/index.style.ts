import { createStyles } from "antd-style";

export const useStyle = createStyles(({ css, token }) => {
  return {
    tableStyles: css`
      table {
        border-collapse: collapse;
      }

      td,
      th {
        border-top: 1px solid black; /* 为单元格顶部添加边框 */
        border-left: 1px solid black; /* 为单元格左侧添加边框 */
      }

      /* 移除第一行和第一列的边框 */
      tr:first-child td,
      td:first-child {
        border-top: none;
        border-left: none;
      }
    `,
    日历: {},
    天: {
      margin: "0.5em",
      borderRadius: token.borderRadius,
      ":hover": {
        backgroundColor: "var(--b3-list-hover)",
      },
    },
    天头部: {
      display: "flex",
      justifyContent: "space-between",
    },
  };
});
