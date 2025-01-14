import {
  addEdge,
  Handle,
  HandleProps,
  Position,
  useReactFlow,
  Node,
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

export function isAllowConnection(source: Node, target: Node) {
  const sourceType = source.type;
  const targetType = target.type as keyof typeof nodeTypes;

  switch (sourceType) {
    case EPluginLifeCycleNode.OnLoadNode:
      if (targetType === EPluginLifeCycleNode.OnLoadNode) {
        return false;
      }
      return true;
    case EPluginLifeCycleNode.OnLayoutReadyNode:
      return [
        EPluginLifeCycleNode.OnUninstallNode,
        EPluginLifeCycleNode.OnUnloadNode,
        ESyFeatureNode.AddStyleNode,
      ].includes(targetType);

    default:
      return true;
  }
}
