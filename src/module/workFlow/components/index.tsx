import {
  Background,
  Controls,
  FinalConnectionState,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback, useRef } from "react";
import { Menu } from "siyuan";
import { nodeTypes } from "../node";
import { EPluginLifeCycleNode } from "../node/PluginLifeCycle/OnLoadNode";
import { ESyFeatureNode } from "../node/SyFeature";
import styles from "./index.module.less";

export interface IFlowProps {}

const initialNodes = [
  {
    id: nanoid(),
    position: { x: 0, y: 0 },
    type: EPluginLifeCycleNode.OnLoadNode as keyof typeof nodeTypes,
    data: { label: "OnLoad" },
  },
];
const initialEdges = [];

function Flow(props: IFlowProps) {
  const {} = props;

  const menuRef = useRef<Menu>(new Menu(nanoid()));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnectEnd = useCallback(
    (event: MouseEvent, connectionState: FinalConnectionState) => {
      console.log("🚀 ~ Flow ~ event:", event, menuRef);
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const menu = new Menu(nanoid());
        menu.addSeparator();
        menu.addItem({
          label: "添加生命周期",
          click: () => {},
        });
        menu.open({
          x: event.clientX,
          y: event.clientY,
        });
        console.log("🚀 ~ Flow ~ menu:", menu);

        menuRef.current.addItem({
          label: "添加全局样式",
          click: () => {
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
              type: ESyFeatureNode.AddStyleNode,
              origin: [0.5, 0.0],
            };

            setNodes((nds) => nds.concat(newNode));
            setEdges((eds) =>
              eds.concat({
                id,
                source: connectionState.fromNode.id,
                target: id,
              })
            );
          },
        });

        menuRef.current.open({
          x: event.clientX,
          y: event.clientY,
        });
        console.log("🚀 ~ Flow ~ menuRef.current:", menuRef.current);
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
      onConnectEnd={onConnectEnd}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
      onContextMenu={(e) => {
        if (menuRef.current.isOpen) return;
        menuRef.current.addItem({
          label: "添加生命周期节点",
          submenu: [
            {
              label: "添加布局完成节点",
              click: () => {
                const id = nanoid();
                const { clientX, clientY } =
                  "changedTouches" in e ? e.changedTouches[0] : e;
                const newNode = {
                  id,
                  position: screenToFlowPosition({
                    x: clientX,
                    y: clientY,
                  }),
                  data: { label: `Node ${id}` },
                  type: EPluginLifeCycleNode.OnLayoutReadyNode,
                  origin: [0.5, 0.0],
                };

                setNodes((nds) => nds.concat(newNode));
              },
            },
            {
              label: "添加卸载节点",
              click: () => {
                const id = nanoid();
                const { clientX, clientY } =
                  "changedTouches" in e ? e.changedTouches[0] : e;
                const newNode = {
                  id,
                  position: screenToFlowPosition({
                    x: clientX,
                    y: clientY,
                  }),
                  data: { label: `Node ${id}` },
                  type: EPluginLifeCycleNode.OnUnloadNode,
                  origin: [0.5, 0.0],
                };

                setNodes((nds) => nds.concat(newNode));
              },
            },
            {
              label: "添加删除节点",
              click: () => {
                const id = nanoid();
                const { clientX, clientY } =
                  "changedTouches" in e ? e.changedTouches[0] : e;
                const newNode = {
                  id,
                  position: screenToFlowPosition({
                    x: clientX,
                    y: clientY,
                  }),
                  data: { label: `Node ${id}` },
                  type: EPluginLifeCycleNode.OnUninstallNode,
                  origin: [0.5, 0.0],
                };

                setNodes((nds) => nds.concat(newNode));
              },
            },
          ],
        });
        menuRef.current.addItem({
          label: "添加思源功能节点",
          submenu: [
            {
              label: "添加样式节点",
              click: () => {
                const id = nanoid();
                const { clientX, clientY } =
                  "changedTouches" in e ? e.changedTouches[0] : e;
                const newNode = {
                  id,
                  position: screenToFlowPosition({
                    x: clientX,
                    y: clientY,
                  }),
                  data: { label: `Node ${id}` },
                  type: ESyFeatureNode.AddStyleNode,
                  origin: [0.5, 0.0],
                };

                setNodes((nds) => nds.concat(newNode));
              },
            },
          ],
        });

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
