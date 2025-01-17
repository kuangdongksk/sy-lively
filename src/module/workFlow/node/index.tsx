import { addEdge, Handle, HandleProps, Node, Position, useReactFlow } from "@xyflow/react";
import { EPluginLifeCycleNode } from "./PluginLifeCycle/OnLoadNode";
import { ESyFeatureNode } from "./SyFeature";

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
    <div className="p-[12px] border-[1px] border-solid">
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

export function isAllowConnection(source: Node, target: Node) {
  const sourceType = source.type;
  const targetType = target.type as any; //as keyof typeof nodeTypes;

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
      return [EPluginLifeCycleNode.OnUninstallNode].includes(targetType);

    case EPluginLifeCycleNode.OnUninstallNode:
      return false;

    default:
      return true;
  }
}
