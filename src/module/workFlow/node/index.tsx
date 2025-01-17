import { addEdge, Handle, HandleProps, Position, useReactFlow, Node } from "@xyflow/react";
import { EPluginLifeCycleNode, PluginLifeCycleNode } from "./PluginLifeCycle/OnLoadNode";
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
  [EPluginLifeCycleNode.OnLayoutReadyNode]: PluginLifeCycleNode.OnLayoutReadyNode,
  [EPluginLifeCycleNode.OnUnloadNode]: PluginLifeCycleNode.OnUnloadNode,
  [EPluginLifeCycleNode.OnUninstallNode]: PluginLifeCycleNode.OnUninstallNode,
  // SyFeature
  [ESyFeatureNode.AddCommandNode]: SyFeatureNode.AddCommandNode,
  [ESyFeatureNode.AddSlashCommandNode]: SyFeatureNode.AddSlashCommandNode,
  [ESyFeatureNode.AddStyleNode]: SyFeatureNode.AddStyleNode,
  [ESyFeatureNode.AddTabNode]: SyFeatureNode.AddTabNode,
  [ESyFeatureNode.AddTopBarNode]: SyFeatureNode.AddTopBarNode,
  [ESyFeatureNode.LoadDataNode]: SyFeatureNode.LoadDataNode,
  [ESyFeatureNode.SaveDataNode]: SyFeatureNode.SaveDataNode,
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

    case EPluginLifeCycleNode.OnUnloadNode:
      return [EPluginLifeCycleNode.OnUninstallNode as string].includes(targetType);

    case EPluginLifeCycleNode.OnUninstallNode:
      return false;

    default:
      return true;
  }
}
