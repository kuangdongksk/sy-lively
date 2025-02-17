import { Button } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";
import { EBtnClass } from "@/components/base/sy/按钮";
import styles from "./index.module.less";

function 错误页面() {
  const 导航到 = useNavigate();
  const error = useRouteError() as {
    data: string;
  };

  console.log("~ ErrorPage ~ error:", error);

  return (
    <div id="error-page" className={styles.错误页面}>
      <h1>页面出错了！!</h1>
      <p>{decodeURI(error.data)}</p>

      <Button className={EBtnClass.默认} onClick={() => 导航到("/主页")}>
        返回主页
      </Button>
    </div>
  );
}
export default 错误页面;
