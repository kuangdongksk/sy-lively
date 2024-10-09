import { 事项状态 } from "../../../../constant/状态配置";

export type TCorn = string;

export interface I事项Props {
  id: string;
  名称: string;
  重要程度: number;
  紧急程度: number;
  开始时间: string;
  结束时间: string;
  状态: 事项状态;
  重复: TCorn | false;
}

function 事项(props: I事项Props) {
  const { id, 名称, 重要程度, 紧急程度, 开始时间, 结束时间 } = props;
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div>{名称}</div>
      <div>{重要程度}</div>
      <div>{紧急程度}</div>
      <div>{开始时间}</div>
      <div>{结束时间}</div>
    </div>
  );
}

export default 事项;
