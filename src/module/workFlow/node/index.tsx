import {
  addEdge,
  Handle,
  HandleProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import {
  EPluginLifeCycleNode,
  PluginLifeCycleNode,
} from "./PluginLifeCycle/OnLoadNode";
import { ESyFeatureNode, SyFeatureNode } from "./SyFeature";
import styles from "./index.module.less";

export interface INodeWrapperProps {
  children: React.ReactNode;
  handle?: HandleProps[];
}

function NodeWrapper(props: INodeWrapperProps) {
  const {
    children,
    handle = [
      {
        type: "target",
        position: Position.Left,
      },
      {
        type: "source",
        position: Position.Right,
        title: "连接",
      },
    ],
  } = props;

  const { setEdges } = useReactFlow();

  return (
    <div className={styles.nodeWrapper}>
      {children}
      {handle?.map((item: HandleProps) => (
        <Handle
          {...item}
          onConnect={(connection) => {
            setEdges((edges) => addEdge(connection, edges));
          }}
        />
      ))}
    </div>
  );
}
export default NodeWrapper;

export const nodeTypes = {
  [EPluginLifeCycleNode.OnLoadNode]: PluginLifeCycleNode.OnLoadNode,
  [EPluginLifeCycleNode.OnLayoutReadyNode]:
    PluginLifeCycleNode.OnLayoutReadyNode,
  [EPluginLifeCycleNode.OnUnloadNode]: PluginLifeCycleNode.OnUnloadNode,
  [EPluginLifeCycleNode.OnUninstallNode]: PluginLifeCycleNode.OnUninstallNode,
  [ESyFeatureNode.AddStyleNode]: SyFeatureNode.AddStyleNode,
};
