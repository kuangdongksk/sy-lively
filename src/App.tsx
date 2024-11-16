import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { 主题 } from "./theme";

function App() {
  return (
    <React.StrictMode>
      <ConfigProvider locale={zhCN} theme={主题}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </React.StrictMode>
  );
}
export default App;
