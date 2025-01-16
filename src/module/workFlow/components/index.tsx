import { message } from "@/components/base/rc/Message";
import { EBtnClass } from "@/components/base/sy/按钮";
import { EStoreKey } from "@/constant/系统码";
import { storeAtom } from "@/store";
import {
  Background,
  Connection,
  Controls,
  Edge,
  FinalConnectionState,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowJsonObject,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "siyuan";
import { IWorkFlowData } from "..";
import { isAllowConnection, nodeTypes } from "../node";
import { EPluginLifeCycleNode } from "../node/PluginLifeCycle/OnLoadNode";
import { ContextMenuConfig } from "../node/SyFeature";
import { NodeType } from "../types";
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
  const { state } = useLocation() as {
    state: Readonly<
      Omit<IWorkFlowData, "data"> & {
        data?: ReactFlowJsonObject<NodeType>;
      }
    >;
  };
  const [{ load, save }] = useAtom(storeAtom);

  const menuRef = useRef<Menu>(new Menu(nanoid()));

  const [instance, setInstance] = useState<ReactFlowInstance>(null);
  const [checkPasses, setCheckPasses] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, getEdge, getEdges, getNode, getNodes } = useReactFlow();

  const [lifeCycleNodeCount, setLifeCycleNodeCount] = useState([1, 0, 0, 0]);

  useEffect(() => {
    const data = state.data;
    if (data) setNodes(data.nodes || []), setEdges(data.edges || []);
  }, [state]);

  const isValidConnection = useCallback((edge: Edge | Connection) => {
    const source = getNode(edge.source);
    const target = getNode(edge.target);

    return isAllowConnection(source, target);
  }, []);

  const onCheck = useCallback(() => {
    setCheckPasses(true);
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent, connectionState: FinalConnectionState) => {
      if (!connectionState.isValid) {
      }
    },
    [screenToFlowPosition]
  );

  const onSave = useCallback(async () => {
    if (instance) {
      const allWorkFlow = new Map(Object.entries((await load(EStoreKey.WorkFlow)) || {}));

      const data = instance.toObject();
      allWorkFlow.set(state.id, { ...state, checkPasses, data });
      await save(EStoreKey.WorkFlow, { ...Object.fromEntries(allWorkFlow) });
      message.success("保存成功");
    }
  }, [instance]);

  return (
    <ReactFlow<NodeType>
      className={styles.xyFlow}
      edges={edges}
      fitView
      nodes={nodes}
      nodeTypes={nodeTypes}
      isValidConnection={isValidConnection}
      onConnectEnd={onConnectEnd}
      onEdgesChange={onEdgesChange}
      onInit={setInstance}
      onNodesChange={onNodesChange}
      onContextMenu={(e) => {
        if (menuRef.current.isOpen) return;
        menuRef.current.addItem({
          label: "添加生命周期节点",
          submenu: [
            {
              label: "添加布局完成节点",
              disabled: lifeCycleNodeCount[1] > 0,
              click: () => {
                const id = nanoid();
                const { clientX, clientY } = "changedTouches" in e ? e.changedTouches[0] : e;
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
                setLifeCycleNodeCount((count) => {
                  count[1]++;
                  return count;
                });
              },
            },
            {
              label: "添加卸载节点",
              disabled: lifeCycleNodeCount[2] > 0,
              click: () => {
                const id = nanoid();
                const { clientX, clientY } = "changedTouches" in e ? e.changedTouches[0] : e;
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
                setLifeCycleNodeCount((count) => {
                  count[2]++;
                  return count;
                });
              },
            },
            {
              label: "添加删除节点",
              disabled: lifeCycleNodeCount[3] > 0,
              click: () => {
                const id = nanoid();
                const { clientX, clientY } = "changedTouches" in e ? e.changedTouches[0] : e;
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
                setLifeCycleNodeCount((count) => {
                  count[3]++;
                  return count;
                });
              },
            },
          ],
        });
        menuRef.current.addItem({
          label: "添加思源功能节点",
          submenu: ContextMenuConfig.map((config) => ({
            label: config.label,
            click: () => {
              const id = nanoid();
              const { clientX, clientY } = "changedTouches" in e ? e.changedTouches[0] : e;
              const newNode = {
                id,
                position: screenToFlowPosition({
                  x: clientX,
                  y: clientY,
                }),
                data: { label: `Node ${id}` },
                type: config.node,
                origin: [0.5, 0.0],
              };

              setNodes((nds) => nds.concat(newNode));
            },
          })),
        });

        menuRef.current.open({
          x: e.clientX,
          y: e.clientY,
        });
      }}
    >
      <Background />
      <Controls />
      <MiniMap<NodeType> />
      <Panel position="top-center">
        <button className={EBtnClass.默认} onClick={onSave}>
          保存
        </button>
        <button className={EBtnClass.默认} onClick={onCheck}>
          检查
        </button>
      </Panel>
    </ReactFlow>
  );
}
export default Flow;
