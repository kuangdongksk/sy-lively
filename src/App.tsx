import { ConfigProvider } from "antd";
import { ThemeProvider } from "antd-style";
import zhCN from "antd/locale/zh_CN";
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { 亮色主题 } from "./theme/亮色";
import { 暗色主题 } from "./theme/暗色";
import { useAtom } from "jotai";
import { 持久化atom } from "./store";

export interface IAppProps {
  加载: (键: string) => void;
  保存: (键: string, 数据: any) => void;
}

function App(props: {
  加载: (键: string) => void;
  保存: (键: string, 数据: any) => void;
}) {
  const { 加载, 保存 } = props;

  const [, 设置持久化] = useAtom(持久化atom);

  useEffect(() => {
    设置持久化({ 加载, 保存 });
  }, [加载, 保存]);

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
