import NodeWrapper from "../..";

export interface IAddStyleNodeProps {}

function AddStyleNode(props: IAddStyleNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <div>添加样式</div>
    </NodeWrapper>
  );
}
export default AddStyleNode;
