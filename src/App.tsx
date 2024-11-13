import { ConfigProvider } from "antd";
import { ThemeProvider } from "antd-style";
import zhCN from "antd/locale/zh_CN";
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { 亮色主题 } from "./theme/亮色";
import { 暗色主题 } from "./theme/暗色";

function App() {
  return (
    <React.StrictMode>
      <ConfigProvider locale={zhCN}>
        <ThemeProvider
          defaultThemeMode={"auto"}
          theme={(appearance) => {
            if (appearance === "light") return 亮色主题;
            return 暗色主题;
          }}
        >
          <RouterProvider router={router} />
        </ThemeProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
export default App;
