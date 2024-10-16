import { Button } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";
import { useStyle } from "./index.styles";

function 错误页面() {
  const 导航到 = useNavigate();
  const error = useRouteError() as {
    data: string;
  };

  const { styles } = useStyle();
  console.log("🚀 ~ ErrorPage ~ error:", error);

  return (
    <div id="error-page" className={styles.错误页面}>
      <h1>页面出错了！!</h1>
      <p>{decodeURI(error.data)}</p>

      <Button
        onClick={() => {
          导航到("/主页");
        }}
      >
        返回主页
      </Button>
    </div>
  );
}
export default 错误页面;
