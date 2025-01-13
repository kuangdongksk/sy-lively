import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Flow from "./components";

export interface IWorkFlowProps {}

function WorkFlow(props: IWorkFlowProps) {
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
export default WorkFlow;
