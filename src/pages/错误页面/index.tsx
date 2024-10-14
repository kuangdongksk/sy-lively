import { Button } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";

function 错误页面() {
  const 导航到 = useNavigate();
  const error = useRouteError() as {
    data: string;
  };
  console.log("🚀 ~ ErrorPage ~ error:", error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{decodeURI(error.data)}</p>

      <Button
        onClick={() => {
          导航到("/");
        }}
      >
        返回主页
      </Button>
    </div>
  );
}
export default 错误页面;
