import { ConfigProvider } from "antd";
import { ThemeProvider } from "antd-style";
import zhCN from "antd/locale/zh_CN";
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { 暗色主题 } from "./theme/暗色";

function App() {
  return (
    <React.StrictMode>
      <ConfigProvider locale={zhCN}>
        <ThemeProvider
          theme={() => {
            return { ...暗色主题, colorPrimary: "var" };
          }}
        >
          <RouterProvider router={router} />
        </ThemeProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
export default App;
