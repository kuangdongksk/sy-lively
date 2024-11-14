import { ConfigProvider } from "antd";
import { ThemeProvider } from "antd-style";
import zhCN from "antd/locale/zh_CN";
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return (
    <React.StrictMode>
      <ConfigProvider locale={zhCN}>
        <ThemeProvider defaultThemeMode={"auto"}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
export default App;
