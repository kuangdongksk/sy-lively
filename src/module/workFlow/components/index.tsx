import {
  Background,
  Controls,
  FinalConnectionState,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback, useRef } from "react";
import { Menu } from "siyuan";
import nodeTypes from "../node";
import { EPluginLifeCycle } from "../node/PluginLifeCycle/onLoad";
import styles from "./index.module.less";

export interface IFlowProps {}

const initialNodes = [
  {
    id: nanoid(),
    position: { x: 0, y: 0 },
    type: EPluginLifeCycle.onLoad,
    data: { label: "OnLoad" },
  },
];
const initialEdges = [];

function Flow(props: IFlowProps) {
  const {} = props;

  const menuRef = useRef<Menu>(new Menu());

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = nanoid();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}` },
          type: undefined,
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id })
        );
      }
    },
    [screenToFlowPosition]
  );

  return (
    <ReactFlow
      className={styles.xyFlow}
      edges={edges}
      fitView
      nodes={nodes}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
      onContextMenu={(e) => {
        menuRef.current.open({
          x: e.clientX,
          y: e.clientY,
        });
      }}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
export default Flow;
