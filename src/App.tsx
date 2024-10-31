import { ConfigProvider } from "antd";
import { ThemeProvider } from "antd-style";
import zhCN from "antd/locale/zh_CN";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { E持久化键 } from "./constant/系统码";
import router from "./router";
import { 亮色主题 } from "./theme/亮色";
import { 暗色主题 } from "./theme/暗色";

export interface IAppProps {
  加载: (键: E持久化键) => Promise<any>;
  保存: (键: E持久化键, 数据: any) => Promise<void>;
}

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
