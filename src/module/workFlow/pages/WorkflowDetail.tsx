import { ReactFlowProvider } from "@xyflow/react";
import Flow from "../components";

export interface IWorkFlowDetailProps {}

function WorkFlowDetail(props: IWorkFlowDetailProps) {
  const {} = props;
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
export default WorkFlowDetail;
