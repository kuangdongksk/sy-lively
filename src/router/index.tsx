import WhiteBoard from "@/module/whiteBoard";
import WorkFlow from "@/module/workFlow";
import WorkFlowDetail from "@/module/workFlow/pages/WorkflowDetail";
import App from "@/pages";
import 主页 from "@/pages/主页";
import 关系 from "@/pages/关系";
import 日历 from "@/pages/日历";
import 设置 from "@/pages/设置";
import 错误页面 from "@/pages/错误页面";
import 领域 from "@/pages/领域";
import 领域详情 from "@/pages/领域/详情";
import { createHashRouter } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <错误页面 />,
    children: [
      {
        path: "主页",
        element: <主页 />,
      },
      {
        path: "领域",
        children: [
          {
            index: true,
            element: <领域 />,
          },
          {
            path: "领域详情",
            element: <领域详情 />,
          },
        ],
      },
      {
        path: "白板",
        element: <WhiteBoard />,
      },
      {
        path: "工作流",
        children: [
          {
            index: true,
            element: <WorkFlow />,
          },
          {
            path: "detail",
            element: <WorkFlowDetail />,
          },
        ],
      },
      {
        path: "关系",
        element: <关系 />,
      },
      {
        path: "卡片",
        element: <></>,
      },
      {
        path: "日历",
        element: <日历 />,
      },
      {
        path: "设置",
        element: <设置 />,
      },
    ],
  },
]);
export default router;
