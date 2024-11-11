import { Progress } from "antd";

export interface I进度条Props {
  进度: number;
}

function 进度条(props: I进度条Props) {
  const { 进度 } = props;
  return (
    <Progress
      percent={进度 * 100}
      format={(percent) => `${percent.toFixed(2)}%`}
      status="active"
      strokeColor={{ from: "#ff8486", to: "#9bc188" }}
    />
  );
}
export default 进度条;
