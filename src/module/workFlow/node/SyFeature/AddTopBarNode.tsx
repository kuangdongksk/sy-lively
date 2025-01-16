import NodeWrapper from "..";

export interface IAddTopBarNodeProps {}

function AddTopBarNode(props: IAddTopBarNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <div>AddCommandNode</div>
    </NodeWrapper>
  );
}
export default AddTopBarNode;
