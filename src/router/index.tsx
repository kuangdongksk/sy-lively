import App from "@/App";
import 主页 from "@/pages/主页";
import 领域 from "@/pages/主页/领域";
import 日历 from "@/pages/日历";
import 设置 from "@/pages/设置";
import 错误页面 from "@/pages/错误页面";
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
        children: [
          {
            path: "领域",
            element: <领域 />,
            children: [
              {
                path: "详情",

              },
            ],
          },
        ],
      },
      {
        path: "日历",
        element: <日历 />,
      },
      {
        path: "设置",
        element: <设置 />,
      },
      {
        path: "领域",
        element: <领域 />,
      },
    ],
  },
]);
export default router;
