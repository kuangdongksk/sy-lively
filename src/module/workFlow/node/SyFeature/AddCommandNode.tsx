import NodeWrapper from "..";

export interface IAddCommandNodeProps {}

function AddCommandNode(props: IAddCommandNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <div>添加快捷键</div>
    </NodeWrapper>
  );
}
export default AddCommandNode;
